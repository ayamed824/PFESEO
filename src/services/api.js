/**
 * PFESEO - API Service Layer
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// ============================================================================
// AUTH HEADERS
// ============================================================================
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  console.log("TOKEN 👉", token); // debug

  return {
    "Content-Type": "application/json",
    "Authorization": token ? `Bearer ${token}` : ""
  };
};

// ============================================================================
// ERROR HANDLER
// ============================================================================
const handleResponseError = async (response) => {
  let errorMessage = "An unexpected error occurred";
  
  try {
    const errorData = await response.text();
    try {
      const json = JSON.parse(errorData);
      errorMessage = json.detail || json.message || errorMessage;
    } catch {
      errorMessage = errorData || errorMessage;
    }
  } catch {
    errorMessage = `HTTP ${response.status}: ${response.statusText}`;
  }
  
  throw new Error(errorMessage);
};

// ============================================================================
// API CLIENT
// ============================================================================
export const api = {

  // 🔐 LOGIN (FIXED ✅)
  login: async (email, password) => {
    const formData = new URLSearchParams();
    formData.append("username", email); // ⚠️ مهم
    formData.append("password", password);

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData
    });

    if (!response.ok) await handleResponseError(response);
    return response.json();
  },
  getMe: async () => {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) await handleResponseError(response);

  return response.json();
},

  // REGISTER
  register: async (data) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!response.ok) await handleResponseError(response);
    return response.json();
  },

  // PROFILE
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) await handleResponseError(response);
    return response.json();
  },

  updateProfile: async (data) => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) await handleResponseError(response);
    return response.json();
  },

  changePassword: async (oldPassword, newPassword) => {
    const response = await fetch(`${API_BASE_URL}/users/change-password`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ old_password: oldPassword, new_password: newPassword })
    });

    if (!response.ok) await handleResponseError(response);
    return response.json();
  },

  // 💳 SUBSCRIPTIONS
  createSubscription: async (data) => {
    const response = await fetch(`${API_BASE_URL}/subscriptions/create`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) await handleResponseError(response);
    return response.json();
  },

  getMySubscription: async () => {
    const response = await fetch(`${API_BASE_URL}/subscriptions/me`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) await handleResponseError(response);
    return response.json();
  },

  cancelSubscription: async () => {
    const response = await fetch(`${API_BASE_URL}/subscriptions/cancel`, {
      method: "POST",
      headers: getAuthHeaders()
    });

    if (!response.ok) await handleResponseError(response);
    return response.json();
  },

  // 📊 ANALYSIS
  launchAnalysis: async (url) => {
    const response = await fetch(`${API_BASE_URL}/analysis/launch`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ url })
    });

    if (!response.ok) await handleResponseError(response);
    return response.json();
  },

  getAnalysisResults: async (analysisId) => {
    const response = await fetch(`${API_BASE_URL}/analysis/${analysisId}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) await handleResponseError(response);
    return response.json();
  },

  getMyAnalyses: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/analysis/${queryParams ? `?${queryParams}` : ""}`;

    const response = await fetch(url, {
      headers: getAuthHeaders()
    });

    if (!response.ok) await handleResponseError(response);
    return response.json();
  },

  deleteAnalysis: async (analysisId) => {
    const response = await fetch(`${API_BASE_URL}/analysis/${analysisId}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });

    if (!response.ok) await handleResponseError(response);
    return response.json();
  },

  // 🤖 AI AGENTS
  chatWithAgent: async (agentType, message, context = {}) => {
    const response = await fetch(`${API_BASE_URL}/agents/${agentType}/chat`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ message, context })
    });

    if (!response.ok) await handleResponseError(response);
    return response.json();
  },

  getAgentTypes: async () => {
    const response = await fetch(`${API_BASE_URL}/agents/types`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) await handleResponseError(response);
    return response.json();
  },

  // 🧠 HELPERS
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("subscription");
  },

  getBaseUrl: () => API_BASE_URL,
};

export default api;