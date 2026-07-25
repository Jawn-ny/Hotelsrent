from fastapi import FastAPI, HTTPException
import json
import os

app = FastAPI()
@app.get("/api/health")
def health_check():
    return {"status": "ok"}

def load_expenses():

    file_path = "data/expenses.json"

    if not os.path.exists(file_path):
        return []

    with open(file_path, "r", encoding="utf-8") as file:
        expenses = json.load(file)

    return expenses

@app.get("/api/expenses")
def get_expenses():
    try:
        return load_expenses()
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="Expense data file is invalid"
        )