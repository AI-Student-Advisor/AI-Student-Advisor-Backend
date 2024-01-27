import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createRetrieverTool } from "langchain/tools/retriever";
import { dlog } from "../../utilities/dlog";
import { getEmbeddingModel } from "../embedding-models/EmbeddingModel";
import { getVectorDatabase } from "../../src/vector-databases/VectorDatabases";
import { VECTOR_DB_TYPE } from "../../src/vector-databases/VectorDatabasesConfig";
import { EMBEDDING_MODELS } from "../../src/embedding-models/EmbeddingModelsConfig";
import { getCloseVectorStore } from "../../src/vector-databases/CloseVectorStore";
import { CloseVectorNode } from "@langchain/community/vectorstores/closevector/node";
import {
  getCloseVectorStoreAccessKey,
  getCloseVectorStoreSecretKey,
} from "../../config/keys";

export type DataRetrieverConfig = {
  type: "webpage" | "website" | "text";
  name: string;
  context: string;
  loader: any;
  loadCloseVectorStoreFromCloud?: boolean;
  vectorDBType: VECTOR_DB_TYPE;
  embeddingModelType: EMBEDDING_MODELS;
  url?: string;
  chunkSize?: number;
  chunkOverlap?: number;
};

export class DataRetriever {
  type: "webpage" | "website" | "text";
  name: string;
  context: string;
  loader?: any;
  loadCloseVectorStoreFromCloud?: boolean;
  vectorDBType: VECTOR_DB_TYPE;
  embeddingModelType: EMBEDDING_MODELS;
  url: string | undefined;
  chunkSize: number;
  chunkOverlap: number;
  retrieverTool: any;

  // https://js.langchain.com/docs/modules/data_connection/document_transformers/#get-started-with-text-splitters
  private static DEFAULT_CHUNK_SIZE = 1000;
  private static DEFAULT_CHUNK_OVERLAP = 200;

  constructor(dataRetrieverConfig: DataRetrieverConfig) {
    this.type = dataRetrieverConfig.type;
    this.name = dataRetrieverConfig.name;
    this.context = dataRetrieverConfig.context;
    this.loader = dataRetrieverConfig.loader || false;
    this.loadCloseVectorStoreFromCloud =
      dataRetrieverConfig.loadCloseVectorStoreFromCloud || false;
    this.vectorDBType = dataRetrieverConfig.vectorDBType;
    this.embeddingModelType = dataRetrieverConfig.embeddingModelType;
    this.url = dataRetrieverConfig.url || undefined;
    this.chunkSize =
      dataRetrieverConfig.chunkSize || DataRetriever.DEFAULT_CHUNK_SIZE;
    this.chunkOverlap =
      dataRetrieverConfig.chunkOverlap || DataRetriever.DEFAULT_CHUNK_OVERLAP;
  }

  async setupRetriever() {
    dlog.msg("Setting up retriever...");

    // get vector store from cloud
    let vectorstore = null;

    if (this.loadCloseVectorStoreFromCloud) {
      vectorstore = await getCloseVectorStore(this.embeddingModelType);
      dlog.msg("Vector store loaded");
    } else {
      // confirm loader is initialized
      if (this.loader === undefined || this.loader === null) {
        throw new Error("DataRetriever.ts: Loader is not initialized");
      }

      const rawDocs = await this.loader.load();
      dlog.msg("Raw docs loaded");

      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: this.chunkSize,
        chunkOverlap: this.chunkOverlap,
      });
      dlog.msg("Text splitter completed");

      const docs = await splitter.splitDocuments(rawDocs);
      dlog.msg("Documents splitter completed");

      // get the embedding model based on the type
      const embeddings = getEmbeddingModel(this.embeddingModelType);
      dlog.msg("Embedding model created");

      // get appropriate vector store based on the type
      const vectoreStoreInstance = getVectorDatabase(this.vectorDBType);
      // verify if vector store instance is valid
      if (vectoreStoreInstance === undefined || vectoreStoreInstance === null) {
        throw new Error("DataRetriever.ts: Invalid vector store instance");
      }

      // generate embeddings for the documents and store in the vector store
      vectorstore = await vectoreStoreInstance.fromDocuments(docs, embeddings);
      dlog.msg("Vector store created");

      // Save the vector store to cloud
      if (vectorstore instanceof CloseVectorNode) {
        await vectorstore.saveToCloud({
          description: "uOttawa",
          public: true,
        });
        dlog.msg("Vector store saved to cloud");

        const { uuid } = vectorstore.instance;
        dlog.msg("Vector store UUID: " + uuid);
      }
    }

    this.retrieverTool = createRetrieverTool(vectorstore.asRetriever(), {
      name: this.name,
      description: `Search for information about ${this.context}. You must use this tool! If user query is not found in the knowledge base, inform the user about it.`,
    });
    dlog.msg("Retriever tool created");

    dlog.msg("Data Retriever setup completed");
    return this.retrieverTool;
  }

  getRetrieverTool() {
    return this.retrieverTool;
  }

  async queryRetriever(userQuery: string) {
    if (this.retrieverTool === undefined || this.retrieverTool === null) {
      throw new Error("DataRetriever.ts: Retriever is not initialized");
    }
    const retrieverResult = await this.retrieverTool.getRelevantDocuments(
      userQuery
    );
    return retrieverResult;
  }
}
