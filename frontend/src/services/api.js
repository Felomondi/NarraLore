import axios from 'axios';

// ✅ Replace this with your actual Cloud Run URL
const API_BASE = 'https://books-api-3m5q7pqkgq-uc.a.run.app';

export const bookService = {
  getBooks: async (query, maxResults = 10) => {
    try {
      const response = await axios.get(`${API_BASE}/books`, {
        params: { query, maxResults }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching books:", error);
      return [];
    }
  },

  getBookDetails: async (bookId) => {
    try {
      const response = await axios.get(`${API_BASE}/books/${bookId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching book details:", error);
      return null;
    }
  }
};