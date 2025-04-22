# 🍳 Cooking AI

AI-powered food image-to-recipe app using LangChain, FastAPI, and Ollama.

---

## 📦 Features

- Chat with cooking assistant for recipes, ingredient info, and more.
- Use MealDB data for recipes built from a robust dataset.

---

## 🚀 Prerequisites

Before running the project, ensure the following are installed:

### 1. Python

- Version: `>=3.9`
- [Install Python](https://www.python.org/downloads/)

### 2. Ollama

Ollama allows you to run large language models locally.

- Install via: https://ollama.com/download
- After installation, ensure it’s running by using:

```bash
ollama --version
```

- Pull the following models:

```bash
ollama pull llama3.2:1b-instruct-q8_0
ollama pull nomic-embed-text
```

### 3. Required Ollama Models
- LLM for Querying Model: llama3.2:1b-instruct-q8_0
- Embedding Model: nomic-embed-text

### 🛠️ Installation
- Clone the repository

```bash
git clone https://github.com/iamgs7/cooking-ai.git
cd cooking-ai
```

- Create and activate a virtual environment, and install dependencies

```bash
python -m venv venv
source venv/bin/activate  # on Windows: venv\Scripts\activate
pip install -r backend/requirements.txt
```

### 🏃 Run the App
- Run the FastAPI backend:

```bash
uvicorn app.main:app --reload
```
- The app will build a vectorstore from mealdb on first run.

- Run the Nodejs frontend:

```bash
cd frontend
npm ci install
npm start
```

### 📜 License
- MIT © iamgs7

### 🧠 Future Ideas
- Voice control support
- Multi-language recipe generation
- Nutrition analysis
