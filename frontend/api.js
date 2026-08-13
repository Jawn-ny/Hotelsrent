const api = {

  async getHealth() {
    const response =
      await fetch("/api/health");

    return this.handleResponse(response);
  },


  async getExpenses(
    keyword = "",
    category = "",
    payer = "",
    sortBy = "date",
    sortOrder = "desc"
  ) {

    const params =
      new URLSearchParams();


    const cleanedKeyword =
      keyword.trim();

    const cleanedCategory =
      category.trim();

    const cleanedPayer =
      payer.trim();


    if (cleanedKeyword) {
      params.set(
        "keyword",
        cleanedKeyword
      );
    }


    if (cleanedCategory) {
      params.set(
        "category",
        cleanedCategory
      );
    }


    if (cleanedPayer) {
      params.set(
        "payer",
        cleanedPayer
      );
    }


    params.set(
      "sort_by",
      sortBy
    );

    params.set(
      "sort_order",
      sortOrder
    );


    const response =
      await fetch(
        `/api/expenses?${params.toString()}`
      );


    return this.handleResponse(
      response
    );
  },


  async createExpense(payload) {

    const response =
      await fetch(
        "/api/expenses",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify(payload)
        }
      );

    return this.handleResponse(
      response
    );
  },


  async updateExpense(
    expenseId,
    payload
  ) {

    const response =
      await fetch(
        `/api/expenses/${expenseId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify(payload)
        }
      );

    return this.handleResponse(
      response
    );
  },


  async deleteExpense(expenseId) {

    const response =
      await fetch(
        `/api/expenses/${expenseId}`,
        {
          method: "DELETE"
        }
      );

    return this.handleResponse(
      response
    );
  },


  async getMonthSummary(month) {

    const response =
      await fetch(
        `/api/summary/month?month=${encodeURIComponent(month)}`
      );

    return this.handleResponse(
      response
    );
  },


  async getCategorySummary() {

    const response =
      await fetch(
        "/api/summary/category"
      );

    return this.handleResponse(
      response
    );
  },


  async getPayerSummary() {

    const response =
      await fetch(
        "/api/summary/payer"
      );

    return this.handleResponse(
      response
    );
  },


  async handleResponse(response) {

    let data = null;


    try {
      data =
        await response.json();
    } catch {
      data = {};
    }


    if (!response.ok) {

      let message =
        "请求失败";


      if (
        typeof data.detail ===
        "string"
      ) {
        message =
          data.detail;
      }

      else if (
        Array.isArray(data.detail)
      ) {
        message =
          data.detail
            .map(
              (error) =>
                error.msg
            )
            .join("；");
      }


      throw new Error(
        message
      );
    }


    return data;
  }

};