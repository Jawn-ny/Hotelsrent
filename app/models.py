from datetime import date

from pydantic import BaseModel

class ExpenseCreate(BaseModel):
    date: date
    item: str
    amount: float
    category: str
    payer: str
    note: str = ""