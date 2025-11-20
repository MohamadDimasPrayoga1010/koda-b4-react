export const apiRequest = async (endpoint, method = "GET", body = null, token = null, isFormData = false) => {
  try {
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    if (!isFormData) headers["Content-Type"] = "application/json";

    const res = await fetch(`${import.meta.env.VITE_BASE_URL}${endpoint}`, {
      method,
      headers,
      body: isFormData ? body : body ? JSON.stringify(body) : null,
    });

    const data = await res.json();

    if (!res.ok) {
      return { 
        success: false, 
        message: data.message || "Request failed", 
        status: res.status 
      };
    }

    return data;
  } catch (error) {
    console.error("API request error:", error);
    return { success: false, message: "Network error" };
  }
};
