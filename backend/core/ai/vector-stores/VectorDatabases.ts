// Return vector database based on type

import { CloseVectorNode } from "@langchain/community/vectorstores/closevector/node";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { VECTOR_DB_TYPE } from "../../structs/ai/AIStructs";
import { getCloseVectorStore } from "./CloseVectorStore";

export function getVectorDatabase(vectorDBType: VECTOR_DB_TYPE) {
  switch (vectorDBType) {
    case VECTOR_DB_TYPE.CLOSE_VECTOR_STORE:
      return CloseVectorNode;
    case VECTOR_DB_TYPE.MEMORY:
      return MemoryVectorStore;
    default:
      throw new Error("Invalid vector database type");
  }
}

export async function getCloudVectorDatabase(
  vectorDBType: VECTOR_DB_TYPE,
  embeddingModel: any
) {
  if (embeddingModel === undefined || embeddingModel === null)
    throw new Error("Embedding model is required for Close Vector Store");
  switch (vectorDBType) {
    case VECTOR_DB_TYPE.CLOSE_VECTOR_STORE_CLOUD:
      return await getCloseVectorStore(embeddingModel);
    default:
      throw new Error("Invalid cloud vector database type");
  }
}
