export function camelToUpper(camelCaseString: string) {
  // Use regex to match camel case pattern
  const regex = /([a-z])([A-Z])/gu;
  // Replace each lowercase letter followed by an uppercase letter with the lowercase letter + '_' + the uppercase letter
  const upperCaseString = camelCaseString.replace(regex, "$1_$2");
  // Convert the resulting string to upper case
  return upperCaseString.toUpperCase();
}
