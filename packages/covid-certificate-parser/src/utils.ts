export function logInfo(msg: string, ...optionalParams: any[]): void {
  console.log(`[DCC-PARSER] ${msg}`, ...optionalParams);
}
export function logError(msg: string, ...optionalParams: any[]): Error {
  console.error(`[DCC-PARSER] ${msg}`, ...optionalParams);
  throw new Error(msg);
}
