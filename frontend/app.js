const healthStatusEl =
  document.getElementById(
    "health-status"
  );

const expenseFormEl =
  document.getElementById(
    "expense-form"
  );

const formTitleEl =
  document.getElementById(
    "form-title"
  );

const editStatusEl =
  document.getElementById(
    "edit-status"
  );

const submitExpenseBtn =
  document.getElementById(
    "submit-expense-btn"
  );

const cancelEditBtn =
  document.getElementById(
    "cancel-edit-btn"
  );

const formMessageEl =
  document.getElementById(
    "form-message"
  );

const expenseTableBodyEl =
  document.getElementById(
    "expense-table-body"
  );

const expenseCountEl =
  document.getElementById(
    "expense-count"
  );

const monthInputEl =
  document.getElementById(
    "summary-month"
  );

const monthSummaryResultEl =
  document.getElementById(
    "month-summary-result"
  );

const categorySummaryEl =
  document.getElementById(
    "category-summary"
  );

const payerSummaryEl =
  document.getElementById(
    "payer-summary"
  );

const refreshExpensesBtn =
  document.getElementById(
    "refresh-expenses-btn"
  );

const refreshSummaryBtn =
  document.getElementById(
    "refresh-summary-btn"
  );

const monthSummaryBtn =
  document.getElementById(
    "month-summary-btn"
  );

const expenseSearchInputEl =
  document.getElementById(
    "expense-search-input"
  );

const searchExpensesBtn =
  document.getElementById(
    "search-expenses-btn"
  );

const clearSearchBtn =
  document.getElementById(
    "clear-search-btn"
  );

const categoryFilterEl =
  document.getElementById(
    "category-filter"
  );

const payerFilterEl =
  document.getElementById(
    "payer-filter"
  );

const applyFilterBtn =
  document.getElementById(
    "apply-filter-btn"
  );

const clearFilterBtn =
  document.getElementById(
    "clear-filter-btn"
  );


let currentExpenses = [];

let editingExpenseId = null;



function escapeHtml(value) {

  const text =
    String(value ?? "");

  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}



function showMessage(
  message,
  type = ""
) {

  formMessageEl.textContent =
    message;

  formMessageEl.className =
    `message ${type}`.trim();
}



function formatAmount(value) {

  return `¥ ${Number(value).toFixed(2)}`;
}



function renderHealth(status) {

  healthStatusEl.textContent =
    status;

  healthStatusEl.className =
    "status-pill ok";
}



function renderHealthError(message) {

  healthStatusEl.textContent =
    `异常：${message}`;

  healthStatusEl.className =
    "status-pill error";
}



function renderExpenses(expenses) {

  currentExpenses =
    expenses;


  expenseCountEl.textContent =
    `${expenses.length} 条记录`;


  if (!expenses.length) {

    expenseTableBodyEl.innerHTML = `
      <tr>

        <td
          colspan="8"
          class="empty-cell"
        >
          没有找到符合条件的支出记录
        </td>

      </tr>
    `;

    return;
  }


  expenseTableBodyEl.innerHTML =
    expenses
      .map((expense) => {

        return `
          <tr>

            <td>
              ${escapeHtml(expense.id)}
            </td>

            <td>
              ${escapeHtml(expense.date)}
            </td>

            <td>
              ${escapeHtml(expense.item)}
            </td>

            <td>
              ${formatAmount(expense.amount)}
            </td>

            <td>
              ${escapeHtml(expense.category)}
            </td>

            <td>
              ${escapeHtml(expense.payer)}
            </td>

            <td>
              ${escapeHtml(expense.note)}
            </td>

            <td class="action-cell">

              <button
                class="sketch-btn edit-btn"
                data-expense-id="${expense.id}"
              >
                编辑
              </button>

              <button
                class="sketch-btn delete-btn"
                data-expense-id="${expense.id}"
              >
                删除
              </button>

            </td>

          </tr>
        `;
      })
      .join("");
}



function renderMonthSummary(data) {

  monthSummaryResultEl.className =
    "result-card";


  monthSummaryResultEl.innerHTML = `
    <p>
      <strong>月份：</strong>
      ${escapeHtml(data.month)}
    </p>

    <p>
      <strong>总支出：</strong>
      ${formatAmount(data.total)}
    </p>

    <p>
      <strong>记录数量：</strong>
      ${data.count} 笔
    </p>
  `;
}



function renderSummaryList(
  container,
  objectData,
  emptyText
) {

  const entries =
    Object.entries(
      objectData || {}
    );


  if (!entries.length) {

    container.className =
      "summary-list empty-state";

    container.textContent =
      emptyText;

    return;
  }


  container.className =
    "summary-list";


  container.innerHTML =
    entries
      .map(
        ([name, value]) => {

          return `
            <div class="summary-item">

              <span class="summary-name">
                ${escapeHtml(name)}
              </span>

              <span class="summary-value">
                ${formatAmount(value)}
              </span>

            </div>
          `;
        }
      )
      .join("");
}



function populateSelect(
  selectElement,
  values,
  emptyText
) {

  const currentValue =
    selectElement.value;


  const options =
    [
      `<option value="">${emptyText}</option>`,
      ...values.map(
        (value) =>
          `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`
      )
    ];


  selectElement.innerHTML =
    options.join("");


  if (
    values.includes(currentValue)
  ) {

    selectElement.value =
      currentValue;
  }
}



function getFormPayload() {

  return {

    date:
      document
        .getElementById("date")
        .value,

    item:
      document
        .getElementById("item")
        .value,

    amount:
      Number(
        document
          .getElementById("amount")
          .value
      ),

    category:
      document
        .getElementById("category")
        .value,

    payer:
      document
        .getElementById("payer")
        .value,

    note:
      document
        .getElementById("note")
        .value

  };
}



function enterEditMode(expense) {

  editingExpenseId =
    expense.id;


  document
    .getElementById("date")
    .value =
    expense.date;

  document
    .getElementById("item")
    .value =
    expense.item;

  document
    .getElementById("amount")
    .value =
    expense.amount;

  document
    .getElementById("category")
    .value =
    expense.category;

  document
    .getElementById("payer")
    .value =
    expense.payer;

  document
    .getElementById("note")
    .value =
    expense.note ?? "";


  formTitleEl.textContent =
    `编辑支出 #${expense.id}`;

  submitExpenseBtn.textContent =
    "保存修改";


  editStatusEl.classList.remove(
    "hidden"
  );

  cancelEditBtn.classList.remove(
    "hidden"
  );


  showMessage(
    `正在编辑「${expense.item}」。修改完成后点击“保存修改”。`
  );


  expenseFormEl.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}



function leaveEditMode() {

  editingExpenseId =
    null;


  expenseFormEl.reset();


  formTitleEl.textContent =
    "添加支出";

  submitExpenseBtn.textContent =
    "添加支出";


  editStatusEl.classList.add(
    "hidden"
  );

  cancelEditBtn.classList.add(
    "hidden"
  );
}



async function loadHealth() {

  try {

    const data =
      await api.getHealth();

    renderHealth(
      data.status
    );

  } catch (error) {

    renderHealthError(
      error.message
    );
  }
}



async function loadFilterOptions() {

  try {

    const allExpenses =
      await api.getExpenses();


    const categories =
      [
        ...new Set(
          allExpenses.map(
            (expense) =>
              expense.category
          )
        )
      ]
        .filter(Boolean)
        .sort();


    const payers =
      [
        ...new Set(
          allExpenses.map(
            (expense) =>
              expense.payer
          )
        )
      ]
        .filter(Boolean)
        .sort();


    populateSelect(
      categoryFilterEl,
      categories,
      "全部分类"
    );


    populateSelect(
      payerFilterEl,
      payers,
      "全部付款人"
    );

  } catch (error) {

    console.error(
      "加载筛选选项失败：",
      error
    );
  }
}



async function loadExpenses() {

  try {

    const keyword =
      expenseSearchInputEl
        .value
        .trim();

    const category =
      categoryFilterEl.value;

    const payer =
      payerFilterEl.value;


    const expenses =
      await api.getExpenses(
        keyword,
        category,
        payer
      );


    renderExpenses(
      expenses
    );

  } catch (error) {

    expenseTableBodyEl.innerHTML = `
      <tr>

        <td
          colspan="8"
          class="empty-cell"
        >
          加载失败：
          ${escapeHtml(error.message)}
        </td>

      </tr>
    `;


    expenseCountEl.textContent =
      "加载失败";
  }
}



async function refreshExpenseArea() {

  await loadFilterOptions();

  await loadExpenses();
}



async function loadCategorySummary() {

  try {

    const data =
      await api.getCategorySummary();


    renderSummaryList(
      categorySummaryEl,
      data.category_totals,
      "暂无分类统计数据"
    );

  } catch (error) {

    categorySummaryEl.className =
      "summary-list empty-state";

    categorySummaryEl.textContent =
      `加载失败：${error.message}`;
  }
}



async function loadPayerSummary() {

  try {

    const data =
      await api.getPayerSummary();


    renderSummaryList(
      payerSummaryEl,
      data.payer_totals,
      "暂无付款人统计数据"
    );

  } catch (error) {

    payerSummaryEl.className =
      "summary-list empty-state";

    payerSummaryEl.textContent =
      `加载失败：${error.message}`;
  }
}



async function loadAllSummaries() {

  await Promise.all([
    loadCategorySummary(),
    loadPayerSummary()
  ]);
}



async function refreshSelectedMonthSummary() {

  const monthValue =
    monthInputEl.value;


  if (!monthValue) {

    return;
  }


  try {

    const data =
      await api.getMonthSummary(
        monthValue
      );


    renderMonthSummary(
      data
    );

  } catch (error) {

    monthSummaryResultEl.className =
      "result-card";

    monthSummaryResultEl.textContent =
      `查询失败：${error.message}`;
  }
}



async function refreshAllData() {

  await refreshExpenseArea();

  await loadAllSummaries();

  await refreshSelectedMonthSummary();
}



expenseFormEl.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    const payload =
      getFormPayload();


    try {

      if (
        editingExpenseId === null
      ) {

        await api.createExpense(
          payload
        );


        showMessage(
          "添加成功，已经保存到 SQLite 数据库。",
          "success"
        );


        expenseFormEl.reset();

      } else {

        const updatedExpense =
          await api.updateExpense(
            editingExpenseId,
            payload
          );


        leaveEditMode();


        showMessage(
          `支出 #${updatedExpense.id} 修改成功。`,
          "success"
        );
      }


      await refreshAllData();

    } catch (error) {

      showMessage(
        `保存失败：${error.message}`,
        "error"
      );
    }
  }
);



expenseTableBodyEl.addEventListener(
  "click",
  async (event) => {

    const editButton =
      event.target.closest(
        ".edit-btn"
      );

    const deleteButton =
      event.target.closest(
        ".delete-btn"
      );


    if (editButton) {

      const expenseId =
        Number(
          editButton.dataset.expenseId
        );


      const expense =
        currentExpenses.find(
          (item) =>
            item.id === expenseId
        );


      if (!expense) {

        window.alert(
          "没有找到这条支出，请刷新页面后重试。"
        );

        return;
      }


      enterEditMode(
        expense
      );

      return;
    }


    if (deleteButton) {

      const expenseId =
        Number(
          deleteButton.dataset.expenseId
        );


      const expense =
        currentExpenses.find(
          (item) =>
            item.id === expenseId
        );


      if (!expense) {

        window.alert(
          "没有找到这条支出，请刷新页面后重试。"
        );

        return;
      }


      const confirmed =
        window.confirm(
          `确定删除「${expense.item}」这笔支出吗？`
        );


      if (!confirmed) {

        return;
      }


      deleteButton.disabled =
        true;

      deleteButton.textContent =
        "删除中...";


      try {

        await api.deleteExpense(
          expenseId
        );


        if (
          editingExpenseId ===
          expenseId
        ) {

          leaveEditMode();
        }


        await refreshAllData();


        showMessage(
          `已删除「${expense.item}」。`,
          "success"
        );

      } catch (error) {

        window.alert(
          `删除失败：${error.message}`
        );


        deleteButton.disabled =
          false;

        deleteButton.textContent =
          "删除";
      }
    }
  }
);



cancelEditBtn.addEventListener(
  "click",
  () => {

    leaveEditMode();

    showMessage(
      "已取消编辑。"
    );
  }
);



expenseFormEl.addEventListener(
  "reset",
  () => {

    if (
      editingExpenseId !== null
    ) {

      setTimeout(
        () => {

          leaveEditMode();

          showMessage(
            "已退出编辑模式。"
          );

        },
        0
      );
    }
  }
);



monthSummaryBtn.addEventListener(
  "click",
  async () => {

    const monthValue =
      monthInputEl.value;


    if (!monthValue) {

      monthSummaryResultEl.className =
        "result-card";

      monthSummaryResultEl.textContent =
        "请先选择月份。";

      return;
    }


    try {

      const data =
        await api.getMonthSummary(
          monthValue
        );


      renderMonthSummary(
        data
      );

    } catch (error) {

      monthSummaryResultEl.className =
        "result-card";

      monthSummaryResultEl.textContent =
        `查询失败：${error.message}`;
    }
  }
);



searchExpensesBtn.addEventListener(
  "click",
  loadExpenses
);



clearSearchBtn.addEventListener(
  "click",
  async () => {

    expenseSearchInputEl.value =
      "";

    await loadExpenses();
  }
);



expenseSearchInputEl.addEventListener(
  "keydown",
  async (event) => {

    if (
      event.key === "Enter"
    ) {

      event.preventDefault();

      await loadExpenses();
    }
  }
);



applyFilterBtn.addEventListener(
  "click",
  loadExpenses
);



clearFilterBtn.addEventListener(
  "click",
  async () => {

    categoryFilterEl.value =
      "";

    payerFilterEl.value =
      "";

    await loadExpenses();
  }
);



refreshExpensesBtn.addEventListener(
  "click",
  refreshExpenseArea
);



refreshSummaryBtn.addEventListener(
  "click",
  async () => {

    await loadAllSummaries();

    await refreshSelectedMonthSummary();
  }
);



async function init() {

  await loadHealth();

  await loadFilterOptions();

  await loadExpenses();

  await loadAllSummaries();
}



init();