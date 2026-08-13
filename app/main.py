from contextlib import asynccontextmanager

from sqlmodel import Session, select
from sqlalchemy import func, or_
from fastapi import Depends, FastAPI, HTTPException, Query, Response
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.database import create_db_and_tables, get_session
from app.models import Expense, ExpenseCreate

async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)
app.mount("/frontend", StaticFiles(directory="frontend"), name="frontend")
@app.get("/api/health")
def health_check():
    return {"status": "ok"}

@app.get("/api/expenses")
def get_expenses(
    response: Response,
    keyword: str | None = None,
    category: str | None = None,
    payer: str | None = None,
    sort_by: str = Query(
        "date",
        pattern=r"^(date|amount|item)$"
    ),
    sort_order: str = Query(
        "desc",
        pattern=r"^(asc|desc)$"
    ),
    page: int = Query(
        1,
        ge=1
    ),
    page_size: int = Query(
        10,
        ge=1,
        le=100
    ),
    session: Session = Depends(get_session)
):
    statement = select(Expense)

    count_statement = (
        select(func.count())
        .select_from(Expense)
    )

    conditions = []

    if keyword:
        keyword = keyword.strip()

        if keyword:
            conditions.append(
                or_(
                    Expense.item.contains(keyword),
                    Expense.category.contains(keyword),
                    Expense.payer.contains(keyword),
                    Expense.note.contains(keyword)
                )
            )

    if category:
        category = category.strip()

        if category:
            conditions.append(
                Expense.category == category
            )

    if payer:
        payer = payer.strip()

        if payer:
            conditions.append(
                Expense.payer == payer
            )

    for condition in conditions:
        statement = statement.where(
            condition
        )

        count_statement = (
            count_statement.where(
                condition
            )
        )

    sort_columns = {
        "date": Expense.date,
        "amount": Expense.amount,
        "item": Expense.item
    }

    sort_column = sort_columns[
        sort_by
    ]

    if sort_order == "asc":
        statement = statement.order_by(
            sort_column.asc(),
            Expense.id.asc()
        )
    else:
        statement = statement.order_by(
            sort_column.desc(),
            Expense.id.desc()
        )

    total = session.exec(
        count_statement
    ).one()

    total_pages = (
        total + page_size - 1
    ) // page_size

    offset = (
        page - 1
    ) * page_size

    statement = (
        statement
        .offset(offset)
        .limit(page_size)
    )

    expenses = session.exec(
        statement
    ).all()

    response.headers[
        "X-Total-Count"
    ] = str(total)

    response.headers[
        "X-Total-Pages"
    ] = str(total_pages)

    response.headers[
        "X-Page"
    ] = str(page)

    response.headers[
        "X-Page-Size"
    ] = str(page_size)

    return expenses
    
@app.post("/api/expenses", status_code=201)
def create_expense(
    expense: ExpenseCreate,
    session: Session = Depends(get_session)
):
    db_expense = Expense.model_validate(expense)

    session.add(db_expense)
    session.commit()
    session.refresh(db_expense)

    return db_expense

@app.delete("/api/expenses/{expense_id}")
def delete_expense(
    expense_id: int,
    session: Session = Depends(get_session)
):
    expense = session.get(Expense, expense_id)

    if expense is None:
        raise HTTPException(
            status_code=404,
            detail="Expense not found"
        )

    session.delete(expense)
    session.commit()

    return {
        "message": "Expense deleted",
        "id": expense_id
    }

@app.put("/api/expenses/{expense_id}")
def update_expense(
    expense_id: int,
    expense: ExpenseCreate,
    session: Session = Depends(get_session)
):
    db_expense = session.get(Expense, expense_id)

    if db_expense is None:
        raise HTTPException(
            status_code=404,
            detail="Expense not found"
        )

    update_data = expense.model_dump()
    db_expense.sqlmodel_update(update_data)

    session.add(db_expense)
    session.commit()
    session.refresh(db_expense)

    return db_expense

@app.get("/api/summary/month")
def summary_by_month(
    month: str = Query(
        ...,
        pattern=r"^\d{4}-(0[1-9]|1[0-2])$"
    ),
    session: Session = Depends(get_session)
):
    statement = select(Expense)
    expenses = session.exec(statement).all()

    total = 0.0
    count = 0

    for expense in expenses:
        expense_month = expense.date.strftime("%Y-%m")

        if expense_month == month:
            total += expense.amount
            count += 1

    return {
        "month": month,
        "total": round(total, 2),
        "count": count
    }

@app.get("/api/summary/category")
def summary_by_category(
    session: Session = Depends(get_session)
):
    statement = select(Expense)
    expenses = session.exec(statement).all()

    totals = {}

    for expense in expenses:
        category = expense.category
        amount = expense.amount

        totals[category] = totals.get(category, 0.0) + amount

    for category in totals:
        totals[category] = round(totals[category], 2)

    return {
        "category_totals": totals
    }

@app.get("/api/summary/payer")
def summary_by_payer(
    session: Session = Depends(get_session)
):
    statement = select(Expense)
    expenses = session.exec(statement).all()

    totals = {}

    for expense in expenses:
        payer = expense.payer
        amount = expense.amount

        totals[payer] = totals.get(payer, 0.0) + amount

    for payer in totals:
        totals[payer] = round(totals[payer], 2)

    return {
        "payer_totals": totals
    }

@app.get("/", include_in_schema=False)
def serve_home():
    return FileResponse("frontend/index.html")