import {
  getExistingPinconeStore,
  getPineconeFromDocuments
} from "./PineconeVectorStore.js";
import { VECTOR_STORE, VectorStoreConfig } from "/ai/AIStructs.js";
import { getEmbeddingModel } from "/ai/embedding-models/EmbeddingModel.js";
import { logger } from "/utilities/Log.js";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

const loggerContext = "VectorStore";

export async function getVectorStore(config: VectorStoreConfig) {
  // to store the vector store
  let vectorStore: any = null;

  if (config.loadVectorStoreFromCloud) {
    // get the embedding model based on the type
    const embeddingsModel = getEmbeddingModel(config.embeddingModelType);
    vectorStore = await getCloudVectorDatabase(
      config.vectorDBType,
      embeddingsModel
    );
    logger.debug({ context: loggerContext }, "Vector store loaded");
  } else {
    // confirm loader is initialized
    if (config.loader === undefined || config.loader === null) {
      throw new Error("Vector store loader is not initialized");
    }

    const rawDocs = await config.loader.load();
    logger.debug({ context: loggerContext }, "Raw docs loaded");

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: config.chunkSize,
      chunkOverlap: config.chunkOverlap
    });
    logger.debug({ context: loggerContext }, "Text splitter completed");

    const docs = await splitter.splitDocuments(rawDocs);
    logger.debug({ context: loggerContext }, "Documents splitter completed");

    // get the embedding model based on the type
    const embeddings = getEmbeddingModel(config.embeddingModelType);
    logger.debug({ context: loggerContext }, "Embedding model created");

    // get the vector database based on the type
    vectorStore = await getVectorStoreFromDocuments(
      config.vectorDBType,
      docs,
      embeddings
    );
    logger.debug({ context: loggerContext }, "Vector store created");
  }

  // return the vector store
  return vectorStore;
}

async function getVectorStoreFromDocuments(
  vectorDBType: VECTOR_STORE,
  docs: any,
  embeddings: any
) {
  switch (vectorDBType) {
    case VECTOR_STORE.PINECONE:
      return await getPineconeFromDocuments(docs, embeddings);
    case VECTOR_STORE.MEMORY:
      return await MemoryVectorStore.fromDocuments(docs, embeddings);
    default:
      throw new Error("Invalid vector store type");
  }
}

async function getCloudVectorDatabase(
  vectorDBType: VECTOR_STORE,
  embeddingModel: any
) {
  if (embeddingModel === undefined || embeddingModel === null) {
    throw new Error("Embedding model is required for Close Vector Store");
  }
  switch (vectorDBType) {
    case VECTOR_STORE.PINECONE:
      return await getExistingPinconeStore(embeddingModel);
    default:
      throw new Error("Invalid cloud vector database type");
  }
}
