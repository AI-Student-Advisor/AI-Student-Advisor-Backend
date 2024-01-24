// File to handle use of API keys from environment variables

// Get OpenAI API key from environment variables
// If not set, throw an error
const getOpenAIAPIKey = () => {
  const { OPEN_AI_API_KEY } = process.env;
  if (!OPEN_AI_API_KEY) {
    throw new Error("OPEN_AI_API_KEY not set");
  }
  return OPEN_AI_API_KEY;
};

// Get Upstash Redis REST API key from environment variables
// If not set, throw an error
const getUpstashRedisRESTAPIKey = () => {
  const { UPSTASH_REDIS_REST_TOKEN } = process.env;
  if (!UPSTASH_REDIS_REST_TOKEN) {
    throw new Error("UPSTASH_REDIS_REST_TOKEN not set");
  }
  return UPSTASH_REDIS_REST_TOKEN;
};

// Get Upstash Redis REST API URL from environment variables
// If not set, throw an error
const getUpstashRedisRESTAPIURL = () => {
  const { UPSTASH_REDIS_REST_URL } = process.env;
  if (!UPSTASH_REDIS_REST_URL) {
    throw new Error("UPSTASH_REDIS_REST_URL not set");
  }
  return UPSTASH_REDIS_REST_URL;
};

export {
  getOpenAIAPIKey,
  getUpstashRedisRESTAPIKey,
  getUpstashRedisRESTAPIURL,
};
