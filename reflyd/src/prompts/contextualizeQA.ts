export const systemPrompt = (locale: LOCALE) => `
## Target
Given a chat history and the latest user question
which might reference context in the chat history, formulate a standalone question
which can be understood without the chat history. Do NOT answer the question,
just reformulate it if needed and otherwise return it as is.

## Constraints
**Please output answer in ${locale} language.**
`;
