import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { CloseVectorNode } from "@langchain/community/vectorstores/closevector/node";
import { getEmbeddingModel } from "../embedding-models/EmbeddingModel";
import { VectorStoreConfig } from "../../types/ai/AITypes";
import { getCloudVectorDatabase, getVectorDatabase } from "./VectorDatabases";
import { dlog } from "../../utilities/dlog";
import {
  getCloseVectorStoreAccessKey,
  getCloseVectorStoreSecretKey,
} from "../../config/keys";

export async function getVectorStore(config: VectorStoreConfig) {
  // to store the vector store
  let vectorstore: any = null;

  if (config.loadCloseVectorStoreFromCloud) {
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
      chunkOverlap: config.chunkOverlap,
    });
    dlog.msg("Text splitter completed");

    const docs = await splitter.splitDocuments(rawDocs);
    dlog.msg("Documents splitter completed");

    // get the embedding model based on the type
    const embeddings = getEmbeddingModel(config.embeddingModelType);
    dlog.msg("Embedding model created");

    // get appropriate vector store based on the type
    const vectoreStoreInstance = getVectorDatabase(config.vectorDBType);
    // verify if vector store instance is valid
    if (vectoreStoreInstance === undefined || vectoreStoreInstance === null) {
      throw new Error("DataRetriever.ts: Invalid vector store instance");
    }

    // Save the vector store to cloud
    if (vectoreStoreInstance === CloseVectorNode) {
      // generate embeddings for the documents and store in the vector store
      vectorstore = await vectoreStoreInstance.fromDocuments(
        docs,
        embeddings,
        undefined,
        {
          key: getCloseVectorStoreAccessKey(),
          secret: getCloseVectorStoreSecretKey(),
        }
      );
      dlog.msg("Vector store created");

      if (config.saveEmbeddingsToCloud) {
        await vectorstore.saveToCloud({
          description: "uOttawa",
          public: true,
        });
        dlog.msg("Vector store saved to cloud");

        const { uuid } = vectorstore.instance;
        dlog.msg("Vector store UUID: " + uuid);
      }
    } else {
      // Most likely in-memory store
      vectorstore = await vectoreStoreInstance.fromDocuments(docs, embeddings);
      dlog.msg("Vector store created");
    }
  }

  // return the vector store
  return vectorstore;
}
