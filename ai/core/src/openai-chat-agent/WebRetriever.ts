import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createRetrieverTool } from "langchain/tools/retriever";

export type WebRetrieverConfig = {
  name: string;
  context: string;
  url: string;
  chunkSize?: number;
  chunkOverlap?: number;
};

export class WebRetriever {
  name: string;
  context: string;
  url: string;
  chunkSize: number;
  chunkOverlap: number;
  retriever: any;
  retrieverTool: any;

  // https://js.langchain.com/docs/modules/data_connection/document_transformers/#get-started-with-text-splitters
  private static DEFAULT_CHUNK_SIZE = 1000;
  private static DEFAULT_CHUNK_OVERLAP = 200;

  constructor(webRetrieverConfig: WebRetrieverConfig) {
    this.name = webRetrieverConfig.name;
    this.context = webRetrieverConfig.context;
    this.url = webRetrieverConfig.url;
    this.chunkSize =
      webRetrieverConfig.chunkSize || WebRetriever.DEFAULT_CHUNK_SIZE;
    this.chunkOverlap =
      webRetrieverConfig.chunkOverlap || WebRetriever.DEFAULT_CHUNK_OVERLAP;

    this.setupRetriever();
  }

  async setupRetriever() {
    const loader = new CheerioWebBaseLoader(this.url);
    const rawDocs = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: this.chunkSize,
      chunkOverlap: this.chunkOverlap,
    });
    const docs = await splitter.splitDocuments(rawDocs);

    const vectorstore = await MemoryVectorStore.fromDocuments(
      docs,
      new OpenAIEmbeddings()
    );

    this.retriever = vectorstore.asRetriever();

    this.retrieverTool = createRetrieverTool(this.retriever, {
      name: this.name,
      description: `Search for information about ${this.context}. You must use this tool! If user query is not found in the knowledge base, inform the user about it.`,
    });
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
