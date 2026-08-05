from fastapi import FastAPI, HTTPException, Query
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

@app.get("/api/expenses")
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

@app.get("/api/summary/month")
def summary_by_month(
    month: str = Query(
        ...,
        pattern=r"^\d{4}-(0[1-9]|1[0-2])$"
    )
):
    expenses = load_expenses()

    total = 0.0
    count = 0

    for expense in expenses:
        if expense["date"].startswith(month):
            total += float(expense["amount"])
            count += 1

    return {
        "month": month,
        "total": round(total, 2),
        "count": count
    }

@app.get("/api/summary/category")
def summary_by_category():
    expenses = load_expenses()
    totals = {}

    for expense in expenses:
        category = expense["category"]
        amount = float(expense["amount"])

        totals[category] = totals.get(category, 0.0) + amount

    for category in totals:
        totals[category] = round(totals[category], 2)

    return {
        "category_totals": totals
    }

@app.get("/api/summary/payer")
def summary_by_payer():
    expenses = load_expenses()
    totals = {}

    for expense in expenses:
        payer = expense["payer"]
        amount = float(expense["amount"])

        totals[payer] = totals.get(payer, 0.0) + amount

    for payer in totals:
        totals[payer] = round(totals[payer], 2)

    return {
        "payer_totals": totals
    }