import { CloseVectorNode } from "@langchain/community/vectorstores/closevector/node";
import { AppConfig } from "../../config/AppConfig";
import {
  getCloseVectorStoreAccessKey,
  getCloseVectorStoreSecretKey,
} from "../../config/keys";

export async function getCloseVectorStore(embeddingModel: any) {
  // Load the vector store from the cloud
  const loadedVectorStore = await CloseVectorNode.loadFromCloud({
    uuid: AppConfig.ai.close_vector_store_uuid,
    embeddings: embeddingModel,
    credentials: {
      key: getCloseVectorStoreAccessKey(),
      secret: getCloseVectorStoreSecretKey(),
    },
  });
  // return the vector store
  return loadedVectorStore;
}
