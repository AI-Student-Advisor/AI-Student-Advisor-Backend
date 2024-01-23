// High Level App file

import { executeChatAgentTests } from "./test/chat-agent/ChatAgentTest";

console.log("App running!");

// Run tests
const RUN_TESTS = true;

if (RUN_TESTS) {
  // Run Chat Agent Tests
  executeChatAgentTests();
}
