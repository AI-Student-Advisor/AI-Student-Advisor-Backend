import {
  AstraDBVectorStore,
  AstraLibArgs,
} from "@langchain/community/vectorstores/astradb";
import { AppConfig } from "../../config/AppConfig";
import {
  getAstraDBApplicationToken,
  getAstraDBEndpoint,
  getAstraDBCollection,
} from "../../config/keys";
import { dlog } from "../../utilities/dlog";

const astraConfig: AstraLibArgs = {
  token: getAstraDBApplicationToken(),
  endpoint: getAstraDBEndpoint(),
  collection: getAstraDBCollection(),
  collectionOptions: {
    vector: {
      dimension: AppConfig.ai.astraDB.dimension,
      metric: "cosine",
    },
  },
};

export async function getAstraDBFromDocuments(docs: any, embeddings: any) {
  dlog.msg("Creating AstraDB vector store from documents");
  // Create the vector store from a webpage
  const createdVectorStore = await AstraDBVectorStore.fromDocuments(
    docs,
    embeddings,
    astraConfig
  );
  dlog.msg("AstraDB vector store created");
  // return the vector store
  return createdVectorStore;
}

export async function getExistingAstraDBStore(embeddingModel: any) {
  dlog.msg("Loading AstraDB vector store from the cloud");
  // Load the vector store from the cloud
  const loadedVectorStore = await AstraDBVectorStore.fromExistingIndex(
    embeddingModel,
    astraConfig
  );
  // return the vector store
  return loadedVectorStore;
}
