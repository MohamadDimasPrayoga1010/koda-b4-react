import { apiClient } from "./apiBackend";


export const getFavoriteProducts = async (limit = 10) => {
  try {
    const data = await apiClient(`/favorite-products?limit=${limit}`, {
      method: "GET",
    });

    return data;
  } catch (error) {
    console.error("Error fetching favorite products:", error);
    return { success: false, message: "Failed to fetch favorite products", data: [] };
  }
};


export const fetchDetailProduct = async (id) => {
  try {
    // Debug logs
    console.log('🔍 fetchDetailProduct called with ID:', id);
    console.log('🔍 ID type:', typeof id);
    
    if (!id) {
      throw new Error('Product ID is required');
    }
    
    // Pastikan id adalah number
    const productId = typeof id === 'string' ? parseInt(id, 10) : id;
    
    if (isNaN(productId)) {
      throw new Error('Invalid product ID format');
    }
    
    console.log('🚀 Calling API: /products/' + productId);

    // apiClient Anda sudah return data langsung (bukan response.data seperti axios)
    const data = await apiClient(`/products/${productId}`, {
      method: 'GET',
    });
    
    console.log('✅ API Response:', data);
    
    // data sudah berupa: { success: true, message: "...", data: {...} }
    return data;
    
  } catch (error) {
    console.error('Error fetching product detail:', error);
    
    // Return format yang konsisten untuk error handling
    return {
      success: false,
      message: error.message || 'Failed to fetch product',
      data: null
    };
  }
};

