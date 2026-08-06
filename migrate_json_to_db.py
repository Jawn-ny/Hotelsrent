import json

from sqlmodel import Session, select

from app.database import create_db_and_tables, engine
from app.models import Expense


JSON_FILE_PATH = "data/expenses.json"


def migrate_json_to_database():
    create_db_and_tables()

    with open(JSON_FILE_PATH, "r", encoding="utf-8") as file:
        json_expenses = json.load(file)

    if not isinstance(json_expenses, list):
        raise ValueError("expenses.json 的最外层必须是列表")

    with Session(engine) as session:
        existing_expense = session.exec(select(Expense)).first()

        if existing_expense is not None:
            print("数据库中已经存在记录，已取消迁移，避免重复导入。")
            return

        for expense_data in json_expenses:
            expense = Expense.model_validate(expense_data)
            session.add(expense)

        session.commit()

    print(f"迁移完成，共导入 {len(json_expenses)} 条支出记录。")


if __name__ == "__main__":
    migrate_json_to_database()