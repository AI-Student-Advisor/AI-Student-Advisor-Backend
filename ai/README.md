# AI Student Advisor - AI Component

The AI component of the AI Student Advisor is responsible for providing the chat engine with the ability to answer questions based on the data and remember conversation history.

## Primary Components

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

## Development

### Phase 1 - Idea Verification

- Step 0 (optional): Gather data from few selected uOttawa webpages
- Step 1: Setup a simple chat engine application using LangChain
- Step 2: Ingest data using data loaders and create a local in-memory vector database
- Step 3: Create a simple chatbot that can answer questions based on the data & remember conversation history
