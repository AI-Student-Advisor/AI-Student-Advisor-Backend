// Utility methods for tests
export class TU {
  // print to console
  static print(message: string): void {
    console.log(message);
  }

  // print to console with test title
  static tprint(testTitle: string, message: string): void {
    console.log(`${testTitle}: ${message}`);
  }

  // print to console with test title and method
  static tmprint(testTitle: string, method: string, message: string): void {
    console.log(`${testTitle}: ${method}: ${message}`);
  }

  // print error to console
  static printError(error: string): void {
    console.error(error);
  }

  // print error to console with test title
  static tprintError(testTitle: string, error: string): void {
    console.error(`ERROR - ${testTitle}: ${error}`);
  }

  // print error to console with test title and method
  static tmprintError(testTitle: string, method: string, error: string): void {
    console.error(`ERROR - ${testTitle}: ${method}: ${error}`);
  }
}
