import { TU } from "./Util";
import { executeChatAgentTests } from "./chat-agent/ChatAgentTest";
// import { executeWebRetrieverTests } from "./openai-chat-agent/WebRetrieverTest";
import { executeDataRetrieverTests } from "./retrievers/DataRetrieverTest";

// interface to specify tests to run
export interface TestsToRun {
  chatAgentTests?: boolean;
  webRetrieverTests?: boolean;
  dataRetrieverTests?: boolean;
}

// run tests
export function runAppTests(testsToRun: TestsToRun) {
  TU.tprint("TESTS", "Running tests!");

  if (testsToRun.chatAgentTests) {
    executeChatAgentTests();
  }

  if (testsToRun.webRetrieverTests) {
    // executeWebRetrieverTests();
  }

  if (testsToRun.dataRetrieverTests) {
    executeDataRetrieverTests();
  }
}
