from datetime import date

from pydantic import BaseModel, Field, field_validator

class ExpenseCreate(BaseModel):
    date: date
    item: str = Field(min_length=1)
    amount: float = Field(gt=0)
    category: str
    payer: str
    note: str = ""

    @field_validator("item")
    @classmethod
    def item_must_not_be_blank(cls, value: str) -> str:
        cleaned_value = value.strip()

        if not cleaned_value:
            raise ValueError("item cannot be blank")

        return cleaned_value