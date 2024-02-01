import { VECTOR_DB_TYPE } from "ai/vector-databases/VectorDatabasesConfig";
import { getWebBaseLoader } from "../../ai/data-loaders/WebDataLoaders";
import { DataRetriever } from "../../ai/retrievers/DataRetriever";
import { TU } from "../Util";
import { EMBEDDING_MODELS } from "ai/embedding-models/EmbeddingModelsConfig";

const TEST_NAME = "DATA_RETRIEVER_TEST";

const TEST_PARAMS = {
  testUrl: "https://catalogue.uottawa.ca/en/courses/csi/",
  data_retriever_name: "uOttawaChat",
  data_context: "University of Ottawa",
  loadCloseVectorStoreFromCloud: false,
  vector_db_type: VECTOR_DB_TYPE.MEMORY,
  embeddings_model: EMBEDDING_MODELS.OPENAI,
};

async function testWebDataRetriever() {
  const dataRetriever = new DataRetriever({
    name: TEST_PARAMS.data_retriever_name,
    context: TEST_PARAMS.data_context,
    loader: getWebBaseLoader(TEST_PARAMS.testUrl),
    vectorDBType: TEST_PARAMS.vector_db_type,
    loadCloseVectorStoreFromCloud: TEST_PARAMS.loadCloseVectorStoreFromCloud,
    embeddingModelType: TEST_PARAMS.embeddings_model,
  });

  const testQuery =
    "Which computer science courses should I take if I'm interested in machine learning?";

  await dataRetriever.setupRetriever();

  await dataRetriever
    .queryRetriever(testQuery)
    .then((queryWebRetrieverResult) => {
      TU.tmprint("testWebDataRetriever", "User query: " + testQuery);
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
