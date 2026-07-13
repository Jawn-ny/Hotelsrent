import json
import os

def show_menu():
    print("\n=====ShouSi's house=====")
    print("1. 添加支出")
    print("2. 查看所有支出")
    print("3. 按月份统计")
    print("4. 按分类统计")
    print("5. 按付款人统计")
    print("0. 退出程序")


def main():
    while True:
        show_menu()
        choice = input("请选择功能：")

        if choice == "1":
            add_expense()
        elif choice == "2":
            list_expense()
        elif choice == "3":
            summary_by_month()
        elif choice == "4":
            summary_by_category()
        elif choice == "5":
            print("你选择了：按付款人统计")
        elif choice == "0":
            print("程序已退出")
            break
        else:
            print("输入错误，请输入 0 到 5")

def add_expense():
    date = input("请输入日期，例如 2026-07-11：")
    item = input("请输入物品名称：")
    amount = input("请输入金额：")
    category = input("请输入分类，例如 食品、交通、日用品：")
    payer = input("请输入付款人：")
    note = input("请输入备注，没有可直接回车：")

    expense = {
        "date": date,
        "item": item,
        "amount": amount,
        "category": category,
        "payer": payer,
        "note": note
    }

    file_path = "data/expenses.json"

    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as file:
            expenses = json.load(file)
    else:
        expenses = []

    expenses.append(expense)

    with open(file_path, "w", encoding="utf-8") as file:
        json.dump(expenses, file, ensure_ascii=False, indent=4)

    print("支出添加成功！")

def list_expense():
    file_path = "data/expenses.json"

    with open(file_path, "r", encoding="utf-8") as file:
        expenses = json.load(file)
    
    if not os.path.exists(file_path):
        print("没有支出可以查询")
        return
    
    for expense in expenses:
        print("日期：", expense["date"])
        print("物品：", expense["item"])
        print("金额：", expense["amount"])
        print("分类：", expense["category"])
        print("付款人：", expense["payer"])
        print("备注：", expense["note"])
        print("-----------------")

def summary_by_month():
    month = input("请输入月份，例如 2026-07：")

    file_path = "data/expenses.json"

    if not os.path.exists(file_path):
        print("暂无支出记录")
        return

    with open(file_path, "r", encoding="utf-8") as file:
        expenses = json.load(file)

    if not expenses:
        print("暂无支出记录")
        return

    total = 0
    count = 0
    for expense in expenses:
        if expense["date"].startswith(month):
            total += float(expense["amount"])
            count += 1
    if count == 0:
        print("该月份暂无支出记录")
    else:
        print(f"{month} 的总支出为：{total:.2f} 元")

def summary_by_category():
    file_path = "data/expenses.json"

    if not os.path.exists(file_path):
        print("暂无支出记录")
        return

    with open(file_path, "r", encoding="utf-8") as file:
        expenses = json.load(file)

    if not expenses:
        print("暂无支出记录")
        return
        
    category_totals = {}

    for expense in expenses:
        category = expense["category"]
        amount = float(expense["amount"])

        if category in category_totals:
            category_totals[category] += amount
        else:
            category_totals[category] = amount

    for category, total in category_totals.items():
        print(f"{category}：{total:.2f} 元")

if __name__ == "__main__":
    main()