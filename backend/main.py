import json

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from langchain.chains import ConversationChain
from langchain.prompts import PromptTemplate
from llm_wrapper import llm, memory
from models.RecipeRequest import RecipeRequest
from models.RecipeResponse import RecipeResponse

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


prompt = PromptTemplate(
    input_variables=["history", "input"],
    template="""
{history}

You are a cooking assistant that returns recipes in JSON format only.
The query may have just some food item name, prepare a recipe for that.
If the query seems harmful, respond with an empty json.
Do not give any comments on initial or follow-up queries

Respond to the user query with a single recipe in this structure:
{{
  "title": "Recipe Name",
  "description": "Short description of the recipe.",
  "ingredients": ["Ingredient 1", "Ingredient 2", "..."],
  "instructions": ["Step 1", "Step 2", "..."],
  "cook_time_minutes": 30,
  "prep_time_minutes": 10,
  "servings": 2,
  "nutritional_values": ["Nutrition 1", "Nutrition 2", "Nutrition 3", "..."],
  "tags": ["tag1", "tag2", "..."]
}}

User query: "{input}"
"""
)


@app.post("/recipe")
async def get_recipe(data: RecipeRequest):
    chain = ConversationChain(llm=llm, prompt=prompt, memory=memory)
    result = chain.run(input=data.query)
    recipe = json.loads(result)
    return RecipeResponse(**recipe)


@app.get("/history")
def get_history():
    return {"memory": memory.to_json()}


@app.post("/history/clear")
def clear_history():
    memory.clear()
    return {"message": "done"}


@app.on_event("startup")
async def startup_event():
    print("Started...")
