import { getVectorStore } from "/ai/vector-stores/VectorStore.js";
import {
  VECTOR_DB_TYPE,
  EMBEDDING_MODELS,
  DataRetrieverConfig
} from "/structs/ai/AIStructs.js";
import { dlog } from "/utilities/dlog.js";
import { createRetrieverTool } from "langchain/tools/retriever";

export class DataRetriever {
  name: string;
  context: string;
  loader?: any;
  generateEmbeddings?: boolean;
  loadVectorStoreFromCloud?: boolean;
  vectorDBType: VECTOR_DB_TYPE;
  embeddingModelType: EMBEDDING_MODELS;
  saveEmbeddingsToCloud?: boolean;
  chunkSize: number;
  chunkOverlap: number;
  retrieverTool: any;
  private retriever: any;

  // https://js.langchain.com/docs/modules/data_connection/document_transformers/#get-started-with-text-splitters
  private static DEFAULT_CHUNK_SIZE = 1000;
  private static DEFAULT_CHUNK_OVERLAP = 200;

  constructor(dataRetrieverConfig: DataRetrieverConfig) {
    this.name = dataRetrieverConfig.name;
    this.context = dataRetrieverConfig.context;
    this.loader = dataRetrieverConfig.loader;
    this.vectorDBType = dataRetrieverConfig.vectorDBType;
    this.embeddingModelType = dataRetrieverConfig.embeddingModelType;
    this.generateEmbeddings = dataRetrieverConfig.generateEmbeddings || false;
    this.loadVectorStoreFromCloud =
      dataRetrieverConfig.loadVectorStoreFromCloud || false;
    this.saveEmbeddingsToCloud =
      dataRetrieverConfig.saveEmbeddingsToCloud || false;
    this.chunkSize =
      dataRetrieverConfig.chunkSize || DataRetriever.DEFAULT_CHUNK_SIZE;
    this.chunkOverlap =
      dataRetrieverConfig.chunkOverlap || DataRetriever.DEFAULT_CHUNK_OVERLAP;
  }

  /**
   * Setup the retriever and the retriever tool to be used by the
   * LLM chat agent to query the knowledge base.
   * Might also involve embedding generation from the loader.
   * Three primary components:
   *  1. Vectore store
   *  2. Retriever
   *  3. Retriever tool
   * @returns Retriever tool
   */
  async setupRetriever() {
    dlog.msg("Setting up retriever...");

    // get the appropriate vector store
    // this might also involve embedding generation
    // and saving the embeddings to the cloud
    // depending on the loader provided and
    // other configuration settings
    const vectorstore = await getVectorStore({
      loadVectorStoreFromCloud: this.loadVectorStoreFromCloud,
      embeddingModelType: this.embeddingModelType,
      loader: this.loader,
      chunkSize: this.chunkSize,
      chunkOverlap: this.chunkOverlap,
      vectorDBType: this.vectorDBType,
      saveEmbeddingsToCloud: this.saveEmbeddingsToCloud
    });

    // create retriever using the vector store
    this.retriever = vectorstore.asRetriever();
    // setup retriever tool
    this.retrieverTool = createRetrieverTool(this.retriever, {
      name: this.name,
      description: `Search for information about ${this.context}. You must use this tool! If user query is not found in the knowledge base, inform the user about it.`
    });
    dlog.msg("Retriever tool created");

    dlog.msg("Data Retriever setup completed");
    return this.retrieverTool;
  }

  getRetrieverTool() {
    return this.retrieverTool;
  }

  async queryRetriever(userQuery: string) {
    if (this.retriever === undefined || this.retriever === null) {
      throw new Error("DataRetriever.ts: Retriever is not initialized");
    }
    dlog.msg(`DataRetriever.ts: User query received: ${userQuery}`);
    const retrieverResult =
      await this.retriever.getRelevantDocuments(userQuery);
    return retrieverResult;
  }
}
