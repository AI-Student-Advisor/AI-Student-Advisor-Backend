// High Level App file
import { getTestChatAgent } from "/TestChatAgent.js";
import { ChatAgent } from "/ai/chat-agents/ChatAgent.js";
import { TestsToRun, runAppTests } from "/test/Tests.js";
import { runConversationTest } from "/test/api/ConversationEndpointTest.js";

console.log("AI Student Advisor App - Running");

// ----------------------------
// TestChatAgent
const runTestChatAgent = async () => {
  const chatAgent: ChatAgent = await getTestChatAgent();
  const testQuery =
    "What courses should I take if I am interested in machine learning?";

  console.log(await chatAgent.query(chatAgent.prepareInput(testQuery)));
};
// runTestChatAgent();

// ----------------------------
// Testing
const RUN_TESTS = false;

// Tests to run
const testsToRun: TestsToRun = {
  dataRetrieverTests: false,
  chatAgentTests: true
};

// Run tests
if (RUN_TESTS) {
  runAppTests(testsToRun);
}
