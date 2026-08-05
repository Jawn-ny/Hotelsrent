const healthStatusEl = document.getElementById("health-status");
const expenseFormEl = document.getElementById("expense-form");
const formMessageEl = document.getElementById("form-message");
const expenseTableBodyEl = document.getElementById("expense-table-body");
const expenseCountEl = document.getElementById("expense-count");
const monthInputEl = document.getElementById("summary-month");
const monthSummaryResultEl = document.getElementById("month-summary-result");
const categorySummaryEl = document.getElementById("category-summary");
const payerSummaryEl = document.getElementById("payer-summary");
const refreshExpensesBtn = document.getElementById("refresh-expenses-btn");
const refreshSummaryBtn = document.getElementById("refresh-summary-btn");
const monthSummaryBtn = document.getElementById("month-summary-btn");

function showMessage(message, type = "") {
  formMessageEl.textContent = message;
  formMessageEl.className = `message ${type}`.trim();
}

function formatAmount(value) {
  return `¥ ${Number(value).toFixed(2)}`;
}

function renderHealth(status) {
  healthStatusEl.textContent = status;
  healthStatusEl.className = "status-pill ok";
}

function renderHealthError(message) {
  healthStatusEl.textContent = `异常：${message}`;
  healthStatusEl.className = "status-pill error";
}

function renderExpenses(expenses) {
  expenseCountEl.textContent = `${expenses.length} 条记录`;

  if (!expenses.length) {
    expenseTableBodyEl.innerHTML = `
      <tr>
        <td colspan="6" class="empty-cell">暂无支出记录</td>
      </tr>
    `;
    return;
  }

  expenseTableBodyEl.innerHTML = expenses
    .map((expense) => {
      return `
        <tr>
          <td>${expense.date ?? ""}</td>
          <td>${expense.item ?? ""}</td>
          <td>${formatAmount(expense.amount ?? 0)}</td>
          <td>${expense.category ?? ""}</td>
          <td>${expense.payer ?? ""}</td>
          <td>${expense.note ?? ""}</td>
        </tr>
      `;
    })
    .join("");
}

function renderMonthSummary(data) {
  monthSummaryResultEl.className = "result-card";
  monthSummaryResultEl.innerHTML = `
    <p><strong>月份：</strong>${data.month}</p>
    <p><strong>总支出：</strong>${formatAmount(data.total)}</p>
    <p><strong>记录数量：</strong>${data.count} 笔</p>
  `;
}

function renderSummaryList(container, objectData, emptyText) {
  const entries = Object.entries(objectData);

  if (!entries.length) {
    container.className = "summary-list empty-state";
    container.textContent = emptyText;
    return;
  }

  container.className = "summary-list";
  container.innerHTML = entries
    .map(([name, value]) => {
      return `
        <div class="summary-item">
          <span class="summary-name">${name}</span>
          <span class="summary-value">${formatAmount(value)}</span>
        </div>
      `;
    })
    .join("");
}

async function loadHealth() {
  try {
    const data = await api.getHealth();
    renderHealth(data.status);
  } catch (error) {
    renderHealthError(error.message);
  }
}

async function loadExpenses() {
  try {
    const expenses = await api.getExpenses();
    renderExpenses(expenses);
  } catch (error) {
    expenseTableBodyEl.innerHTML = `
      <tr>
        <td colspan="6" class="empty-cell">加载失败：${error.message}</td>
      </tr>
    `;
    expenseCountEl.textContent = "加载失败";
  }
}

async function loadCategorySummary() {
  try {
    const data = await api.getCategorySummary();
    renderSummaryList(
      categorySummaryEl,
      data.category_totals,
      "暂无分类统计数据"
    );
  } catch (error) {
    categorySummaryEl.className = "summary-list empty-state";
    categorySummaryEl.textContent = `加载失败：${error.message}`;
  }
}

async function loadPayerSummary() {
  try {
    const data = await api.getPayerSummary();
    renderSummaryList(
      payerSummaryEl,
      data.payer_totals,
      "暂无付款人统计数据"
    );
  } catch (error) {
    payerSummaryEl.className = "summary-list empty-state";
    payerSummaryEl.textContent = `加载失败：${error.message}`;
  }
}

async function loadAllSummaries() {
  await Promise.all([loadCategorySummary(), loadPayerSummary()]);
}

expenseFormEl.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    date: document.getElementById("date").value,
    item: document.getElementById("item").value,
    amount: Number(document.getElementById("amount").value),
    category: document.getElementById("category").value,
    payer: document.getElementById("payer").value,
    note: document.getElementById("note").value
  };

  try {
    await api.createExpense(payload);
    showMessage("添加成功，已经写入记账数据。", "success");
    expenseFormEl.reset();
    await loadExpenses();
    await loadAllSummaries();
  } catch (error) {
    showMessage(`添加失败：${error.message}`, "error");
  }
});

monthSummaryBtn.addEventListener("click", async () => {
  const monthValue = monthInputEl.value;

  if (!monthValue) {
    monthSummaryResultEl.className = "result-card";
    monthSummaryResultEl.textContent = "请先选择月份。";
    return;
  }

  try {
    const data = await api.getMonthSummary(monthValue);
    renderMonthSummary(data);
  } catch (error) {
    monthSummaryResultEl.className = "result-card";
    monthSummaryResultEl.textContent = `查询失败：${error.message}`;
  }
});

refreshExpensesBtn.addEventListener("click", loadExpenses);
refreshSummaryBtn.addEventListener("click", loadAllSummaries);

async function init() {
  await loadHealth();
  await loadExpenses();
  await loadAllSummaries();
}

init();