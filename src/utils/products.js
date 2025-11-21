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
    if (!id) {
      throw new Error('Product ID is required');
    }
  
    const productId = typeof id === 'string' ? parseInt(id, 10) : id;
    
    if (isNaN(productId)) {
      throw new Error('Invalid product ID format');
    }
    const data = await apiClient(`/products/${productId}`, {
      method: 'GET',
    });
    
    console.log('API Response:', data);
    
    return data;
    
  } catch (error) {
    console.error('Error fetching product detail:', error);
    
    return {
      success: false,
      message: error.message || 'Failed to fetch product',
      data: null
    };
  }
};

