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
    const response = await fetch("/api/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    return this.handleResponse(response);
  },

  async getMonthSummary(month) {
    const response = await fetch(`/api/summary/month?month=${encodeURIComponent(month)}`);
    return this.handleResponse(response);
  },

  async getCategorySummary() {
    const response = await fetch("/api/summary/category");
    return this.handleResponse(response);
  },

  async getPayerSummary() {
    const response = await fetch("/api/summary/payer");
    return this.handleResponse(response);
  },

  async handleResponse(response) {
    const data = await response.json();

    if (!response.ok) {
      const message = data?.detail || "请求失败";
      throw new Error(message);
    }

    return data;
  }
};