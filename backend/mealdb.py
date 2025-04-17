import requests

BASE_URL = "https://www.themealdb.com/api/json/v1/1"


def get_meal_by_ingredient(ingredient):
    r = requests.get(f"{BASE_URL}/filter.php?i={ingredient}")
    return r.json().get("meals", [])


def get_meal_details_by_id(meal_id):
    r = requests.get(f"{BASE_URL}/lookup.php?i={meal_id}")
    return r.json().get("meals", [])[0]


def search_meal_by_name(name):
    r = requests.get(f"{BASE_URL}/search.php?s={name}")
    return r.json().get("meals", [])


def get_random_meal():
    r = requests.get(f"{BASE_URL}/random.php")
    return r.json().get("meals", [])[0]
