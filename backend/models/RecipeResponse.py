from typing import List

from pydantic import BaseModel


class RecipeResponse(BaseModel):
    title: str
    description: str
    ingredients: List[str]
    instructions: List[str]
    cook_time_minutes: int
    prep_time_minutes: int
    servings: int
    nutritional_values: List[str]
    tags: List[str]
