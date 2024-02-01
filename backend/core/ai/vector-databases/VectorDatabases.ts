// Return vector database based on type

import { CloseVectorNode } from "@langchain/community/vectorstores/closevector/node";
import { VECTOR_DB_TYPE } from "./VectorDatabasesConfig";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

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
