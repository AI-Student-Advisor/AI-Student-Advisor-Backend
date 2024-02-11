import { getVectorStore } from "/ai/vector-stores/VectorStore.js";
import { DataRetrieverConfig } from "/structs/ai/AIStructs.js";
import { dlog } from "/utilities/dlog.js";
import { createRetrieverTool } from "langchain/tools/retriever";

export class DataRetriever {
  retrieverToolName: string = "";
  context: string = "";
  retrieverTool: any;
  private retriever: any;

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
  async setupRetriever(config: DataRetrieverConfig) {
    dlog.msg("Setting up retriever...");

    // set name and context
    this.retrieverToolName = config.retrieverToolName;
    this.context = config.context;

    // get the appropriate vector store
    // this might also involve embedding generation
    // and saving the embeddings to the cloud
    // depending on the loader provided and
    // other configuration settings
    const vectorstore = await getVectorStore(config.vectorStoreConfig);

    // create retriever using the vector store
    this.retriever = vectorstore.asRetriever();

    dlog.msg("Data Retriever setup completed");
    return this.retrieverTool;
  }

  getRetrieverTool() {
    // setup retriever tool
    const retrieverTool = createRetrieverTool(this.retriever, {
      name: this.retrieverToolName,
      description: `Search for information about ${this.context}. You must use this tool if user's question is related to ${this.context} and the information present in the conversation history is not enough. If the user query can not be confidently answered using the information retrieved and returned by this tool and the ongoing conversation history, don't answer the user query but instead simply inform the user that you don't have enough information to answer the query.`
    });
    dlog.msg("Retriever tool created");
    return retrieverTool;
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
