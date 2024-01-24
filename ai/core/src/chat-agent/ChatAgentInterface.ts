export interface ChatAgentInterface {
  enableChat(): boolean;
  disableChat(): boolean;
  query(userQuery: any): any;
  queryStream(userQuery: any): any;
}
