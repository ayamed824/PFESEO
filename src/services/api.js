// frontend/src/services/api.js
const API_BASE_URL = "http://localhost:8000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": token ? `Bearer ${token}` : ""
  };
};

export const api = {
  // 🔐 Authentification
  login: async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  register: async (data) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  getProfile: async () => {
    const res = await fetch(`${API_BASE_URL}/users/me`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // 💳 Abonnements (Stripe)
  createSubscription: async (data) => {
    const res = await fetch(`${API_BASE_URL}/subscriptions/create`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  getMySubscription: async () => {
    const res = await fetch(`${API_BASE_URL}/subscriptions/me`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  cancelSubscription: async () => {
    const res = await fetch(`${API_BASE_URL}/subscriptions/cancel`, {
      method: "POST",
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // 📊 Analyse SEO (CdC Section 3)
  launchAnalysis: async (url) => {
    const res = await fetch(`${API_BASE_URL}/analysis/launch`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ url })
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  getAnalysisResults: async (analysisId) => {
    const res = await fetch(`${API_BASE_URL}/analysis/${analysisId}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  getMyAnalyses: async () => {
    const res = await fetch(`${API_BASE_URL}/analysis/`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // 🤖 Agents intelligents (CdC Section 3.6)
  chatWithAgent: async (agentType, message, context = {}) => {
    const res = await fetch(`${API_BASE_URL}/agents/${agentType}/chat`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ message, context })
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
  
}
// 🧠 Helpers SaaS
isAuthenticated: () => {
  return !!localStorage.getItem("token");
}

isSubscribed: async () => {
  try {
    const sub = await api.getMySubscription();
    return sub.status === "active";
  } catch {
    return false;
  }
}

canRunAnalysis: async () => {
  try {
    const sub = await api.getMySubscription();

    if (sub.status !== "active") return false;
    if (sub.analyses_limit === -1) return true;

    return sub.analyses_used < sub.analyses_limit;
  } catch {
    return false;
  }
};