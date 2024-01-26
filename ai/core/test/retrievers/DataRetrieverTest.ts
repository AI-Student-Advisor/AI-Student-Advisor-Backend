import { VECTOR_DB_TYPE } from "src/vector-databases/VectorDatabasesConfig";
import { getWebBaseLoader } from "../../src/data-loaders/WebDataLoaders";
import { DataRetriever } from "../../src/retrievers/DataRetriever";
import { TU } from "../Util";

const TEST_NAME = "DATA_RETRIEVER_TEST";

async function testWebDataRetriever() {
  const url = "https://catalogue.uottawa.ca/en/courses/csi/";

  const webDataLoader = getWebBaseLoader(url);
  const dataRetriever = new DataRetriever({
    type: "webpage",
    name: "uOttawaChat",
    context: "University of Ottawa",
    loader: webDataLoader,
    vectorDBType: VECTOR_DB_TYPE.MEMORY,
  });

  const testQuery =
    "Which computer science courses should I take if I'm interested in machine learning?";

  await dataRetriever.setupRetriever();

  dataRetriever
    .queryRetriever(testQuery)
    .then((queryWebRetrieverResult) => {
      TU.tmprint(TEST_NAME, "", "User query: " + testQuery);
      TU.tmprint(
        TEST_NAME,
        "testWebDataRetriever SUCCESS",
        "ChatAgent response: "
      );
      console.dir(queryWebRetrieverResult);
    })
    .catch((error) => {
      TU.tmprintError(TEST_NAME, "testWebDataRetriever FAILED", error);
    });
}

// execute tests
export function executeDataRetrieverTests() {
  TU.tprint(TEST_NAME, `Running ${TEST_NAME}!`);
  testWebDataRetriever();
}
