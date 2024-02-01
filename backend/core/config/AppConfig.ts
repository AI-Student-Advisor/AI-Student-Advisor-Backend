export const AppConfig = {
  ai: {
    bedrock: {
      embedding_model_name: "amazon.titan-embed-text-v1",
      embedding_model_max_tokens: 8191,
      embedding_model_max_retries: 3,
      embedding_model_timeout: 10000,
      chat_model_name: "meta.llama2-13b-chat-v1",
      chat_model_max_tokens: 2048,
      chat_model_temperature: 0.5,
      chat_model_max_retries: 3,
      chat_model_response_timeout: 10000,
    },
    openai: {
      embedding_model_name: "text-embedding-3-small",
      embedding_model_max_tokens: 8191,
      embedding_model_max_retries: 3,
      embedding_model_timeout: 10000,
      chat_model_name: "gpt-3.5-turbo-1106",
      chat_model_max_tokens: 4096, // output tokens not input
      chat_model_temperature: 0.5,
      chat_model_max_retries: 3,
      chat_model_response_timeout: 10000,
    },
    close_vector_store_uuid:
      "file-fccd8af8549b5019d1c9f52ef7d063c27a5241da87ee2dad8e3c2f69b2f1d56f-a7bc8902-2bd3-4a08-bf0f-e7f6bd16cbfd",
  },
  DEBUG_MODE: false,
};
