import {
  getAstraDBChatHistoryApplicationToken,
  getAstraDBChatHistoryEndpoint,
  getAstraDBChatHistoryKeyspace,
  getAstraDBChatHistoryTable
} from "/config/keys";
import { CassandraChatMessageHistory } from "@langchain/community/stores/message/cassandra";

const configConnection = {
  serviceProviderArgs: {
    astra: {
      token: getAstraDBChatHistoryApplicationToken(),
      endpoint: getAstraDBChatHistoryEndpoint()
    }
  }
};

export function getAstraDBChatHistoryStore(sessionId: string) {
  try {
    const db = new CassandraChatMessageHistory({
      ...configConnection,
      keyspace: getAstraDBChatHistoryKeyspace(),
      table: getAstraDBChatHistoryTable(),
      sessionId
    });
    return db;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
