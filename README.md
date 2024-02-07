# AI Student Advisor - AI Component

The AI component of the AI Student Advisor is responsible for providing the chat engine with the ability to answer questions based on the data and remember conversation history.

## Primary Stages

- **Data Loading:** Ingest data, generate embeddings using LLM model, and store in a hosted vector database
- **Context Retrieval:** Retieve relevant context from vector database based on user query
- **Response Generation:** Generate response based on user query, retrieved context and previous conversation history

<div style="display: flex; flex-direction: column; align-items: center; justify-content: center">
<img
  src="https://python.langchain.com/assets/images/data_connection-95ff2033a8faa5f3ba41376c0f6dd32a.jpg"
  alt="Retrieval Process using LangChain"
  title="Retrieval Process using LangChain"
  style="display: inline-block; margin: 0 auto; max-width: 600px" />

  <p style="color: grey">source: [LangChain - Retrieval](https://python.langchain.com/docs/modules/data_connection/)</p>
</div>

## Components Required for Chat Agent

- **Retrieve & Load Data:** Use data loaders to create a retrieval tool for the chat engine
- **Embedding Generation:** Generate embeddings for the source data using the configured embedding model
- **Chat Agent Instantiation**: Create a chat agent that can answer questions based on the data & remember conversation history

![Chat Agent Architecture](./docs/assets/images/overall-chat-creation.svg)

## User Query Handling Workflow

![Chat Agent User Query Handling](./docs/assets/images/chat-agent-user-query-handling.svg)

## API

### User Query Handling

![User Query Handling](./docs/assets/images/api-query-handling.jpeg)
