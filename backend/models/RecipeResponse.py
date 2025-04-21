from typing import List

from pydantic import BaseModel


class RecipeResponse(BaseModel):
    answer: str
    sources: List[str]
    session_id: str


class SimpleResponse(BaseModel):
    answer: str
    session_id: str
