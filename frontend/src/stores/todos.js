import { defineStore } from 'pinia';
import axios from 'axios';

export const useTodoStore = defineStore('todos', {
  state: () => ({
    todos: [],
    loading: false,
    error: null
  }),

  getters: {
    completedTodos: (state) => state.todos.filter(todo => todo.completed),
    pendingTodos: (state) => state.todos.filter(todo => !todo.completed),
    totalTodos: (state) => state.todos.length
  },

  actions: {
    async fetchTodos() {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get('/api/todos');
        this.todos = response.data;
        return { success: true };
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to fetch todos';
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    async addTodo(todoData) {
      try {
        const response = await axios.post('/api/todos', todoData);
        this.todos.unshift(response.data);
        return { success: true };
      } catch (error) {
        const errorMessage = error.response?.data?.error || 'Failed to add todo';
        this.error = errorMessage;
        return { success: false, error: errorMessage };
      }
    },

    async updateTodo(id, updates) {
      try {
        const response = await axios.put(`/api/todos/${id}`, updates);
        const index = this.todos.findIndex(todo => todo.id === id);
        if (index !== -1) {
          this.todos[index] = response.data;
        }
        return { success: true };
      } catch (error) {
        const errorMessage = error.response?.data?.error || 'Failed to update todo';
        this.error = errorMessage;
        return { success: false, error: errorMessage };
      }
    },

    async deleteTodo(id) {
      try {
        await axios.delete(`/api/todos/${id}`);
        this.todos = this.todos.filter(todo => todo.id !== id);
        return { success: true };
      } catch (error) {
        const errorMessage = error.response?.data?.error || 'Failed to delete todo';
        this.error = errorMessage;
        return { success: false, error: errorMessage };
      }
    }
  }
});