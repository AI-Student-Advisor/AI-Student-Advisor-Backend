import { TU } from "./Util";
import { executeChatAgentTests } from "./ai/chat-agents/ChatAgentTest";
import { executeDataRetrieverTests } from "./ai/retrievers/DataRetrieverTest";

// interface to specify tests to run
export interface TestsToRun {
  dataRetrieverTests?: boolean;
  chatAgentTests?: boolean;
}

// run tests
export async function runAppTests(testsToRun: TestsToRun) {
  TU.qtprint("TESTS", "Running tests!");
  let result: any = false;

  if (testsToRun.dataRetrieverTests) {
    result = await executeDataRetrieverTests();
  }

  if (testsToRun.chatAgentTests) {
    result = await executeChatAgentTests();
  }
}
