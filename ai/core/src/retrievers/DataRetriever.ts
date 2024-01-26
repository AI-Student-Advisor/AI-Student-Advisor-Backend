import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createRetrieverTool } from "langchain/tools/retriever";
import { dlog } from "../../utilities/dlog";
import { getEmbeddingModel } from "../embedding-models/BedrockEmbeddingModel";
import { getVectorDatabase } from "src/vector-databases/VectorDatabases";
import { VECTOR_DB_TYPE } from "src/vector-databases/VectorDatabasesConfig";

export type DataRetrieverConfig = {
  type: "webpage" | "website" | "text";
  name: string;
  context: string;
  loader: any;
  vector_db_type: VECTOR_DB_TYPE;
  url?: string;
  chunkSize?: number;
  chunkOverlap?: number;
};

export class DataRetriever {
  type: "webpage" | "website" | "text";
  name: string;
  context: string;
  loader: any;
  vectorDBType: VECTOR_DB_TYPE;
  url: string | undefined;
  chunkSize: number;
  chunkOverlap: number;
  retriever: any;
  retrieverTool: any;

  // https://js.langchain.com/docs/modules/data_connection/document_transformers/#get-started-with-text-splitters
  private static DEFAULT_CHUNK_SIZE = 1000;
  private static DEFAULT_CHUNK_OVERLAP = 200;

  constructor(dataRetrieverConfig: DataRetrieverConfig) {
    this.type = dataRetrieverConfig.type;
    this.name = dataRetrieverConfig.name;
    this.context = dataRetrieverConfig.context;
    this.loader = dataRetrieverConfig.loader;
    this.vectorDBType = dataRetrieverConfig.vector_db_type;
    this.url = dataRetrieverConfig.url || undefined;
    this.chunkSize =
      dataRetrieverConfig.chunkSize || DataRetriever.DEFAULT_CHUNK_SIZE;
    this.chunkOverlap =
      dataRetrieverConfig.chunkOverlap || DataRetriever.DEFAULT_CHUNK_OVERLAP;
  }

  async setupRetriever() {
    dlog.msg("Setting up retriever...");

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

    // get the configured embedding model: src/langchain/embedding-models/
    const embeddings = getEmbeddingModel();
    dlog.msg("Embedding model created");

    // get appropriate vector store based on the type
    const vectoreStoreInstance = getVectorDatabase(this.vectorDBType);
    // verify if vector store instance is valid
    if (vectoreStoreInstance === undefined || vectoreStoreInstance === null) {
      throw new Error("DataRetriever.ts: Invalid vector store instance");
    }
    // generate embeddings for the documents and store in the vector store
    const vectorstore = await vectoreStoreInstance.fromDocuments(
      docs,
      embeddings
    );
    dlog.msg("Vector store created");

    this.retriever = vectorstore.asRetriever();
    dlog.msg("Retriever created");

    this.retrieverTool = createRetrieverTool(this.retriever, {
      name: this.name,
      description: `Search for information about ${this.context}. You must use this tool! If user query is not found in the knowledge base, inform the user about it.`,
    });
    dlog.msg("Retriever tool created");

    dlog.msg("Data Retriever setup completed");
    return this.retriever;
  }

  getRetrieverTool() {
    return this.retrieverTool;
  }

  async queryRetriever(userQuery: string) {
    if (this.retriever === undefined || this.retriever === null) {
      throw new Error("DataRetriever.ts: Retriever is not initialized");
    }
    const retrieverResult = await this.retriever.getRelevantDocuments(
      userQuery
    );
    return retrieverResult;
  }
}
