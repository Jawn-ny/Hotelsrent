from fastapi import FastAPI, HTTPException
from app.models import ExpenseCreate
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

def save_expenses(expenses):
    file_path = "data/expenses.json"

    with open(file_path, "w", encoding="utf-8") as file:
        json.dump(expenses, file, ensure_ascii=False, indent=4)

def get_expenses():
    try:
        return load_expenses()
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="Expense data file is invalid"
        )
    
@app.post("/api/expenses", status_code=201)
def create_expense(expense: ExpenseCreate):
    expenses = load_expenses()
    expense_data = expense.model_dump(mode="json")
    expenses.append(expense_data)
    save_expenses(expenses)
    return expense_data

