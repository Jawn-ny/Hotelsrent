# 寿司小屋的租房记账程序

一个基于 **FastAPI + SQLModel + SQLite** 开发的租房生活记账 Web 项目。

项目最初从 Python 命令行记账程序开始，随后逐步升级为带数据库、REST API、网页前端、自动化测试和 CI 的完整小型 Web 项目。

---

# 当前功能

## 支出管理

支持完整 CRUD：

- 添加支出
- 查看支出
- 修改支出
- 删除支出

每条支出包含：

- 日期
- 物品
- 金额
- 分类
- 付款人
- 备注

正式 Web 数据保存在：

```text
data/expenses.db
```

数据库技术：

```text
SQLite + SQLModel
```

---

# 搜索功能

支持通过关键词搜索：

- 物品 `item`
- 分类 `category`
- 付款人 `payer`
- 备注 `note`

例如：

```text
GET /api/expenses?keyword=电
```

如果不传关键词：

```text
GET /api/expenses
```

则返回全部记录。

---

# 筛选功能

支持按照分类：

```text
GET /api/expenses?category=家电
```

按照付款人：

```text
GET /api/expenses?payer=A
```

组合筛选：

```text
GET /api/expenses?category=家电&payer=A
```

搜索与筛选也可以组合：

```text
GET /api/expenses?keyword=电&category=家电&payer=A
```

---

# 排序功能

支出列表支持按照以下字段排序：

- 日期 `date`
- 金额 `amount`
- 物品 `item`

排序方向：

- 升序 `asc`
- 降序 `desc`

例如按金额从低到高：

```text
GET /api/expenses?sort_by=amount&sort_order=asc
```

按日期从新到旧：

```text
GET /api/expenses?sort_by=date&sort_order=desc
```

默认排序：

```text
sort_by=date
sort_order=desc
```

所以默认情况下，日期较新的支出显示在前面。

排序可以和搜索、筛选组合：

```text
GET /api/expenses?keyword=电&category=家电&sort_by=amount&sort_order=asc
```

---

# 统计功能

## 按月份统计

```text
GET /api/summary/month?month=2026-08
```

返回：

- 月份
- 总支出
- 记录数量

月份格式：

```text
YYYY-MM
```

---

## 按分类统计

```text
GET /api/summary/category
```

按照分类计算支出总金额。

---

## 按付款人统计

```text
GET /api/summary/payer
```

按照付款人计算支出总金额。

---

# 技术栈

## 后端

- Python
- FastAPI
- SQLModel
- SQLAlchemy
- SQLite

## 前端

- HTML
- CSS
- JavaScript

## 测试

- pytest
- FastAPI TestClient

## 工程工具

- Git
- GitHub
- GitHub Actions

---

# 项目结构

```text
HOTELSRENT/
│
├── .github/
│   └── workflows/
│       └── tests.yml
│
├── app/
│   ├── __init__.py
│   ├── database.py
│   ├── main.py
│   └── models.py
│
├── data/
│   ├── expenses.json
│   └── expenses.db
│
├── frontend/
│   ├── index.html
│   ├── styles.css
│   ├── api.js
│   └── app.js
│
├── tests/
│   ├── conftest.py
│   ├── test_health.py
│   └── test_expenses.py
│
├── main.py
├── migrate_json_to_db.py
├── requirements.txt
└── README.md
```

---

# 安装项目

## 创建虚拟环境

第一次运行：

```powershell
python -m venv .venv
```

这个命令只用于创建虚拟环境，一般不需要重复执行。

## 激活虚拟环境

Windows PowerShell：

```powershell
.\.venv\Scripts\Activate.ps1
```

成功后终端前面会出现：

```text
(.venv)
```

## 安装依赖

```powershell
python -m pip install -r requirements.txt
```

---

# 启动项目

使用：

```powershell
fastapi dev --entrypoint app.main:app
```

打开网页：

```text
http://127.0.0.1:8000
```

Swagger API 文档：

```text
http://127.0.0.1:8000/docs
```

---

# API

## 健康检查

```text
GET /api/health
```

---

## 获取支出

```text
GET /api/expenses
```

---

## 搜索

```text
GET /api/expenses?keyword=关键词
```

---

## 分类筛选

```text
GET /api/expenses?category=家电
```

---

## 付款人筛选

```text
GET /api/expenses?payer=A
```

---

## 排序

```text
GET /api/expenses?sort_by=date&sort_order=desc
```

支持：

```text
sort_by:
date
amount
item
```

支持：

```text
sort_order:
asc
desc
```

非法排序参数会返回：

```text
422 Unprocessable Entity
```

---

## 搜索 + 筛选 + 排序

```text
GET /api/expenses?keyword=电&category=家电&payer=A&sort_by=amount&sort_order=asc
```

---

## 添加支出

```text
POST /api/expenses
```

示例：

```json
{
  "date": "2026-08-13",
  "item": "电饭煲",
  "amount": 199,
  "category": "家电",
  "payer": "A",
  "note": "租房购买"
}
```

成功：

```text
201 Created
```

---

## 修改支出

```text
PUT /api/expenses/{expense_id}
```

---

## 删除支出

```text
DELETE /api/expenses/{expense_id}
```

不存在：

```text
404 Not Found
```

---

# 数据验证

目前包括：

- 日期必须合法
- 金额必须大于 0
- 物品不能为空
- 分类不能为空
- 付款人不能为空
- 必填文本自动清除首尾空格
- 非法请求由 FastAPI / Pydantic 返回 422
- 非法排序字段或排序方向返回 422

---

# SQLite 数据库

正式数据库：

```text
data/expenses.db
```

数据库文件不提交到 Git。

`.gitignore` 忽略：

```text
data/*.db
data/*.db-shm
data/*.db-wal
```

---

# JSON 数据

项目早期使用：

```text
data/expenses.json
```

Web 版本已经不再使用 JSON 作为正式运行数据库。

JSON 文件现在主要作为：

- 历史数据
- 文件读写学习记录
- SQLite 数据迁移来源

旧数据迁移：

```powershell
python migrate_json_to_db.py
```

---

# 自动化测试

项目使用 pytest。

运行：

```powershell
python -m pytest -v
```

目前测试覆盖：

- 健康检查
- 获取支出
- 创建支出
- 非法金额
- 空文本字段
- 修改支出
- 修改不存在的记录
- 修改非法金额
- 删除支出
- 删除不存在的记录
- 月份统计
- 分类统计
- 付款人统计
- 关键词搜索
- 分类筛选
- 付款人筛选
- 搜索与筛选组合
- 日期排序
- 金额排序
- 搜索 + 筛选 + 排序
- 非法排序参数

排序功能完成后预期：

```text
18 passed
```

---

# 测试数据库隔离

pytest 使用独立 SQLite 内存数据库：

```text
sqlite://
```

通过：

```text
dependency_overrides
```

把正式数据库 Session 替换成测试 Session。

因此运行：

```powershell
python -m pytest -v
```

不会修改：

```text
data/expenses.db
```

---

# CI

项目已经使用 GitHub Actions 实现 CI。

工作流：

```text
.github/workflows/tests.yml
```

每次：

```text
git push
```

或者 Pull Request 后，GitHub Actions 会：

```text
Checkout 代码
↓
创建 Python 环境
↓
安装 requirements.txt
↓
运行 pytest
↓
判断自动化测试是否通过
```

CI 绿色表示：

> 当前版本通过了项目目前配置的所有自动化检查。

并不代表程序绝对不存在 Bug。

---

# 当前开发进度

```text
Python CLI                  ✅
FastAPI                     ✅
SQLite                      ✅
SQLModel                    ✅
CRUD                        ✅
网页前端                    ✅
统计                        ✅
pytest                      ✅
GitHub Actions CI           ✅

搜索                        ✅
筛选                        ✅
排序                        ✅
分页                        ⏳

月度预算                    ⏳

CD / 公网部署               暂不实施
```

---

# 下一阶段

当前固定开发顺序：

```text
1. 搜索       ✅
2. 筛选       ✅
3. 排序       ✅
4. 分页       ← 下一步
5. 月度预算
```

---

# Git 开发流程

每完成一个功能：

```powershell
git status
```

确认修改内容。

然后只暂存相关文件。

例如排序功能：

```powershell
git add app/main.py tests/test_expenses.py frontend/index.html frontend/styles.css frontend/api.js frontend/app.js README.md
```

提交：

```powershell
git commit -m "feat: add expense sorting"
```

推送：

```powershell
git push
```

最后确认 GitHub Actions CI 通过。

---

# 项目学习目标

这个项目用于练习：

```text
需求分析
↓
功能拆分
↓
数据模型
↓
REST API
↓
数据库查询
↓
CRUD
↓
搜索
↓
筛选
↓
排序
↓
自动化测试
↓
Git
↓
CI
↓
项目交付
```

最终目标是能够自己解释：

- API 的输入和输出
- 数据库如何保存数据
- `where()` 如何筛选数据
- `order_by()` 如何排序数据
- pytest 为什么不会污染正式数据库
- CI 如何检查代码回归
- 搜索、筛选和排序如何组合