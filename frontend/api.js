const api = {

  async getHealth() {
    const response = await fetch("/api/health");
    return this.handleResponse(response);
  },


  async getExpenses() {
    const response = await fetch("/api/expenses");
    return this.handleResponse(response);
  },


  async createExpense(payload) {

    const response = await fetch(
      "/api/expenses",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(payload)
      }
    );

    return this.handleResponse(response);
  },


  async updateExpense(expenseId, payload) {

    const response = await fetch(
      `/api/expenses/${expenseId}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(payload)
      }
    );

    return this.handleResponse(response);
  },


  async deleteExpense(expenseId) {

    const response = await fetch(
      `/api/expenses/${expenseId}`,
      {
        method: "DELETE"
      }
    );

    return this.handleResponse(response);
  },


  async getMonthSummary(month) {

    const response = await fetch(
      `/api/summary/month?month=${encodeURIComponent(month)}`
    );

    return this.handleResponse(response);
  },


  async getCategorySummary() {

    const response = await fetch(
      "/api/summary/category"
    );

    return this.handleResponse(response);
  },


  async getPayerSummary() {

    const response = await fetch(
      "/api/summary/payer"
    );

    return this.handleResponse(response);
  },


  async handleResponse(response) {

    let data = null;

    try {
      data = await response.json();
    } catch {
      data = {};
    }


    if (!response.ok) {

      let message = "请求失败";


      if (typeof data.detail === "string") {
        message = data.detail;
      }

      else if (Array.isArray(data.detail)) {

        message = data.detail
          .map((error) => error.msg)
          .join("；");
      }


      throw new Error(message);
    }


    return data;
  }

};