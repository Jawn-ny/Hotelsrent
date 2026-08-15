# 寿司小屋的租房记账程序

一个基于 **FastAPI + SQLModel + SQLite** 开发的租房生活记账 Web 项目。

项目最初从 Python 命令行记账程序开始，随后逐步升级为带数据库、REST API、网页前端、自动化测试和 CI 的完整小型 Web 项目。

---

# 当前功能

## 支出管理

支持完整 CRUD：

* 添加支出
* 查看支出
* 修改支出
* 删除支出

每条支出包含：

* 日期
* 物品
* 金额
* 分类
* 付款人
* 备注

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

* 物品 `item`
* 分类 `category`
* 付款人 `payer`
* 备注 `note`

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

* 日期 `date`
* 金额 `amount`
* 物品 `item`

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

* 月份
* 总支出
* 记录数量

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

# 月度预算功能

项目支持为不同月份设置独立预算。

预算数据包括：

```text
id
month
amount
```

例如：

```text
month = 2026-08
amount = 3000
```

业务规则：

```text
一个月份只能存在一条预算记录
```

如果某个月已经存在预算，再次创建相同月份的预算会返回：

```text
400 Bad Request
```

用户可以通过修改预算接口更新原来的金额。

---

## 创建月度预算

接口：

```text
POST /api/budgets
```

示例：

```json
{
  "month": "2026-08",
  "amount": 3000
}
```

成功后返回：

```json
{
  "id": 1,
  "month": "2026-08",
  "amount": 3000
}
```

---

## 查询月度预算

接口：

```text
GET /api/budgets/{month}
```

例如：

```text
GET /api/budgets/2026-08
```

如果该月份没有设置预算：

```text
404 Not Found
```

---

## 修改月度预算

接口：

```text
PUT /api/budgets/{month}
```

例如：

```text
PUT /api/budgets/2026-08
```

请求 Body：

```json
{
  "amount": 5000
}
```

表示把：

```text
2026-08
```

的预算修改为：

```text
5000
```

---

# 月度预算统计

接口：

```text
GET /api/budgets/{month}/summary
```

例如：

```text
GET /api/budgets/2026-08/summary
```

返回：

```json
{
  "month": "2026-08",
  "budget": 5000,
  "spent": 2100,
  "remaining": 2900
}
```

其中：

```text
budget
```

来自 Budget 数据库表。

```text
spent
```

不是直接存入 Budget 表，而是根据该月份所有 `Expense` 自动计算：

```text
spent = 当前月份所有支出的 amount 总和
```

剩余预算：

```text
remaining = budget - spent
```

这样可以避免 Budget 表和 Expense 表重复保存同一份支出数据。

---

# 预算使用率

网页前端会根据：

```text
spent / budget × 100%
```

计算预算使用率。

例如：

```text
budget = 5000
spent = 2000
```

预算使用率：

```text
2000 / 5000 × 100%
= 40%
```

网页会显示：

```text
本月预算
已支出
剩余预算
预算使用率
```

并通过进度条展示当前预算状态。

状态包括：

```text
低于 80%
→ 预算正常

80% - 100%
→ 接近上限

大于等于 100%
→ 已超预算
```

---

# 前端功能

网页前端目前支持：

* 添加支出
* 编辑支出
* 删除支出
* 查看支出
* 关键词搜索
* 分类筛选
* 付款人筛选
* 排序
* 分页
* 月份统计
* 分类统计
* 付款人统计
* 设置月度预算
* 修改月度预算
* 查询月度预算
* 查看已支出
* 查看剩余预算
* 查看预算使用率
* 超预算提示

前端使用：

```text
HTML
CSS
JavaScript
```

页面顶部使用卡通布偶猫作为项目视觉元素。

---

# 技术栈

## 后端

* Python
* FastAPI
* SQLModel
* SQLAlchemy
* SQLite

## 前端

* HTML
* CSS
* JavaScript

## 测试

* pytest
* FastAPI TestClient

## 工程工具

* Git
* GitHub
* GitHub Actions

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

在项目根目录运行：

```powershell
python -m uvicorn app.main:app --reload
```

网页：

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

## 搜索 + 筛选 + 排序 + 分页

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

## 创建预算

```text
POST /api/budgets
```

---

## 查询预算

```text
GET /api/budgets/{month}
```

---

## 修改预算

```text
PUT /api/budgets/{month}
```

---

## 查询预算统计

```text
GET /api/budgets/{month}/summary
```

---

# 数据验证

目前包括：

* 日期必须合法
* 支出金额必须大于 0
* 预算金额必须大于 0
* 物品不能为空
* 分类不能为空
* 付款人不能为空
* 必填文本自动清除首尾空格
* 非法搜索/请求参数由 FastAPI 返回 422
* 非法排序字段返回 422
* 非法排序方向返回 422
* `page` 小于 1 返回 422
* `page_size` 小于 1 或大于 100 返回 422
* 同一个月份不能重复创建预算
* 查询不存在的预算返回 404
* 修改不存在的预算返回 404

---

# SQLite 数据库

正式数据库：

```text
data/expenses.db
```

当前 SQLite 数据库中不仅保存：

```text
Expense
```

也保存：

```text
Budget
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

* 项目历史数据
* 文件读写学习记录
* SQLite 迁移来源

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

当前测试结果：

```text
27 passed
```

测试覆盖：

* 健康检查
* 获取支出
* 创建支出
* 非法支出金额
* 空文本字段
* 修改支出
* 修改不存在记录
* 修改非法金额
* 删除支出
* 删除不存在记录
* 月份统计
* 分类统计
* 付款人统计
* 关键词搜索
* 分类筛选
* 付款人筛选
* 搜索和筛选组合
* 日期排序
* 金额排序
* 搜索 + 筛选 + 排序
* 非法排序参数
* 分页
* 分页总数量
* 分页总页数
* 非法分页参数
* 创建预算
* 重复创建同月份预算
* 查询预算
* 查询不存在预算
* 修改预算
* 修改不存在预算
* 月度预算统计
* 预算金额验证
* 不同月份支出隔离

---

# 月度预算测试示例

假设：

```text
2026-11 预算：
1000
```

支出：

```text
2026-11 房租 500
2026-11 买菜 100
2026-12 其他支出 300
```

查询：

```text
GET /api/budgets/2026-11/summary
```

测试要求：

```text
budget = 1000
spent = 600
remaining = 400
```

其中：

```text
2026-12 的 300 元
```

不能被错误计算进 2026-11。

这个测试用于检查月度预算统计是否正确按照月份过滤支出。

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

因此运行：

```powershell
python -m pytest -v
```

不会影响正式数据库：

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

或者创建 Pull Request 时：

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

当前本地测试：

```text
27 passed
```

提交到 GitHub 后，GitHub Actions 会再次运行 pytest 检查代码。

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

月度预算                    ✅
预算前端                    ✅
预算自动化测试              ✅

CD / 公网部署               暂不实施
```

---

# 已完成阶段

## 阶段 1：CI

```text
pytest
↓
GitHub Actions
↓
push / Pull Request 自动测试
```

状态：

```text
✅ 已完成
```

---

## 阶段 2：支出查询增强

```text
搜索
↓
筛选
↓
排序
↓
分页
```

状态：

```text
✅ 已完成
```

---

## 阶段 3：月度预算

```text
Budget 数据模型
↓
创建预算
↓
查询预算
↓
修改预算
↓
计算本月支出
↓
计算剩余预算
↓
预算使用率
↓
前端预算面板
↓
pytest 自动化测试
```

状态：

```text
✅ 已完成
```

---

# Git 开发流程

功能开发完成后先运行：

```powershell
python -m pytest -v
```

确认：

```text
27 passed
```

然后检查：

```powershell
git status
```

暂存本次全部修改：

```powershell
git add .
```

提交：

```powershell
git commit -m "feat: add monthly budget feature"
```

推送：

```powershell
git push
```

最后打开 GitHub 检查 GitHub Actions。

如果显示绿色：

```text
✓
```

说明本次月度预算版本同时通过了 CI。

---

# 项目学习目标

项目目前已经练习：

```text
需求分析
↓
项目结构
↓
Python CLI
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
数据库聚合与业务计算
↓
月度预算模型设计
↓
前后端 API 对接
↓
pytest
↓
测试数据库隔离
↓
Git
↓
GitHub
↓
GitHub Actions CI
↓
README
↓
项目交付
```

目前需要能够解释：

* `where()` 为什么负责筛选
* `order_by()` 为什么负责排序
* `offset()` 为什么负责跳过记录
* `limit()` 为什么限制当前页数量
* `page` 和 `page_size` 如何计算 `offset`
* 为什么分页还需要查询 `total`
* HTTP Header 如何传递分页元数据
* `Budget` 和 `Expense` 为什么应该是两个不同的数据模型
* 为什么 `spent` 不直接保存在 Budget 表里
* `spent` 如何根据 Expense 动态计算
* `remaining = budget - spent` 的意义
* 为什么一个月份只能有一条预算
* pytest 为什么不会污染正式数据库
* `dependency_overrides` 如何替换正式数据库依赖
* CI 如何发现代码修改产生的回归问题
* 前端如何通过 API 与 FastAPI 后端通信

---

# 当前项目状态

当前三个主要开发阶段已经完成：

```text
阶段 1：GitHub Actions CI
             ✅

阶段 2：搜索 / 筛选 / 排序 / 分页
             ✅

阶段 3：月度预算
             ✅
```

当前自动化测试：

```text
27 passed
```

项目现在已经具备一个小型完整 Web 应用的基本结构：

```text
数据库
+
后端 API
+
前端页面
+
自动化测试
+
CI
+
Git / GitHub
+
README
```
