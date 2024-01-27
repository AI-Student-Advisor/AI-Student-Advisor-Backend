import { TU } from "./Util";
import { executeChatAgentTests } from "./chat-agents/ChatAgentTest";
import { executeDataRetrieverTests } from "./retrievers/DataRetrieverTest";

// interface to specify tests to run
export interface TestsToRun {
  dataRetrieverTests?: boolean;
  chatAgentTests?: boolean;
}

// run tests
export function runAppTests(testsToRun: TestsToRun) {
  TU.qtprint("TESTS", "Running tests!");

  if (testsToRun.dataRetrieverTests) {
    executeDataRetrieverTests();
  }

  if (testsToRun.chatAgentTests) {
    executeChatAgentTests();
  }
}
