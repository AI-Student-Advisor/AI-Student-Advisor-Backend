import {
  getAstraDBChatHistoryApplicationToken,
  getAstraDBChatHistoryEndpoint,
  getAstraDBChatHistoryKeyspace,
  getAstraDBChatHistoryTable
} from "/config/keys.js";
import { logger } from "/utilities/Log.js";
import { CassandraChatMessageHistory } from "@langchain/community/stores/message/cassandra";

const loggerContext = "AstraDBChatHistoryStore";

const configConnection = {
  serviceProviderArgs: {
    astra: {
      token: getAstraDBChatHistoryApplicationToken(),
      endpoint: getAstraDBChatHistoryEndpoint()
    }
  }
};

export function getAstraDBChatHistoryStore(sessionId: string) {
  logger.debug(
    { context: loggerContext },
    "Setting up AstraDB chat history store",
    { sessionId: sessionId }
  );
  try {
    const db = new CassandraChatMessageHistory({
      ...configConnection,
      keyspace: getAstraDBChatHistoryKeyspace(),
      table: getAstraDBChatHistoryTable(),
      sessionId
    });
    return db;
  } catch (e) {
    logger.error(e);
    throw e;
  }
}
