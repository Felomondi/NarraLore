import axios from 'axios';

// ✅ Use the new Cloud Run URL
const API_BASE = 'https://books-api-153884035338.us-central1.run.app/api';

export const bookService = {
  getBooks: async (query, maxResults = 10) => {
    try {
      const response = await axios.get(`${API_BASE}/books`, {
        params: { query, maxResults }
      });
      console.log("✅ API Response:", response.data);  // 🔥 Debugging log
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching books:", error);
      return [];
    }
  },

  getBookDetails: async (bookId) => {
    try {
      const response = await axios.get(`${API_BASE}/books/${bookId}`);
      console.log("✅ Book Details:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching book details:", error);
      return null;
    }
  }
};