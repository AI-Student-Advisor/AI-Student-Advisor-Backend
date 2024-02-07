import {
  getAstraDBFromDocuments,
  getExistingAstraDBStore
} from "./AstraDBVectorStore.js";
import { getEmbeddingModel } from "/ai/embedding-models/EmbeddingModel.js";
import { VECTOR_DB_TYPE, VectorStoreConfig } from "/structs/ai/AIStructs.js";
import { dlog } from "/utilities/dlog.js";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

export async function getVectorStore(config: VectorStoreConfig) {
  // to store the vector store
  let vectorstore: any = null;

  if (config.loadVectorStoreFromCloud) {
    // get the embedding model based on the type
    const embeddingsModel = getEmbeddingModel(config.embeddingModelType);
    vectorstore = await getCloudVectorDatabase(
      config.vectorDBType,
      embeddingsModel
    );
    dlog.msg("Vector store loaded");
  } else {
    // confirm loader is initialized
    if (config.loader === undefined || config.loader === null) {
      throw new Error("DataRetriever.ts: Loader is not initialized");
    }

    const rawDocs = await config.loader.load();
    dlog.msg("Raw docs loaded");

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: config.chunkSize,
      chunkOverlap: config.chunkOverlap
    });
    dlog.msg("Text splitter completed");

    const docs = await splitter.splitDocuments(rawDocs);
    dlog.msg("Documents splitter completed");

    // get the embedding model based on the type
    const embeddings = getEmbeddingModel(config.embeddingModelType);
    dlog.msg("Embedding model created");

    // get the vector database based on the type
    vectorstore = await getVectorStoreFromDocuments(
      config.vectorDBType,
      docs,
      embeddings
    );
    dlog.msg("Vector store created");
  }

  // return the vector store
  return vectorstore;
}

async function getVectorStoreFromDocuments(
  vectorDBType: VECTOR_DB_TYPE,
  docs: any,
  embeddings: any
) {
  switch (vectorDBType) {
    case VECTOR_DB_TYPE.ASTRA_DB:
      return await getAstraDBFromDocuments(docs, embeddings);
    case VECTOR_DB_TYPE.MEMORY:
      return await MemoryVectorStore.fromDocuments(docs, embeddings);
    default:
      throw new Error("Invalid vector store type");
  }
}

async function getCloudVectorDatabase(
  vectorDBType: VECTOR_DB_TYPE,
  embeddingModel: any
) {
  if (embeddingModel === undefined || embeddingModel === null) {
    throw new Error("Embedding model is required for Close Vector Store");
  }
  switch (vectorDBType) {
    case VECTOR_DB_TYPE.ASTRA_DB:
      return await getExistingAstraDBStore(embeddingModel);
    default:
      throw new Error("Invalid cloud vector database type");
  }
}
