/* ===================================== */
/* 获取页面元素 */
/* ===================================== */


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



const sortByEl =
  document.getElementById(
    "sort-by"
  );



const sortOrderEl =
  document.getElementById(
    "sort-order"
  );



const applySortBtn =
  document.getElementById(
    "apply-sort-btn"
  );



const clearSortBtn =
  document.getElementById(
    "clear-sort-btn"
  );



const pageSizeEl =
  document.getElementById(
    "page-size"
  );



const paginationInfoEl =
  document.getElementById(
    "pagination-info"
  );



const previousPageBtn =
  document.getElementById(
    "previous-page-btn"
  );



const nextPageBtn =
  document.getElementById(
    "next-page-btn"
  );



/* ===================================== */
/* Budget 页面元素 */
/* ===================================== */


const budgetMonthEl =
  document.getElementById(
    "budget-month"
  );



const budgetAmountInputEl =
  document.getElementById(
    "budget-amount-input"
  );



const saveBudgetBtn =
  document.getElementById(
    "save-budget-btn"
  );



const refreshBudgetBtn =
  document.getElementById(
    "refresh-budget-btn"
  );



const budgetMessageEl =
  document.getElementById(
    "budget-message"
  );



const budgetStatusBadgeEl =
  document.getElementById(
    "budget-status-badge"
  );



const budgetTotalValueEl =
  document.getElementById(
    "budget-total-value"
  );



const budgetSpentValueEl =
  document.getElementById(
    "budget-spent-value"
  );



const budgetRemainingValueEl =
  document.getElementById(
    "budget-remaining-value"
  );



const budgetProgressBarEl =
  document.getElementById(
    "budget-progress-bar"
  );



const budgetProgressTextEl =
  document.getElementById(
    "budget-progress-text"
  );



const budgetHintEl =
  document.getElementById(
    "budget-hint"
  );



/* ===================================== */
/* 页面状态 */
/* ===================================== */


let currentExpenses =
  [];



let editingExpenseId =
  null;



let currentPage =
  1;



/* ===================================== */
/* 通用工具函数 */
/* ===================================== */


function escapeHtml(value) {

  const text =
    String(
      value ?? ""
    );


  return text

    .replaceAll(
      "&",
      "&amp;"
    )

    .replaceAll(
      "<",
      "&lt;"
    )

    .replaceAll(
      ">",
      "&gt;"
    )

    .replaceAll(
      '"',
      "&quot;"
    )

    .replaceAll(
      "'",
      "&#039;"
    );

}



/*
  显示支出表单下面的提示。
*/

function showMessage(

  message,

  type = ""

) {

  formMessageEl.textContent =
    message;


  formMessageEl.className =

    `message ${type}`.trim();

}



/*
  显示预算区域的提示。
*/

function showBudgetMessage(

  message,

  type = ""

) {

  budgetMessageEl.textContent =
    message;


  budgetMessageEl.className =

    `message ${type}`.trim();

}



/*
  金额格式。
*/

function formatAmount(value) {

  return `¥ ${Number(value).toFixed(2)}`;

}



/*
  获得当前月份。

  例如：

  2026-08
*/

function getCurrentMonthValue() {

  const now =
    new Date();


  const year =
    now.getFullYear();


  const month =
    String(

      now.getMonth() + 1

    ).padStart(
      2,
      "0"
    );


  return `${year}-${month}`;

}



/* ===================================== */
/* Health */
/* ===================================== */


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



/* ===================================== */
/* 支出列表 */
/* ===================================== */


function renderExpenses(

  expenses,

  total

) {

  currentExpenses =
    expenses;



  expenseCountEl.textContent =

    `本页 ${expenses.length} 条 / 共 ${total} 条`;



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

      .map(

        (expense) => {

          return `

            <tr>


              <td>

                ${escapeHtml(
                  expense.id
                )}

              </td>


              <td>

                ${escapeHtml(
                  expense.date
                )}

              </td>


              <td>

                ${escapeHtml(
                  expense.item
                )}

              </td>


              <td>

                ${formatAmount(
                  expense.amount
                )}

              </td>


              <td>

                ${escapeHtml(
                  expense.category
                )}

              </td>


              <td>

                ${escapeHtml(
                  expense.payer
                )}

              </td>


              <td>

                ${escapeHtml(
                  expense.note
                )}

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

        }

      )

      .join("");

}



/* ===================================== */
/* 分页 */
/* ===================================== */


function renderPagination(data) {

  if (data.total === 0) {

    paginationInfoEl.textContent =
      "暂无记录";


    previousPageBtn.disabled =
      true;


    nextPageBtn.disabled =
      true;


    return;

  }



  paginationInfoEl.textContent =

    `第 ${data.page} / ${data.totalPages} 页，共 ${data.total} 条`;



  previousPageBtn.disabled =

    data.page <= 1;



  nextPageBtn.disabled =

    data.page >=
    data.totalPages;

}



/* ===================================== */
/* 月份统计 */
/* ===================================== */


function renderMonthSummary(data) {

  monthSummaryResultEl.className =
    "result-card";


  monthSummaryResultEl.innerHTML = `

    <p>

      <strong>
        月份：
      </strong>

      ${escapeHtml(
        data.month
      )}

    </p>


    <p>

      <strong>
        总支出：
      </strong>

      ${formatAmount(
        data.total
      )}

    </p>


    <p>

      <strong>
        记录数量：
      </strong>

      ${data.count} 笔

    </p>

  `;

}



/* ===================================== */
/* 分类 / 付款人统计 */
/* ===================================== */


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

                ${escapeHtml(
                  name
                )}

              </span>


              <span class="summary-value">

                ${formatAmount(
                  value
                )}

              </span>


            </div>

          `;

        }

      )

      .join("");

}



/* ===================================== */
/* 筛选下拉菜单 */
/* ===================================== */


function populateSelect(

  selectElement,

  values,

  emptyText

) {

  const currentValue =
    selectElement.value;



  const options = [

    `<option value="">${emptyText}</option>`,

    ...values.map(

      (value) =>

        `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`

    )

  ];



  selectElement.innerHTML =

    options.join("");



  if (

    values.includes(
      currentValue
    )

  ) {

    selectElement.value =
      currentValue;

  }

}



/* ===================================== */
/* Budget 渲染 */
/* ===================================== */


function setBudgetStatus(

  text,

  type = "neutral"

) {

  budgetStatusBadgeEl.textContent =
    text;


  budgetStatusBadgeEl.className =

    `budget-status-badge ${type}`;

}



/*
  把预算面板恢复到空状态。
*/

function resetBudgetDashboard(

  hint =
    "这个月份还没有设置预算。"

) {

  budgetTotalValueEl.textContent =
    "¥ --";


  budgetSpentValueEl.textContent =
    "¥ --";


  budgetRemainingValueEl.textContent =
    "¥ --";


  budgetRemainingValueEl
    .classList
    .remove(
      "over-budget"
    );


  budgetProgressBarEl.style.width =
    "0%";


  budgetProgressBarEl.className =
    "budget-progress-bar";


  budgetProgressTextEl.textContent =
    "--%";


  budgetHintEl.textContent =
    hint;

}



/*
  显示预算统计。

  后端返回：

  {
      month,
      budget,
      spent,
      remaining
  }
*/

function renderBudgetSummary(data) {

  const budget =
    Number(
      data.budget
    );


  const spent =
    Number(
      data.spent
    );


  const remaining =
    Number(
      data.remaining
    );



  const percentage =

    budget > 0

      ?

      (
        spent /
        budget
      ) * 100

      :

      0;



  /*
    进度条视觉上最多显示到 100%。

    如果已经花了预算的 130%，
    文字仍然显示 130%，
    但是进度条不让它冲出去。
  */

  const progressWidth =

    Math.min(

      Math.max(
        percentage,
        0
      ),

      100

    );



  budgetTotalValueEl.textContent =

    formatAmount(
      budget
    );



  budgetSpentValueEl.textContent =

    formatAmount(
      spent
    );



  budgetRemainingValueEl.textContent =

    formatAmount(
      remaining
    );



  /*
    查询成功后，
    自动把预算金额填回左边输入框。

    用户可以直接修改。
  */

  budgetAmountInputEl.value =

    budget.toFixed(2);



  budgetProgressBarEl.style.width =

    `${progressWidth}%`;



  budgetProgressTextEl.textContent =

    `${percentage.toFixed(1)}%`;



  /*
    清除上一次的状态。
  */

  budgetProgressBarEl.className =
    "budget-progress-bar";


  budgetRemainingValueEl
    .classList
    .remove(
      "over-budget"
    );



  /* ================================= */
  /* 已经超预算 */
  /* ================================= */

  if (percentage >= 100) {

    budgetProgressBarEl
      .classList
      .add(
        "danger"
      );


    budgetRemainingValueEl
      .classList
      .add(
        "over-budget"
      );


    setBudgetStatus(

      "已超预算",

      "danger"

    );


    budgetHintEl.textContent =

      `已经超出预算 ${formatAmount(Math.abs(remaining))}，需要控制一下本月支出啦。`;


    return;

  }



  /* ================================= */
  /* 使用超过 80% */
  /* ================================= */

  if (percentage >= 80) {

    budgetProgressBarEl
      .classList
      .add(
        "warning"
      );


    setBudgetStatus(

      "接近上限",

      "warning"

    );


    budgetHintEl.textContent =

      `预算已经使用 ${percentage.toFixed(1)}%，还剩 ${formatAmount(remaining)}。`;


    return;

  }



  /* ================================= */
  /* 正常 */
  /* ================================= */

  setBudgetStatus(

    "预算正常",

    "ok"

  );


  budgetHintEl.textContent =

    `当前已经使用 ${percentage.toFixed(1)}%，还剩 ${formatAmount(remaining)}。`;

}



/* ===================================== */
/* Expense 表单 */
/* ===================================== */


function getFormPayload() {

  return {

    date:

      document

        .getElementById(
          "date"
        )

        .value,


    item:

      document

        .getElementById(
          "item"
        )

        .value,


    amount:

      Number(

        document

          .getElementById(
            "amount"
          )

          .value

      ),


    category:

      document

        .getElementById(
          "category"
        )

        .value,


    payer:

      document

        .getElementById(
          "payer"
        )

        .value,


    note:

      document

        .getElementById(
          "note"
        )

        .value

  };

}



/* ===================================== */
/* 编辑模式 */
/* ===================================== */


function enterEditMode(expense) {

  editingExpenseId =
    expense.id;



  document

    .getElementById(
      "date"
    )

    .value =
    expense.date;



  document

    .getElementById(
      "item"
    )

    .value =
    expense.item;



  document

    .getElementById(
      "amount"
    )

    .value =
    expense.amount;



  document

    .getElementById(
      "category"
    )

    .value =
    expense.category;



  document

    .getElementById(
      "payer"
    )

    .value =
    expense.payer;



  document

    .getElementById(
      "note"
    )

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

    behavior:
      "smooth",

    block:
      "start"

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



/* ===================================== */
/* 加载 Health */
/* ===================================== */


async function loadHealth() {

  try {

    const data =

      await api.getHealth();



    renderHealth(

      data.status

    );

  }


  catch (error) {

    renderHealthError(

      error.message

    );

  }

}



/* ===================================== */
/* 加载筛选选项 */
/* ===================================== */


async function loadFilterOptions() {

  try {

    const [

      categoryData,

      payerData

    ] =

      await Promise.all([

        api.getCategorySummary(),

        api.getPayerSummary()

      ]);



    const categories =

      Object.keys(

        categoryData.category_totals

        || {}

      )

      .sort();



    const payers =

      Object.keys(

        payerData.payer_totals

        || {}

      )

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

  }


  catch (error) {

    console.error(

      "加载筛选选项失败：",

      error

    );

  }

}



/* ===================================== */
/* 加载支出 */
/* ===================================== */


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



    const sortBy =
      sortByEl.value;



    const sortOrder =
      sortOrderEl.value;



    const pageSize =

      Number(

        pageSizeEl.value

      );



    const data =

      await api.getExpenses(

        keyword,

        category,

        payer,

        sortBy,

        sortOrder,

        currentPage,

        pageSize

      );



    /*
      如果删除数据后，
      当前页已经超过总页数，
      自动回到最后一页。
    */

    if (

      data.totalPages > 0

      &&

      currentPage >
      data.totalPages

    ) {

      currentPage =
        data.totalPages;


      await loadExpenses();


      return;

    }



    if (data.total === 0) {

      currentPage =
        1;

    }



    renderExpenses(

      data.items,

      data.total

    );



    renderPagination(
      data
    );

  }


  catch (error) {

    expenseTableBodyEl.innerHTML = `

      <tr>

        <td
          colspan="8"
          class="empty-cell"
        >

          加载失败：

          ${escapeHtml(
            error.message
          )}

        </td>

      </tr>

    `;



    expenseCountEl.textContent =
      "加载失败";



    paginationInfoEl.textContent =
      "分页加载失败";



    previousPageBtn.disabled =
      true;



    nextPageBtn.disabled =
      true;

  }

}



/*
  搜索、筛选、排序改变后，
  应该回到第一页。
*/

async function resetPageAndLoadExpenses() {

  currentPage =
    1;


  await loadExpenses();

}



/*
  刷新支出区域。
*/

async function refreshExpenseArea() {

  await loadFilterOptions();


  await loadExpenses();

}



/* ===================================== */
/* 分类统计 */
/* ===================================== */


async function loadCategorySummary() {

  try {

    const data =

      await api.getCategorySummary();



    renderSummaryList(

      categorySummaryEl,

      data.category_totals,

      "暂无分类统计数据"

    );

  }


  catch (error) {

    categorySummaryEl.className =
      "summary-list empty-state";


    categorySummaryEl.textContent =

      `加载失败：${error.message}`;

  }

}



/* ===================================== */
/* 付款人统计 */
/* ===================================== */


async function loadPayerSummary() {

  try {

    const data =

      await api.getPayerSummary();



    renderSummaryList(

      payerSummaryEl,

      data.payer_totals,

      "暂无付款人统计数据"

    );

  }


  catch (error) {

    payerSummaryEl.className =
      "summary-list empty-state";


    payerSummaryEl.textContent =

      `加载失败：${error.message}`;

  }

}



/*
  同时刷新分类和付款人统计。
*/

async function loadAllSummaries() {

  await Promise.all([

    loadCategorySummary(),

    loadPayerSummary()

  ]);

}



/* ===================================== */
/* 月份统计 */
/* ===================================== */


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

  }


  catch (error) {

    monthSummaryResultEl.className =
      "result-card";


    monthSummaryResultEl.textContent =

      `查询失败：${error.message}`;

  }

}



/* ===================================== */
/* Budget */
/* ===================================== */


/*
  查询某个月的预算统计。
*/

async function loadBudgetSummary() {

  const month =
    budgetMonthEl.value;



  if (!month) {

    setBudgetStatus(
      "未选择月份"
    );


    resetBudgetDashboard(
      "请先选择一个月份。"
    );


    return;

  }



  try {

    const data =

      await api.getBudgetSummary(
        month
      );



    renderBudgetSummary(
      data
    );


    showBudgetMessage(
      ""
    );

  }


  catch (error) {

    /*
      404 不算系统错误。

      只是说明这个月份还没有预算。
    */

    if (error.status === 404) {

      setBudgetStatus(

        "未设置",

        "neutral"

      );


      resetBudgetDashboard(

        `${month} 还没有设置预算，可以在左侧输入金额后保存。`

      );


      budgetAmountInputEl.value =
        "";


      showBudgetMessage(
        ""
      );


      return;

    }



    setBudgetStatus(

      "加载失败",

      "danger"

    );


    resetBudgetDashboard(

      "预算数据加载失败。"

    );


    showBudgetMessage(

      `查询失败：${error.message}`,

      "error"

    );

  }

}



/*
  创建或者修改预算。
*/

async function saveBudget() {

  const month =
    budgetMonthEl.value;



  const amount =

    Number(

      budgetAmountInputEl.value

    );



  /* 检查月份 */

  if (!month) {

    showBudgetMessage(

      "请先选择预算月份。",

      "error"

    );


    return;

  }



  /* 检查预算金额 */

  if (

    !Number.isFinite(amount)

    ||

    amount <= 0

  ) {

    showBudgetMessage(

      "预算金额必须大于 0。",

      "error"

    );


    return;

  }



  saveBudgetBtn.disabled =
    true;



  saveBudgetBtn.textContent =
    "保存中...";



  try {

    /*
      先查询这个月份是否已经有预算。

      有：
      PUT 修改。

      没有：
      POST 创建。
    */

    let existed =
      true;



    try {

      await api.getBudget(
        month
      );

    }


    catch (error) {

      if (error.status === 404) {

        existed =
          false;

      }

      else {

        throw error;

      }

    }



    /* ================================= */
    /* 修改预算 */
    /* ================================= */

    if (existed) {

      await api.updateBudget(

        month,

        {

          amount

        }

      );



      showBudgetMessage(

        `${month} 的预算已经修改为 ${formatAmount(amount)}。`,

        "success"

      );

    }



    /* ================================= */
    /* 新建预算 */
    /* ================================= */

    else {

      await api.createBudget(

        {

          month,

          amount

        }

      );



      showBudgetMessage(

        `${month} 的预算已经创建：${formatAmount(amount)}。`,

        "success"

      );

    }



    /*
      保存之后重新加载预算统计。
    */

    await loadBudgetSummary();

  }


  catch (error) {

    showBudgetMessage(

      `保存失败：${error.message}`,

      "error"

    );

  }


  finally {

    saveBudgetBtn.disabled =
      false;


    saveBudgetBtn.textContent =
      "保存 / 修改预算";

  }

}



/* ===================================== */
/* 刷新所有数据 */
/* ===================================== */


async function refreshAllData() {

  await refreshExpenseArea();


  await loadAllSummaries();


  await refreshSelectedMonthSummary();


  /*
    支出发生变化之后，

    本月 spent 和 remaining
    也可能发生变化。

    所以预算统计也要重新刷新。
  */

  await loadBudgetSummary();

}



/* ===================================== */
/* 添加 / 修改支出 */
/* ===================================== */


expenseFormEl.addEventListener(

  "submit",

  async (event) => {

    event.preventDefault();



    const payload =
      getFormPayload();



    try {

      /* =============================== */
      /* 添加模式 */
      /* =============================== */

      if (

        editingExpenseId ===
        null

      ) {

        await api.createExpense(
          payload
        );



        showMessage(

          "添加成功，已经保存到 SQLite 数据库。",

          "success"

        );



        expenseFormEl.reset();

      }



      /* =============================== */
      /* 编辑模式 */
      /* =============================== */

      else {

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



      currentPage =
        1;



      await refreshAllData();

    }


    catch (error) {

      showMessage(

        `保存失败：${error.message}`,

        "error"

      );

    }

  }

);



/* ===================================== */
/* 支出表格编辑 / 删除 */
/* ===================================== */


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



    /* =============================== */
    /* 编辑 */
    /* =============================== */

    if (editButton) {

      const expenseId =

        Number(

          editButton.dataset.expenseId

        );



      const expense =

        currentExpenses.find(

          (item) =>

            item.id ===
            expenseId

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



    /* =============================== */
    /* 删除 */
    /* =============================== */

    if (deleteButton) {

      const expenseId =

        Number(

          deleteButton.dataset.expenseId

        );



      const expense =

        currentExpenses.find(

          (item) =>

            item.id ===
            expenseId

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



        /*
          如果正在编辑的，
          正好就是被删除的这一条，
          自动退出编辑模式。
        */

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

      }


      catch (error) {

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



/* ===================================== */
/* 取消编辑 */
/* ===================================== */


cancelEditBtn.addEventListener(

  "click",

  () => {

    leaveEditMode();



    showMessage(

      "已取消编辑。"

    );

  }

);



/* ===================================== */
/* 清空表单 */
/* ===================================== */


expenseFormEl.addEventListener(

  "reset",

  () => {

    if (

      editingExpenseId !==
      null

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



/* ===================================== */
/* 月份统计按钮 */
/* ===================================== */


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

    }


    catch (error) {

      monthSummaryResultEl.className =
        "result-card";


      monthSummaryResultEl.textContent =

        `查询失败：${error.message}`;

    }

  }

);



/* ===================================== */
/* 搜索 */
/* ===================================== */


searchExpensesBtn.addEventListener(

  "click",

  resetPageAndLoadExpenses

);



clearSearchBtn.addEventListener(

  "click",

  async () => {

    expenseSearchInputEl.value =
      "";


    await resetPageAndLoadExpenses();

  }

);



/*
  搜索框按回车也可以搜索。
*/

expenseSearchInputEl.addEventListener(

  "keydown",

  async (event) => {

    if (

      event.key ===
      "Enter"

    ) {

      event.preventDefault();


      await resetPageAndLoadExpenses();

    }

  }

);



/* ===================================== */
/* 筛选 */
/* ===================================== */


applyFilterBtn.addEventListener(

  "click",

  resetPageAndLoadExpenses

);



clearFilterBtn.addEventListener(

  "click",

  async () => {

    categoryFilterEl.value =
      "";


    payerFilterEl.value =
      "";


    await resetPageAndLoadExpenses();

  }

);



/* ===================================== */
/* 排序 */
/* ===================================== */


applySortBtn.addEventListener(

  "click",

  resetPageAndLoadExpenses

);



clearSortBtn.addEventListener(

  "click",

  async () => {

    sortByEl.value =
      "date";


    sortOrderEl.value =
      "desc";


    await resetPageAndLoadExpenses();

  }

);



/* ===================================== */
/* 分页 */
/* ===================================== */


pageSizeEl.addEventListener(

  "change",

  resetPageAndLoadExpenses

);



previousPageBtn.addEventListener(

  "click",

  async () => {

    if (currentPage <= 1) {

      return;

    }



    currentPage -=
      1;


    await loadExpenses();

  }

);



nextPageBtn.addEventListener(

  "click",

  async () => {

    if (

      nextPageBtn.disabled

    ) {

      return;

    }



    currentPage +=
      1;


    await loadExpenses();

  }

);



/* ===================================== */
/* 快捷刷新 */
/* ===================================== */


refreshExpensesBtn.addEventListener(

  "click",

  refreshExpenseArea

);



refreshSummaryBtn.addEventListener(

  "click",

  async () => {

    await loadAllSummaries();


    await refreshSelectedMonthSummary();


    await loadBudgetSummary();

  }

);



/* ===================================== */
/* Budget 按钮 */
/* ===================================== */


/*
  保存 / 修改预算。
*/

saveBudgetBtn.addEventListener(

  "click",

  saveBudget

);



/*
  手动重新查询预算。
*/

refreshBudgetBtn.addEventListener(

  "click",

  loadBudgetSummary

);



/*
  用户切换月份以后，
  自动查询这个月的预算。
*/

budgetMonthEl.addEventListener(

  "change",

  async () => {

    await loadBudgetSummary();

  }

);



/* ===================================== */
/* 初始化 */
/* ===================================== */


async function init() {

  /*
    页面打开时，
    自动选择当前月份。
  */

  const currentMonth =
    getCurrentMonthValue();



  budgetMonthEl.value =
    currentMonth;



  monthInputEl.value =
    currentMonth;



  /*
    加载后端状态。
  */

  await loadHealth();



  /*
    加载分类 / 付款人筛选。
  */

  await loadFilterOptions();



  /*
    加载支出列表。
  */

  await loadExpenses();



  /*
    加载统计。
  */

  await loadAllSummaries();



  /*
    加载当前月份统计。
  */

  await refreshSelectedMonthSummary();



  /*
    加载当前月份预算。
  */

  await loadBudgetSummary();

}



/*
  页面启动。
*/

init();