import axios from 'axios';

const API_BASE = 'http://127.0.0.1:5000/api';

export const bookService = {
  getBooks: async (query, maxResults) => {
    return axios.get(`${API_BASE}/books`, {
      params: { query, maxResults }
    });
  },

  getBookDetails: async (bookId) => {
    return axios.get(`${API_BASE}/books/${bookId}`);
  }
};