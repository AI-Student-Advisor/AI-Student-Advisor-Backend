import { CloseVectorNode } from "@langchain/community/vectorstores/closevector/node";
import { VECTOR_DB_TYPE } from "./VectorDatabasesConfig";
import { EMBEDDING_MODELS } from "src/embedding-models/EmbeddingModelsConfig";
import { AppConfig } from "../../config/AppConfig";
import {
  getCloseVectorStoreAccessKey,
  getCloseVectorStoreSecretKey,
} from "../../config/keys";
import { getEmbeddingModel } from "../../src/embedding-models/EmbeddingModel";

export async function getCloseVectorStore(
  embeddingModelType: EMBEDDING_MODELS
) {
  // Load the vector store from the cloud
  const loadedVectorStore = await CloseVectorNode.loadFromCloud({
    uuid: AppConfig.ai.close_vector_store_uuid,
    embeddings: getEmbeddingModel(embeddingModelType),
    credentials: {
      key: getCloseVectorStoreAccessKey(),
      secret: getCloseVectorStoreSecretKey(),
    },
  });
  // return the vector store
  return loadedVectorStore;
}
