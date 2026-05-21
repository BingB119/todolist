import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    isAuthenticated: !!localStorage.getItem('token')
  }),

  actions: {
    async login(username, password) {
      try {
        const response = await axios.post('/api/auth/login', {
          username,
          password
        });

        this.token = response.data.token;
        this.user = {
          id: response.data.userId,
          username: response.data.username
        };
        this.isAuthenticated = true;

        localStorage.setItem('token', this.token);
        localStorage.setItem('user', JSON.stringify(this.user));

        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;

        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.error || 'Login failed'
        };
      }
    },

    async register(username, password) {
      try {
        const response = await axios.post('/api/auth/register', {
          username,
          password
        });

        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.error || 'Registration failed'
        };
      }
    },

    logout() {
      this.token = '';
      this.user = null;
      this.isAuthenticated = false;

      localStorage.removeItem('token');
      localStorage.removeItem('user');

      delete axios.defaults.headers.common['Authorization'];
    }
  }
});