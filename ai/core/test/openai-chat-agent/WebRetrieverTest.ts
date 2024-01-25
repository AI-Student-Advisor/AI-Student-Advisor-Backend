// import { WebRetriever } from "../../src/openai-chat-agent/WebRetriever";
// import { TU } from "../Util";

// const DEFAULT_NAME = "uOttawaChat";
// const DEFAULT_CONTEXT = "University of Ottawa";
// const DEFAULT_URL = "https://catalogue.uottawa.ca/en/courses/csi/";
// const DEFAULT_TEST_QUERY =
//   "Which computer science courses should I take if I'm interested in machine learning?";

// function queryWebRetrieverTest(
//   name: string,
//   context: string,
//   url: string,
//   query: string
// ) {
//   const webRetriever = new WebRetriever({
//     name,
//     context,
//     url,
//   });

//   webRetriever
//     .queryRetriever(query)
//     .then((queryWebRetrieverResult) => {
//       TU.tmprint(
//         "WEB_RETRIEVER_TEST",
//         "queryWebRetrieverResult",
//         queryWebRetrieverResult
//       );
//     })
//     .catch((error) => {
//       TU.tmprintError(
//         "WEB_RETRIEVER_TEST ERROR",
//         "queryWebRetrieverResult",
//         error
//       );
//     });
// }

// export function executeWebRetrieverTests() {
//   TU.tprint("WEB_RETRIEVER_TEST", "Running WebRetrieverTest!");

//   queryWebRetrieverTest(
//     DEFAULT_NAME,
//     DEFAULT_CONTEXT,
//     DEFAULT_URL,
//     DEFAULT_TEST_QUERY
//   );

//   // const cWR = new CheerioWebRetriever();
// }
