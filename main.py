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
            print("你选择了：添加支出")
        elif choice == "2":
            print("你选择了：查看所有支出")
        elif choice == "3":
            print("你选择了：按月份统计")
        elif choice == "4":
            print("你选择了：按分类统计")
        elif choice == "5":
            print("你选择了：按付款人统计")
        elif choice == "0":
            print("程序已退出")
            break
        else:
            print("输入错误，请输入 0 到 5")


if __name__ == "__main__":
    main()