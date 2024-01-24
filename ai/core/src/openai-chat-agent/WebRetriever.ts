import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
// import { PlaywrightWebBaseLoader } from "langchain/document_loaders/web/playwright";
// import { TextLoader } from "langchain/document_loaders/fs/text";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createRetrieverTool } from "langchain/tools/retriever";
import { dlog } from "../../utilities/dlog";

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
  private static DEFAULT_CHUNK_SIZE = 500;
  private static DEFAULT_CHUNK_OVERLAP = 100;

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
    dlog.msg("Setting up retriever...");
    dlog.msg("URL is: " + this.url);

    // const loader = new TextLoader(
    //   "src/openai-chat-agent/state_of_the_union.txt"
    // );
    // dlog.msg("Text loader created");

    // const loader = new PlaywrightWebBaseLoader(this.url, {
    //   launchOptions: {
    //     headless: true,
    //   },
    //   gotoOptions: {
    //     waitUntil: "domcontentloaded",
    //   },
    // });
    const loader = new CheerioWebBaseLoader(this.url);
    dlog.msg("Web base loader created");

    const rawDocs = await loader.load();
    dlog.msg("Raw docs loaded");
    dlog.msg(rawDocs[0].pageContent);

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: this.chunkSize,
      chunkOverlap: this.chunkOverlap,
    });
    dlog.msg("Text splitter completed");

    const docs = await splitter.splitDocuments(rawDocs);
    dlog.msg("Documents splitter completed");

    const vectorstore = await MemoryVectorStore.fromDocuments(
      docs,
      new OpenAIEmbeddings()
    );
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
