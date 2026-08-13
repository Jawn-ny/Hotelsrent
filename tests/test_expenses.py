import pytest

def test_get_expenses_starts_empty(client):
    response = client.get("/api/expenses")

    assert response.status_code == 200
    assert response.json() == []

def test_search_expenses_by_keyword(client):
    expenses = [
        {
            "date": "2026-08-11",
            "item": "电饭煲",
            "amount": 199,
            "category": "家电",
            "payer": "A",
            "note": "厨房使用"
        },
        {
            "date": "2026-08-11",
            "item": "牛奶",
            "amount": 10,
            "category": "食品",
            "payer": "小王",
            "note": "早餐"
        },
        {
            "date": "2026-08-11",
            "item": "椅子",
            "amount": 80,
            "category": "家具",
            "payer": "B",
            "note": "放在客厅"
        }
    ]

    for expense in expenses:
        response = client.post(
            "/api/expenses",
            json=expense
        )

        assert response.status_code == 201

    item_response = client.get(
        "/api/expenses?keyword=电饭煲"
    )
    assert item_response.status_code == 200
    assert len(item_response.json()) == 1
    assert item_response.json()[0]["item"] == "电饭煲"

    category_response = client.get(
        "/api/expenses?keyword=食品"
    )
    assert category_response.status_code == 200
    assert len(category_response.json()) == 1
    assert category_response.json()[0]["item"] == "牛奶"

    payer_response = client.get(
        "/api/expenses?keyword=小王"
    )
    assert payer_response.status_code == 200
    assert len(payer_response.json()) == 1
    assert payer_response.json()[0]["item"] == "牛奶"

    note_response = client.get(
        "/api/expenses?keyword=客厅"
    )
    assert note_response.status_code == 200
    assert len(note_response.json()) == 1
    assert note_response.json()[0]["item"] == "椅子"

def test_filter_expenses_by_category_and_payer(client):
    expenses = [
        {
            "date": "2026-08-12",
            "item": "牛奶",
            "amount": 10,
            "category": "食品",
            "payer": "A",
            "note": "早餐"
        },
        {
            "date": "2026-08-12",
            "item": "面包",
            "amount": 15,
            "category": "食品",
            "payer": "B",
            "note": "早餐"
        },
        {
            "date": "2026-08-12",
            "item": "电饭煲",
            "amount": 199,
            "category": "家电",
            "payer": "A",
            "note": "厨房"
        },
        {
            "date": "2026-08-12",
            "item": "电风扇",
            "amount": 120,
            "category": "家电",
            "payer": "B",
            "note": "卧室"
        }
    ]

    for expense in expenses:
        response = client.post(
            "/api/expenses",
            json=expense
        )

        assert response.status_code == 201

    category_response = client.get(
        "/api/expenses?category=食品"
    )

    assert category_response.status_code == 200

    category_data = category_response.json()

    assert len(category_data) == 2

    assert {
        expense["item"]
        for expense in category_data
    } == {
        "牛奶",
        "面包"
    }

    payer_response = client.get(
        "/api/expenses?payer=A"
    )

    assert payer_response.status_code == 200

    payer_data = payer_response.json()

    assert len(payer_data) == 2

    assert {
        expense["item"]
        for expense in payer_data
    } == {
        "牛奶",
        "电饭煲"
    }

    combined_response = client.get(
        "/api/expenses?category=家电&payer=A"
    )

    assert combined_response.status_code == 200

    combined_data = combined_response.json()

    assert len(combined_data) == 1
    assert combined_data[0]["item"] == "电饭煲"

    search_and_filter_response = client.get(
        "/api/expenses?keyword=电&category=家电&payer=B"
    )

    assert search_and_filter_response.status_code == 200

    search_and_filter_data = (
        search_and_filter_response.json()
    )

    assert len(search_and_filter_data) == 1

    assert (
        search_and_filter_data[0]["item"]
        == "电风扇"
    )

def test_create_expense(client):
    expense_data = {
        "date": "2026-08-09",
        "item": "测试牛奶",
        "amount": 10,
        "category": "测试",
        "payer": "A",
        "note": "pytest测试"
    }

    response = client.post(
        "/api/expenses",
        json=expense_data
    )

    assert response.status_code == 201

    data = response.json()

    assert data["item"] == "测试牛奶"
    assert data["amount"] == 10
    assert data["category"] == "测试"
    assert data["payer"] == "A"
    assert data["id"] is not None

def test_create_expense_rejects_zero_amount(client):
    expense_data = {
        "date": "2026-08-09",
        "item": "错误金额测试",
        "amount": 0,
        "category": "测试",
        "payer": "A",
        "note": ""
    }

    response = client.post(
        "/api/expenses",
        json=expense_data
    )

    assert response.status_code == 422

    get_response = client.get("/api/expenses")

    assert get_response.status_code == 200
    assert get_response.json() == []

@pytest.mark.parametrize(
    "field_name",
    ["item", "category", "payer"]
)
def test_create_expense_rejects_blank_required_text(client, field_name):
    expense_data = {
        "date": "2026-08-09",
        "item": "测试物品",
        "amount": 10,
        "category": "测试分类",
        "payer": "A",
        "note": ""
    }

    expense_data[field_name] = "   "

    response = client.post(
        "/api/expenses",
        json=expense_data
    )

    assert response.status_code == 422

    get_response = client.get("/api/expenses")

    assert get_response.status_code == 200
    assert get_response.json() == []

def test_update_expense(client):
    original_data = {
        "date": "2026-08-09",
        "item": "原始测试",
        "amount": 10,
        "category": "测试分类",
        "payer": "A",
        "note": "修改前"
    }

    create_response = client.post(
        "/api/expenses",
        json=original_data
    )

    assert create_response.status_code == 201

    created_expense = create_response.json()
    expense_id = created_expense["id"]

    updated_data = {
        "date": "2026-08-09",
        "item": "修改成功",
        "amount": 20,
        "category": "修改后分类",
        "payer": "B",
        "note": "修改后"
    }

    update_response = client.put(
        f"/api/expenses/{expense_id}",
        json=updated_data
    )

    assert update_response.status_code == 200

    updated_expense = update_response.json()

    assert updated_expense["id"] == expense_id
    assert updated_expense["item"] == "修改成功"
    assert updated_expense["amount"] == 20
    assert updated_expense["category"] == "修改后分类"
    assert updated_expense["payer"] == "B"
    assert updated_expense["note"] == "修改后"

def test_update_expense_not_found(client):
    updated_data = {
        "date": "2026-08-09",
        "item": "不存在测试",
        "amount": 20,
        "category": "测试",
        "payer": "A",
        "note": ""
    }

    response = client.put(
        "/api/expenses/999999",
        json=updated_data
    )

    assert response.status_code == 404
    assert response.json() == {
        "detail": "Expense not found"
    }

def test_update_expense_rejects_zero_amount(client):
    original_data = {
        "date": "2026-08-09",
        "item": "原始记录",
        "amount": 10,
        "category": "测试",
        "payer": "A",
        "note": ""
    }

    create_response = client.post(
        "/api/expenses",
        json=original_data
    )

    assert create_response.status_code == 201

    created_expense = create_response.json()
    expense_id = created_expense["id"]

    invalid_data = {
        "date": "2026-08-09",
        "item": "错误修改",
        "amount": 0,
        "category": "测试",
        "payer": "A",
        "note": ""
    }

    update_response = client.put(
        f"/api/expenses/{expense_id}",
        json=invalid_data
    )

    assert update_response.status_code == 422

    get_response = client.get("/api/expenses")

    assert get_response.status_code == 200

    expenses = get_response.json()

    assert len(expenses) == 1
    assert expenses[0]["id"] == expense_id
    assert expenses[0]["item"] == "原始记录"
    assert expenses[0]["amount"] == 10

def test_delete_expense(client):
    expense_data = {
        "date": "2026-08-09",
        "item": "删除测试",
        "amount": 10,
        "category": "测试",
        "payer": "A",
        "note": ""
    }

    create_response = client.post(
        "/api/expenses",
        json=expense_data
    )

    assert create_response.status_code == 201

    created_expense = create_response.json()
    expense_id = created_expense["id"]

    delete_response = client.delete(
        f"/api/expenses/{expense_id}"
    )

    assert delete_response.status_code == 200

    delete_data = delete_response.json()

    assert delete_data["id"] == expense_id
    assert delete_data["message"] == "Expense deleted"

    get_response = client.get("/api/expenses")

    assert get_response.status_code == 200
    assert get_response.json() == []

def test_delete_expense_not_found(client):
    response = client.delete(
        "/api/expenses/999999"
    )

    assert response.status_code == 404
    assert response.json() == {
        "detail": "Expense not found"
    }

def test_summary_by_month(client):
    expenses = [
        {
            "date": "2026-08-01",
            "item": "牛奶",
            "amount": 10,
            "category": "食品",
            "payer": "A",
            "note": ""
        },
        {
            "date": "2026-08-15",
            "item": "电饭煲",
            "amount": 20,
            "category": "家电",
            "payer": "B",
            "note": ""
        },
        {
            "date": "2026-07-31",
            "item": "七月测试",
            "amount": 100,
            "category": "食品",
            "payer": "A",
            "note": ""
        }
    ]

    for expense in expenses:
        response = client.post(
            "/api/expenses",
            json=expense
        )

        assert response.status_code == 201

    response = client.get(
        "/api/summary/month?month=2026-08"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["month"] == "2026-08"
    assert data["total"] == 30
    assert data["count"] == 2

def test_summary_by_category(client):
    expenses = [
        {
            "date": "2026-08-01",
            "item": "牛奶",
            "amount": 10,
            "category": "食品",
            "payer": "A",
            "note": ""
        },
        {
            "date": "2026-08-02",
            "item": "面包",
            "amount": 15,
            "category": "食品",
            "payer": "B",
            "note": ""
        },
        {
            "date": "2026-08-03",
            "item": "电饭煲",
            "amount": 20,
            "category": "家电",
            "payer": "A",
            "note": ""
        }
    ]

    for expense in expenses:
        response = client.post(
            "/api/expenses",
            json=expense
        )

        assert response.status_code == 201

    response = client.get(
        "/api/summary/category"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["category_totals"]["食品"] == 25
    assert data["category_totals"]["家电"] == 20

def test_summary_by_payer(client):
    expenses = [
        {
            "date": "2026-08-01",
            "item": "牛奶",
            "amount": 10,
            "category": "食品",
            "payer": "A",
            "note": ""
        },
        {
            "date": "2026-08-02",
            "item": "面包",
            "amount": 15,
            "category": "食品",
            "payer": "A",
            "note": ""
        },
        {
            "date": "2026-08-03",
            "item": "电饭煲",
            "amount": 20,
            "category": "家电",
            "payer": "B",
            "note": ""
        }
    ]

    for expense in expenses:
        response = client.post(
            "/api/expenses",
            json=expense
        )

        assert response.status_code == 201

    response = client.get(
        "/api/summary/payer"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["payer_totals"]["A"] == 25
    assert data["payer_totals"]["B"] == 20

