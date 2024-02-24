import { AppConfig } from "/config/AppConfig.js";
import {
  getUOttawaEmbAppToken,
  getUOttawaEmbEndpoint,
  getUOttawaEmbCollection
} from "/config/keys.js";
import { logger } from "/utilities/Log.js";
import {
  AstraDBVectorStore,
  AstraLibArgs
} from "@langchain/community/vectorstores/astradb";

// const astraConfig: AstraLibArgs = {
//   token: getAstraDBApplicationToken(),
//   endpoint: getAstraDBEndpoint(),
//   collection: getAstraDBCollection(),
//   collectionOptions: {
//     vector: {
//       dimension: AppConfig.ai.astraDB.dimension,
//       metric: "cosine"
//     }
//   }
// };

const loggerContext = "AstraDBVectorStore";

const astraConfig: AstraLibArgs = {
  token: getUOttawaEmbAppToken(),
  endpoint: getUOttawaEmbEndpoint(),
  collection: getUOttawaEmbCollection(),
  collectionOptions: {
    vector: {
      dimension: AppConfig.ai.astraDB.dimension,
      metric: "cosine"
    }
  }
};

export async function getAstraDBFromDocuments(docs: any, embeddings: any) {
  logger.debug(
    { context: loggerContext },
    "Creating AstraDB vector store from documents"
  );
  // Create the vector store from a webpage
  const createdVectorStore = await AstraDBVectorStore.fromDocuments(
    docs,
    embeddings,
    astraConfig
  );
  logger.debug({ context: loggerContext }, "AstraDB vector store created");
  // return the vector store
  return createdVectorStore;
}

export async function getExistingAstraDBStore(embeddingModel: any) {
  logger.debug(
    { context: loggerContext },
    "Loading AstraDB vector store from the cloud"
  );
  // Load the vector store from the cloud
  const loadedVectorStore = await AstraDBVectorStore.fromExistingIndex(
    embeddingModel,
    astraConfig
  );
  // return the vector store
  return loadedVectorStore;
}
