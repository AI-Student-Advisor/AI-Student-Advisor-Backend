# AI Student Advisor

A virtual companion for navigating the complexities of higher education.

Engage in insightful conversations with our conversational AI agent to receive personalized guidance on a wide array of topics—from choosing the right degree programs to selecting courses that align with your academic goals. Whether you're a prospective student exploring options or a current student seeking advice, **AI Student Advisor** is here to provide instant and tailored assistance.

## How it works?

AI Student Advisor is a Retrieval Augmented Generation (RAG) based conversational AI agent. Essentially, it a chat application with two primary components: **retrieval** and **generation**. The retrieval component is responsible for finding the most relevant information from a large corpus of documents, which we call the **context**. The generation component is then responsible for interacting with an external LLM (Large Language Model) to generate a response by providing it with the user query and the retrieved context. The generated response is then returned to the user.

<img
  src="https://docs.llamaindex.ai/en/stable/_images/basic_rag.png"
  alt="Retrieval Augmented Generation"
  title="Retrieval Augmented Generation"
  style="display: inline-block; margin: 0 auto; max-width: 800px" />

<p style="text-align: center; color: grey">source: [LlamaIndex - Retrieval Augmented Generation](https://docs.llamaindex.ai/en/stable/getting_started/concepts.html#retrieval-augmented-generation-rag)</p>

## Development

### Phase 1: Idea Verification - Basic Prototype

**Goals**

- Front-end: Setup basic AI chat application - React + TypeScript
- Back-end - API architecture and basic setup - NodeJS + Express
- AI - Setup basic RAG chat engine on selected uOttawa webpages - LangChain

**Roles**

- Front-end: Xiaoxuan
- Back-end: Victor
- AI: Pranav

**Timeline**

Expected completion date: **January 31, 2024**

### Phase 2: Functional Prototype + Responsive Design

**Goals**

- Front-end: Complete front-end responsive web design and features
- Back-end: Code all endpoints, setup authentication or authorization, testing
- AI: Setup hosted vector database, setup complete LangChain pipeline, Testing

**Roles**

- Front-end:
- Back-end:
- AI:

**Timeline**

Expected completion date: **March 1, 2024**

### Phase 3: Beta Release

**Goals**

- Front-end: Complete any remaining design enhancements (example, based on user feedback), documentation
- Back-end: Implement any additional features required (monitoring etc.), documentation, testing
- AI: Testing and improvements, documentation

**Roles**

- Front-end:
- Back-end:
- AI:

**Timeline**

Expected completion date: **March 31, 2024**

## Contributors

This project was built as part of Honours Project ([CSI4911](https://sites.google.com/view/labiii/csi4900)) at the University of Ottawa.

The project was graciously supervised by [Dr. Hussein Al Osman](https://engineering.uottawa.ca/people/al-osman-hussein).

The following students contributed to the project:

- [Pranav Kural]()
- [Victor Li](https://github.com/SayanoSong)
- [Xiaoxuan Wang](https://github.com/wxx9248)
