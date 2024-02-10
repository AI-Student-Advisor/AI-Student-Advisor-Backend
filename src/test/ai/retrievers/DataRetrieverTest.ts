import { getWebBaseLoader } from "/ai/data-loaders/WebDataLoaders";
import { DataRetriever } from "/ai/data-retrievers/DataRetriever";
import { EMBEDDING_MODELS, VECTOR_STORE } from "/structs/ai/AIStructs";
import { TU } from "/test/Util";

const TEST_NAME = "DATA_RETRIEVER_TEST";

const TEST_PARAMS = {
  testUrl: "https://catalogue.uottawa.ca/en/courses/csi/",
  data_retriever_name: "uOttawaChat",
  data_context: "University of Ottawa",
  loadVectorStoreFromCloud: false,
  vector_db_type: VECTOR_STORE.MEMORY,
  embeddings_model: EMBEDDING_MODELS.OPENAI
};

async function testWebDataRetriever() {
  const dataRetriever = new DataRetriever({
    name: TEST_PARAMS.data_retriever_name,
    context: TEST_PARAMS.data_context,
    loader: getWebBaseLoader(TEST_PARAMS.testUrl),
    vectorDBType: TEST_PARAMS.vector_db_type,
    loadVectorStoreFromCloud: TEST_PARAMS.loadVectorStoreFromCloud,
    embeddingModelType: TEST_PARAMS.embeddings_model
  });

  const testQuery =
    "Which computer science courses should I take if I'm interested in machine learning?";

  await dataRetriever.setupRetriever();

  await dataRetriever
    .queryRetriever(testQuery)
    .then((queryWebRetrieverResult) => {
      TU.tmprint("testWebDataRetriever", `User query: ${testQuery}`);
      TU.tmprint("testWebDataRetriever SUCCESS", "ChatAgent response: ");
      console.dir(queryWebRetrieverResult);
    })
    .catch((error) => {
      TU.tmprintError("testWebDataRetriever FAILED", error);
    });

  return true;
}

// execute tests
export async function executeDataRetrieverTests() {
  TU.setTitle(TEST_NAME);
  TU.tprint(`Running ${TEST_NAME}!`);
  const result = await testWebDataRetriever();
  TU.tprint("Tests completed");
  return result;
}
