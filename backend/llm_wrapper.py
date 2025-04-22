from langchain.chains import LLMChain, RetrievalQA
from langchain.prompts import PromptTemplate
from langchain_ollama import OllamaLLM

from constants import LLM_QUERY_MODEL
from prompt import get_context_cooking_prompt_template, get_simple_cooking_prompt_template


def get_simple_qa_chain():

    llm = OllamaLLM(model=LLM_QUERY_MODEL)
    prompt = PromptTemplate(
        input_variables=["chat_history", "question"],
        template=get_context_cooking_prompt_template()
    )

    qa_chain = LLMChain(
        llm=llm,
        prompt=prompt
    )

    return qa_chain


def get_qa_chain_with_vectorstore(vectorstore=None):

    llm = OllamaLLM(model=LLM_QUERY_MODEL)

    prompt_template = PromptTemplate(
        template=("Context: {context}\n" + "Question: {question}\n" +
                  get_simple_cooking_prompt_template()),
        input_variables=["question", "context"]
    )

    retriever = vectorstore.as_retriever(search_type="similarity", k=3)
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        chain_type_kwargs={
            "prompt": prompt_template,
        },
        return_source_documents=True
    )
    print("Vectorstore loaded and QA chain is ready.")

    return qa_chain
