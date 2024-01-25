// File to handle use of API keys from environment variables

// Get OpenAI API key from environment variables
const getOpenAIAPIKey = () => {
  const { OPEN_AI_API_KEY } = process.env;
  if (!OPEN_AI_API_KEY) {
    throw new Error("OPEN_AI_API_KEY not set");
  }
  return OPEN_AI_API_KEY;
};

// Get Upstash Redis REST API key from environment variables
const getUpstashRedisRESTAPIKey = () => {
  const { UPSTASH_REDIS_REST_TOKEN } = process.env;
  if (!UPSTASH_REDIS_REST_TOKEN) {
    throw new Error("UPSTASH_REDIS_REST_TOKEN not set");
  }
  return UPSTASH_REDIS_REST_TOKEN;
};

// Get Upstash Redis REST API URL from environment variables
const getUpstashRedisRESTAPIURL = () => {
  const { UPSTASH_REDIS_REST_URL } = process.env;
  if (!UPSTASH_REDIS_REST_URL) {
    throw new Error("UPSTASH_REDIS_REST_URL not set");
  }
  return UPSTASH_REDIS_REST_URL;
};

// process.env.AWS_REGION
// Get AWS region from environment variables
const getAWSRegion = () => {
  const { AWS_REGION } = process.env;
  if (!AWS_REGION) {
    throw new Error("AWS_REGION not set");
  }
  return AWS_REGION;
};

// process.env.AWS_ACCESS_KEY_ID
// Get AWS access key ID from environment variables
const getAWSAccessKeyID = () => {
  const { AWS_ACCESS_KEY_ID } = process.env;
  if (!AWS_ACCESS_KEY_ID) {
    throw new Error("AWS_ACCESS_KEY_ID not set");
  }
  return AWS_ACCESS_KEY_ID;
};

// process.env.AWS_SECRET_ACCESS_KEY
// Get AWS secret access key from environment variables
const getAWSSecretAccessKey = () => {
  const { AWS_SECRET_ACCESS_KEY } = process.env;
  if (!AWS_SECRET_ACCESS_KEY) {
    throw new Error("AWS_SECRET_ACCESS_KEY not set");
  }
  return AWS_SECRET_ACCESS_KEY;
};

export {
  getOpenAIAPIKey,
  getUpstashRedisRESTAPIKey,
  getUpstashRedisRESTAPIURL,
  getAWSRegion,
  getAWSAccessKeyID,
  getAWSSecretAccessKey,
};
