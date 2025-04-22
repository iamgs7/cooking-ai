import os

import requests
from langchain.docstore.document import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_ollama import OllamaEmbeddings

from constants import LLM_TEXT_MODEL, MEALDB_VECTORSTORE


def fetch_meals_by_letter(letter):
    url = f"https://www.themealdb.com/api/json/v1/1/search.php?f={letter}"
    response = requests.get(url)
    data = response.json()
    return data.get("meals", [])


def fetch_all_meals():
    all_meals = []
    for letter in "abcdefghijklmnopqrstuvwxyz":
        meals = fetch_meals_by_letter(letter)
        if meals:
            all_meals.extend(meals)
    return all_meals


def meal_to_document(meal):
    title = meal.get("strMeal", "Unknown")
    category = meal.get("strCategory", "")
    area = meal.get("strArea", "")
    tags = meal.get("strTags", "")
    instructions = meal.get("strInstructions", "")
    ingredients = []

    for i in range(1, 21):
        ingredient = meal.get(f"strIngredient{i}")
        measure = meal.get(f"strMeasure{i}")
        if ingredient and ingredient.strip():
            ingredients.append(f"{ingredient.strip()} - {measure.strip()}")

    content = f"Title: {title}\nCategory: {category}\nArea: {area}\nTags: {tags}\nIngredients:\n" \
              + "\n".join(ingredients) + \
        f"\n\nInstructions:\n{instructions.strip()}"

    metadata = {
        "title": title,
        "category": category,
        "area": area,
        "tags": tags
    }

    return Document(page_content=content, metadata=metadata)


def load_vectorstore():
    print("Fetching MealDB data...")
    meals = fetch_all_meals()
    print(f"Fetched {len(meals)} meals.")

    documents = [meal_to_document(meal) for meal in meals]

    print("Splitting documents...")
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    split_docs = splitter.split_documents(documents)

    print("Embedding documents...")
    embeddings = OllamaEmbeddings(model=LLM_TEXT_MODEL)
    vectorstore = FAISS.from_documents(split_docs, embeddings)

    print("Saving vector store locally...")
    vectorstore.save_local(MEALDB_VECTORSTORE)

    print("Done! Vector store created and saved.")
    return vectorstore


def get_vectorstore():
    vectorstore_path = MEALDB_VECTORSTORE

    if os.path.exists(vectorstore_path):
        print("Loading vectorstore from disk...")
        embedding = OllamaEmbeddings(model=LLM_TEXT_MODEL)
        vectorstore = FAISS.load_local(
            vectorstore_path, embeddings=embedding, allow_dangerous_deserialization=True)
    else:
        print("Vectorstore not found. Generating it now...")
        vectorstore = load_vectorstore()

    return vectorstore


if __name__ == "__main__":
    load_vectorstore()
