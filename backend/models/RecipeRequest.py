from pydantic import BaseModel


class RecipeRequest(BaseModel):
    query: str
