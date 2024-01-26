// Return vector database based on type

import { VECTOR_DB_TYPE } from "./VectorDatabasesConfig";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

export function getVectorDatabase(vectorDBType: VECTOR_DB_TYPE) {
  switch (vectorDBType) {
    case VECTOR_DB_TYPE.PINECONE:
      return undefined;
    case VECTOR_DB_TYPE.MEMORY:
      return MemoryVectorStore;
    default:
      throw new Error("Invalid vector database type");
  }
}
