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

---

# 筛选功能

按分类筛选：

```text
GET /api/expenses?category=家电
```

按付款人筛选：

```text
GET /api/expenses?payer=A
```

组合筛选：

```text
GET /api/expenses?category=家电&payer=A
```

搜索与筛选可以组合：

```text
GET /api/expenses?keyword=电&category=家电&payer=A
```

---

# 排序功能

支持按照以下字段排序：

- 日期 `date`
- 金额 `amount`
- 物品 `item`

排序方向：

```text
asc
desc
```

例如：

```text
GET /api/expenses?sort_by=amount&sort_order=asc
```

默认：

```text
sort_by=date
sort_order=desc
```

也就是日期较新的记录优先显示。

---

# 分页功能

支出列表支持分页。

分页参数：

```text
page
page_size
```

默认：

```text
page=1
page_size=10
```

例如获取第一页：

```text
GET /api/expenses?page=1&page_size=10
```

第二页：

```text
GET /api/expenses?page=2&page_size=10
```

`page` 必须大于等于：

```text
1
```

`page_size` 范围：

```text
1 - 100
```

后端使用数据库：

```text
OFFSET
LIMIT
```

实现真正的分页查询。

例如：

```text
page=3
page_size=10
```

计算：

```text
offset = (3 - 1) × 10
       = 20
```

表示跳过前 20 条记录，再读取最多 10 条。

---

# 分页响应信息

`GET /api/expenses` 的 JSON Body 仍然是支出数组。

例如：

```json
[
  {
    "id": 20,
    "date": "2026-08-13",
    "item": "电饭煲",
    "amount": 199,
    "category": "家电",
    "payer": "A",
    "note": ""
  }
]
```

分页元数据通过 HTTP Response Header 返回。

包括：

```text
X-Total-Count
X-Total-Pages
X-Page
X-Page-Size
```

例如：

```text
X-Total-Count: 23
X-Total-Pages: 3
X-Page: 2
X-Page-Size: 10
```

表示：

```text
符合条件的数据共 23 条
总共 3 页
当前是第 2 页
每页 10 条
```

---

# 搜索 + 筛选 + 排序 + 分页

四个功能可以同时工作。

例如：

```text
GET /api/expenses?keyword=电&category=家电&payer=A&sort_by=amount&sort_order=asc&page=1&page_size=10
```

查询顺序可以理解为：

```text
数据库中的全部支出
↓
搜索 keyword
↓
筛选 category / payer
↓
排序 order_by
↓
分页 offset / limit
↓
返回当前页
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

只需要在虚拟环境不存在时创建。

## 激活虚拟环境

Windows PowerShell：

```powershell
.\.venv\Scripts\Activate.ps1
```

成功：

```text
(.venv)
```

## 安装依赖

```powershell
python -m pip install -r requirements.txt
```

---

# 启动项目

开发启动命令：

```powershell
fastapi dev --entrypoint app.main:app
```

网页：

```text
http://127.0.0.1:8000
```

Swagger：

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

默认：

```text
GET /api/expenses
```

等价于：

```text
GET /api/expenses?page=1&page_size=10&sort_by=date&sort_order=desc
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
GET /api/expenses?sort_by=amount&sort_order=asc
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

---

## 分页

```text
GET /api/expenses?page=2&page_size=10
```

支持：

```text
page >= 1

1 <= page_size <= 100
```

---

## 完整组合

```text
GET /api/expenses?keyword=电&category=家电&payer=A&sort_by=amount&sort_order=asc&page=1&page_size=10
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
- 非法搜索/请求参数由 FastAPI 返回 422
- 非法排序字段返回 422
- 非法排序方向返回 422
- page 小于 1 返回 422
- page_size 小于 1 或大于 100 返回 422

---

# SQLite 数据库

正式数据库：

```text
data/expenses.db
```

数据库文件不提交 Git。

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

当前 Web 版本不再使用 JSON 作为正式数据库。

JSON 主要保留作为：

- 项目历史数据
- 文件读写学习记录
- SQLite 迁移来源

迁移：

```powershell
python migrate_json_to_db.py
```

---

# 自动化测试

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
- 修改不存在记录
- 修改非法金额
- 删除支出
- 删除不存在记录
- 月份统计
- 分类统计
- 付款人统计
- 关键词搜索
- 分类筛选
- 付款人筛选
- 搜索和筛选组合
- 日期排序
- 金额排序
- 搜索 + 筛选 + 排序
- 非法排序参数
- 分页
- 分页总数量
- 分页总页数
- 非法分页参数

分页完成后预期：

```text
19 passed
```

---

# 测试数据库隔离

pytest 使用：

```text
sqlite://
```

作为独立 SQLite 内存数据库。

通过 FastAPI：

```text
dependency_overrides
```

替换正式数据库 Session。

因此：

```powershell
python -m pytest -v
```

不会影响：

```text
data/expenses.db
```

---

# CI

项目使用 GitHub Actions。

配置：

```text
.github/workflows/tests.yml
```

每次：

```text
git push
```

或者 Pull Request 时：

```text
Checkout
↓
Python 3.10
↓
安装 requirements.txt
↓
pytest
↓
CI 结果
```

CI 绿色表示：

> 当前提交通过了项目配置的自动化测试。

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
分页                        ✅

月度预算                    ⏳

CD / 公网部署               暂不实施
```

---

# 当前阶段状态

搜索、筛选、排序、分页阶段已经完成：

```text
搜索
↓
筛选
↓
排序
↓
分页
```

下一阶段：

```text
月度预算
```

---

# Git 开发流程

分页功能完成后检查：

```powershell
git status
```

暂存：

```powershell
git add app/main.py tests/test_expenses.py frontend/index.html frontend/styles.css frontend/api.js frontend/app.js README.md
```

提交：

```powershell
git commit -m "feat: add expense pagination"
```

推送：

```powershell
git push
```

最后检查 GitHub Actions。

---

# 项目学习目标

项目目前已经练习：

```text
需求分析
↓
项目结构
↓
FastAPI
↓
REST API
↓
SQLite
↓
SQLModel
↓
CRUD
↓
搜索 where / contains
↓
筛选 where
↓
排序 order_by
↓
分页 offset / limit
↓
pytest
↓
Git
↓
GitHub Actions CI
↓
README
↓
项目交付
```

最终需要能够解释：

- `where()` 为什么负责筛选
- `order_by()` 为什么负责排序
- `offset()` 为什么负责跳过记录
- `limit()` 为什么限制当前页数量
- page 和 page_size 如何计算 offset
- 为什么分页还需要查询 total
- HTTP Header 如何传递分页元数据
- pytest 为什么不会污染正式数据库
- CI 如何检查回归问题