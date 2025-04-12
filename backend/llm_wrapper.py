# from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory
from langchain_ollama import OllamaLLM

model = "llama3.2:1b-instruct-q8_0"
memory = ConversationBufferMemory()
llm = OllamaLLM(model=model)


# class LLMWrapper:

#     def __init__(self, model="llama3.2:1b-instruct-q8_0", prompt: str = ""):

#         self.llm = OllamaLLM(model=model)
#         self.memory = ConversationBufferMemory()
#         self.chain = ConversationChain(
#             llm=self.llm, prompt=prompt, memory=self.memory
#         )

#     def run_query(self, query):
#         result = self.chain.run(input=query)
#         return result
