from datetime import date

from pydantic import field_validator
from sqlmodel import Field, SQLModel

class ExpenseBase(SQLModel):
    date: date
    item: str = Field(min_length=1)
    amount: float = Field(gt=0)
    category: str
    payer: str
    note: str = ""

    @field_validator("item", "category", "payer")
    @classmethod
    def required_text_must_not_be_blank(cls, value: str) -> str:
        cleaned_value = value.strip()

        if not cleaned_value:
            raise ValueError("field cannot be blank")

        return cleaned_value

class Expense(ExpenseBase, table=True):
    id: int | None = Field(default=None, primary_key=True)

class ExpenseCreate(ExpenseBase):
    pass

class Budget(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    month: str = Field(unique=True)
    amount: float = Field(gt=0)

class BudgetCreate(SQLModel):
    month: str
    amount: float = Field(gt=0)

class BudgetSummary(SQLModel):
    month: str
    budget: float
    spent: float
    remaining: float

class BudgetUpdate(SQLModel):
    amount: float = Field(gt=0)