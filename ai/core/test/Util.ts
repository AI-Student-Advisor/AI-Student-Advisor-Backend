// Utility methods for tests
export class TU {
  static testTitle: string = "";

  // method to set test title
  static setTitle(title: string): void {
    this.testTitle = title;
  }

  // print to console
  static print(message: string): void {
    console.log(message);
  }

  // print to console with test title
  static tprint(message: string): void {
    console.log(`${TU.testTitle}: ${message}`);
  }

  // print to console with test title and method
  static tmprint(method: string, message: string): void {
    console.log(`${TU.testTitle}: ${method}: ${message}`);
  }

  // print to console with test title
  static qtprint(testTitle: string, message: string): void {
    console.log(`${testTitle}: ${message}`);
  }

  // print to console with test title and method
  static qtmprint(testTitle: string, method: string, message: string): void {
    console.log(`${testTitle}: ${method}: ${message}`);
  }

  // print error to console
  static printError(error: string): void {
    console.error(error);
  }

  // print error to console with test title
  static tprintError(error: string): void {
    console.error(`ERROR - ${TU.testTitle}: ${error}`);
  }

  // print error to console with test title
  static qtprintError(testTitle: string, error: string): void {
    console.error(`ERROR - ${testTitle}: ${error}`);
  }

  // print error to console with test title and method
  static tmprintError(method: string, error: string): void {
    console.error(`ERROR - ${TU.testTitle}: ${method}: ${error}`);
  }

  // print error to console with test title and method
  static qtmprintError(testTitle: string, method: string, error: string): void {
    console.error(`ERROR - ${testTitle}: ${method}: ${error}`);
  }
}
