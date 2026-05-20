/**
 * PFESEO - API Service Layer
 * Clean, organized, production-ready version
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// ============================================================================
// AUTH HEADERS
// ============================================================================
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": token ? `Bearer ${token}` : ""
  };
};

const clearAuthState = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userName");
  localStorage.removeItem("subscription");
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
  
  if (response.status === 401) {
    clearAuthState();
    throw new Error("Session expired. Please login again.");
  }

  throw new Error(errorMessage);
};

// ============================================================================
// API CLIENT
// ============================================================================
export const api = {

  // 🔐 AUTHENTICATION
  // ============================================================================
  
    login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json"  // ✅ JSON, pas form-data
      },
      body: JSON.stringify({ 
        email,      // ✅ "email", pas "username"
        password 
      })
    });

    if (!response.ok) await handleResponseError(response);
    const data = await response.json();
    
    // Sauvegarde automatique du token
    localStorage.setItem("token", data.access_token);
    
    return data;
  },

  register: async (data) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
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

  isAuthenticated: () => !!localStorage.getItem("token"),

  logout: () => {
    clearAuthState();
  },

  // 👤 USER PROFILE
  // ============================================================================
  
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
  // ============================================================================
  
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

  // 📊 SEO ANALYSIS
  // ============================================================================
  
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
    const url = `${API_BASE_URL}/analysis${queryParams ? `?${queryParams}` : ""}`;

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
  // ============================================================================
  
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

  // 📤 EXPORT MODULE
  // ============================================================================
  
  /**
   * ✅ NOUVEAU: Export avec données brutes du frontend
   * Utilisé par les pages individuelles (Technical, Content, UX, Popularity)
   */
  exportReportWithData: async (rawData, options = {}) => {
    const {
      format = "pdf",
      section = "full",
      includeReco = true,
      includeCharts = true,
      url = "",
    } = options;

    const response = await fetch(`${API_BASE_URL}/export/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        raw_data: rawData,        // ✅ Données brutes du frontend
        url: url,
        format,
        section,
        include_reco: includeReco,
        include_charts: includeCharts,
        use_cache: false,         // Pas de cache car données dynamiques
      })
    });

    if (!response.ok) await handleResponseError(response);
    return response.blob();
  },

  /**
   * Ancienne méthode (sans données) - gardée pour compatibilité
   */
  exportReport: async (url, options = {}) => {
    const {
      format = "pdf",
      section = "full",
      includeReco = true,
      includeCharts = true,
      useCache = true,
      lang ="fr"
    } = options;

    const response = await fetch(`${API_BASE_URL}/export/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        url,
        format,
        section,
        lang,
        include_reco: includeReco,
        include_charts: includeCharts,
        use_cache: useCache
      })
    });

    if (!response.ok) await handleResponseError(response);
    return response.blob();
  },

  getExportPreview: async (url, section = "full", includeReco = true) => {
    const response = await fetch(`${API_BASE_URL}/export/preview`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ url, section, include_reco: includeReco })
    });

    if (!response.ok) await handleResponseError(response);
    return response.json();
  },

  getCachedReports: async () => {
    const response = await fetch(`${API_BASE_URL}/export/cache`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) await handleResponseError(response);
    return response.json();
  },

  invalidateCachedReport: async (reportKey) => {
    const response = await fetch(`${API_BASE_URL}/export/cache/${reportKey}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });

    if (!response.ok) await handleResponseError(response);
    return response.json();
  },

  getExportAnalytics: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/admin/analytics/exports${queryParams ? `?${queryParams}` : ""}`;
    
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });

    if (!response.ok) await handleResponseError(response);
    return response.json();
  },

  // 🔄 WEBSOCKET HELPERS FOR EXPORT PROGRESS
  // ============================================================================
  
  createExportWebSocket: (userId, onProgress, onComplete, onError) => {
    const ws = new WebSocket(`ws://localhost:8000/ws/export/${userId}`);
    
    ws.onopen = () => console.log("✅ Export WebSocket connected");
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.progress === 100) {
        onProgress?.(data.progress, data.message);
        setTimeout(() => onComplete?.(data), 300);
        ws.close();
      } else {
        onProgress?.(data.progress, data.message, data);
      }
    };
    
    ws.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
      onError?.("Connection error. Please try again.");
    };
    
    ws.onclose = () => console.log("🔌 Export WebSocket closed");
    
    return ws;
  },

  downloadFile: (blob, filename) => {
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(downloadUrl);
  },

  exportWithProgress: async (url, options = {}, userId, onProgress) => {
    return new Promise((resolve, reject) => {
      let ws = null;
      
      if (userId) {
        const taskId = `task_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        
        ws = api.createExportWebSocket(
          userId,
          (progress, message, data) => onProgress?.({ progress, message, data }),
          () => {
            api.exportReport(url, options)
              .then(blob => {
                const filename = `seo-report-${options.section || "full"}-${new Date().toISOString().slice(0,10)}.${options.format || "pdf"}`;
                api.downloadFile(blob, filename);
                resolve({ success: true, filename });
              })
              .catch(reject);
          },
          reject
        );
      } else {
        api.exportReport(url, options)
          .then(blob => {
            const filename = `seo-report-${options.section || "full"}-${new Date().toISOString().slice(0,10)}.${options.format || "pdf"}`
            api.downloadFile(blob, filename);
            resolve({ success: true, filename });
          })
          .catch(reject);
      }
      
      return () => ws?.close();
    });
  },

  // 🧠 ADMIN HELPERS
  // ============================================================================
  
  getAdminActivity: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/activity`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) await handleResponseError(response);
    return response.json();
  },

  getAdminPrompts: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/prompts`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) await handleResponseError(response);
    return response.json();
  },

  updateAdminPrompt: async (key, data) => {
    const response = await fetch(`${API_BASE_URL}/admin/prompts/${key}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) await handleResponseError(response);
    return response.json();
  },

  // 🔧 UTILITIES
  // ============================================================================
  
  getBaseUrl: () => API_BASE_URL,
};

export default api;