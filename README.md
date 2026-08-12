# 寿司小屋的租房记账程序

一个基于 FastAPI + SQLModel + SQLite 开发的租房生活记账 Web 项目。

项目最初从 Python 命令行程序开始，随后逐步升级为带数据库、REST API、网页前端、自动化测试和 CI 的完整小型 Web 项目。

---

## 当前功能

### 支出管理

- 添加支出
  - 日期
  - 物品
  - 金额
  - 分类
  - 付款人
  - 备注
- 查看全部支出
- 修改支出
- 删除支出
- 支出数据保存到 SQLite 数据库

### 搜索

支持通过关键词搜索支出记录。

搜索范围包括：

- 物品 `item`
- 分类 `category`
- 付款人 `payer`
- 备注 `note`

例如：

```text
GET /api/expenses?keyword=电饭煲
