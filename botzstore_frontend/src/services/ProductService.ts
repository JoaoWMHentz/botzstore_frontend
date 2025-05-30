import axios from 'axios';

const API_URL = 'https://api.example.com/products'; // Replace with your actual API URL

export const fetchProductById = async (productId: string) => {
  try {
    const response = await axios.get(`${API_URL}/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};