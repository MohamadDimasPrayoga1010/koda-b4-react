export const apiRequest = async (endpoint, method = "POST", body = null) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}${endpoint}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : null,
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
