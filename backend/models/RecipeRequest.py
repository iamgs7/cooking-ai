from pydantic import BaseModel
from typing import Optional


class RecipeRequest(BaseModel):
    query: str


class RecipeQuery(BaseModel):
    query: str
    session_id: Optional[str] = None
    max_history: int = 10
