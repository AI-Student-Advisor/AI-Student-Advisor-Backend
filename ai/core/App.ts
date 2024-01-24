// High Level App file

import { TestsToRun, runAppTests } from "./test/Tests";

console.log("AI Student Advisor App - Running");

// ----------------------------
// Testing

// Tests to run
const testsToRun: TestsToRun = {
  chatAgentTests: true,
  webRetrieverTests: true,
};

runAppTests(testsToRun);
