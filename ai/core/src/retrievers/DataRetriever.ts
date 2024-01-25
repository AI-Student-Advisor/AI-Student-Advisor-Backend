import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createRetrieverTool } from "langchain/tools/retriever";
import { dlog } from "../../utilities/dlog";
import { getEmbeddingModel } from "../embedding-models/BedrockEmbeddingModel";

export type DataRetrieverConfig = {
  type: "webpage" | "website" | "text";
  name: string;
  context: string;
  loader: any;
  url?: string;
  chunkSize?: number;
  chunkOverlap?: number;
};

export class DataRetriever {
  type: "webpage" | "website" | "text";
  name: string;
  context: string;
  url: string | undefined;
  chunkSize: number;
  chunkOverlap: number;
  retriever: any;
  retrieverTool: any;

  // https://js.langchain.com/docs/modules/data_connection/document_transformers/#get-started-with-text-splitters
  private static DEFAULT_CHUNK_SIZE = 500;
  private static DEFAULT_CHUNK_OVERLAP = 100;

  constructor(dataRetrieverConfig: DataRetrieverConfig) {
    this.type = dataRetrieverConfig.type;
    this.name = dataRetrieverConfig.name;
    this.context = dataRetrieverConfig.context;
    this.url = dataRetrieverConfig.url || undefined;
    this.chunkSize =
      dataRetrieverConfig.chunkSize || DataRetriever.DEFAULT_CHUNK_SIZE;
    this.chunkOverlap =
      dataRetrieverConfig.chunkOverlap || DataRetriever.DEFAULT_CHUNK_OVERLAP;

    this.setupRetriever(dataRetrieverConfig.loader);
  }

  async setupRetriever(loader: any) {
    dlog.msg("Setting up retriever...");

    // confirm loader is initialized
    if (loader === undefined || loader === null) {
      throw new Error("Loader is not initialized");
    }

    const rawDocs = await loader.load();
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

    const vectorstore = await MemoryVectorStore.fromDocuments(docs, embeddings);
    dlog.msg("Memory vector store created");

    this.retriever = vectorstore.asRetriever();
    dlog.msg("Retriever created");

    this.retrieverTool = createRetrieverTool(this.retriever, {
      name: this.name,
      description: `Search for information about ${this.context}. You must use this tool! If user query is not found in the knowledge base, inform the user about it.`,
    });
    dlog.msg("Retriever tool created");
  }

  getRetrieverTool() {
    return this.retrieverTool;
  }

  async queryRetriever(userQuery: string) {
    const retrieverResult = await this.retriever.getRelevantDocuments(
      userQuery
    );
    return retrieverResult[0];
  }
}
