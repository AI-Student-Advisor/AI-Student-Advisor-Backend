/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { dlog } from "/utilities/dlog";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";

// Instantiate a new Pinecone client, which will automatically read the
// env vars: PINECONE_API_KEY and PINECONE_ENVIRONMENT which come from
// the Pinecone dashboard at https://app.pinecone.io

export async function getPineconeFromDocuments(docs: any, embeddings: any) {
  dlog.msg("Creating Pinecone vector store from documents");
  const pinecone = new Pinecone();
  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);
  return await PineconeStore.fromDocuments(docs, embeddings, {
    pineconeIndex,
    maxConcurrency: 5 // Maximum number of batch requests to allow at once. Each batch is 1000 vectors.
  });
}

export async function getExistingPinconeStore(embeddingModel: any) {
  dlog.msg("Loading Pincone vector store from the cloud");
  const pinecone = new Pinecone();

  const pineconeIndex = pinecone.Index(
    process.env.PINECONE_INDEX!,
    process.env.PINECONE_INDEX_URL!
  );

  return await PineconeStore.fromExistingIndex(embeddingModel, {
    pineconeIndex
  });
}
