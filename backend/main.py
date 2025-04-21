import uuid
from contextlib import asynccontextmanager
from typing import Dict, List, Tuple

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from llm_wrapper import get_qa_chain_with_vectorstore, get_simple_qa_chain
from mealdb_vectorstore import get_vectorstore
from models.RecipeRequest import RecipeQuery
from models.RecipeResponse import RecipeResponse, SimpleResponse


vectorstore = None
chat_sessions: Dict[str, List[Tuple[str, str]]] = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    global vectorstore
    vectorstore = get_vectorstore()
    yield
    vectorstore = None


app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/v1/chat/chef", response_model=SimpleResponse)
async def chat_chef(data: RecipeQuery):
    session_id = data.session_id or str(uuid.uuid4())

    if session_id not in chat_sessions:
        chat_sessions[session_id] = []

    # Ensure chat history limits, 10 is default
    if len(chat_sessions[session_id]) > data.max_history:
        chat_sessions[session_id] = chat_sessions[session_id][-data.max_history]

    history = "\n".join(chat_sessions[session_id])

    # Get answer
    qa_chain = get_simple_qa_chain()

    result = qa_chain.invoke({
        "chat_history": history,
        "question": data.query
    })

    # Store new exchange in history
    chat_sessions[session_id].append(f"User: {data.query}")
    chat_sessions[session_id].append(f"AI: {result['text']}")

    return {
        "answer": result["text"],
        "session_id": session_id
    }


@app.get("/v1/history/{session_id}")
def get_history(session_id: str):
    return {"session_id": session_id, "history": "\n".join(chat_sessions.get(session_id, []))}


@app.delete("/v1/history/clear/{session_id}")
def clear_history(session_id: str):
    chat_sessions[session_id] = []
    return {"message": "done"}


@app.post("/v2/chat/mealdb", response_model=RecipeResponse)
async def chat_mealdb(data: RecipeQuery):
    global vectorstore
    if vectorstore is None:
        return {"error": "Vectorstore not loaded. Please check startup logs."}

    session_id = data.session_id or str(uuid.uuid4())

    if session_id not in chat_sessions:
        chat_sessions[session_id] = []

    # Get history with limit
    history = chat_sessions[session_id][-data.max_history:
                                        ] if chat_sessions[session_id] else []

    # Get answer
    qa_chain = get_qa_chain_with_vectorstore(vectorstore=None)

    result = qa_chain.invoke({
        "query": data.query,
        "chat_history": history
    })

    print(session_id)
    # Store new exchange in history
    chat_sessions[session_id].append((data.query, result["result"]))

    sources = [doc.metadata.get("title", "Unknown")
               for doc in result["source_documents"]]

    return {
        "answer": result["result"],
        "sources": sources,
        "session_id": session_id
    }
