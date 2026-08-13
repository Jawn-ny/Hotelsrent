# 寿司小屋的租房记账程序

一个基于 **FastAPI + SQLModel + SQLite** 开发的租房生活记账 Web 项目。

这个项目最初从 Python 命令行记账程序开始，随后逐步升级为带数据库、REST API、网页前端、自动化测试和 CI 的完整小型 Web 项目。

项目主要用于练习完整的软件开发流程，包括：

- Python 项目结构
- FastAPI
- REST API
- SQLite
- SQLModel / ORM
- CRUD
- 搜索
- 筛选
- 自动化测试
- Git / GitHub
- GitHub Actions CI
- README 和项目交付

---

# 当前功能

## 支出管理

支持完整的 CRUD：

- 添加支出
- 查看全部支出
- 修改支出
- 删除支出

每条支出包含：

- 日期
- 物品
- 金额
- 分类
- 付款人
- 备注

所有正式 Web 数据保存到：

```text
data/expenses.db