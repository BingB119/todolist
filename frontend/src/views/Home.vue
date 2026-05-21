<template>
  <div class="home">
    <div class="container">
      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📋</div>
          <div class="stat-content">
            <h3>{{ totalTodos }}</h3>
            <p>总任务数</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">⏳</div>
          <div class="stat-content">
            <h3>{{ pendingTodos.length }}</h3>
            <p>待完成</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <h3>{{ completedTodos.length }}</h3>
            <p>已完成</p>
          </div>
        </div>
      </div>

      <!-- Add Todo Form -->
      <div class="add-todo-card">
        <h2 class="section-title">添加新任务</h2>
        <form @submit.prevent="handleAddTodo" class="add-todo-form">
          <div class="form-row">
            <input
              v-model="newTodo.title"
              type="text"
              placeholder="需要完成什么？"
              class="todo-input"
              required
            />
            <button type="submit" :disabled="adding" class="add-btn">
              {{ adding ? '添加中...' : '添加任务' }}
            </button>
          </div>
          <textarea
            v-model="newTodo.description"
            placeholder="添加描述（可选）"
            class="todo-textarea"
            rows="2"
          ></textarea>
        </form>
      </div>

      <!-- Todo List -->
      <div class="todos-section">
        <div class="section-header">
          <h2 class="section-title">您的任务</h2>
          <div class="filter-buttons">
            <button
              @click="filter = 'all'"
              :class="['filter-btn', { active: filter === 'all' }]"
            >
              全部
            </button>
            <button
              @click="filter = 'pending'"
              :class="['filter-btn', { active: filter === 'pending' }]"
            >
              待完成
            </button>
            <button
              @click="filter = 'completed'"
              :class="['filter-btn', { active: filter === 'completed' }]"
            >
              已完成
            </button>
          </div>
        </div>

        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>加载任务中...</p>
        </div>

        <div v-else-if="filteredTodos.length === 0" class="empty-state">
          <div class="empty-icon">📝</div>
          <h3>未找到任务</h3>
          <p>{{ filter === 'all' ? '在上面添加您的第一个任务！' : `没有${filter === 'pending' ? '待完成' : '已完成'}任务。` }}</p>
        </div>

        <div v-else class="todos-list">
          <TodoItem
            v-for="todo in filteredTodos"
            :key="todo.id"
            :todo="todo"
            @toggle="toggleTodo"
            @delete="deleteTodo"
            @update="updateTodo"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useTodoStore } from '../stores/todos';
import TodoItem from '../components/TodoItem.vue';

const todoStore = useTodoStore();
const newTodo = ref({ title: '', description: '' });
const adding = ref(false);
const filter = ref('all');

const totalTodos = computed(() => todoStore.totalTodos);
const pendingTodos = computed(() => todoStore.pendingTodos);
const completedTodos = computed(() => todoStore.completedTodos);
const loading = computed(() => todoStore.loading);

const filteredTodos = computed(() => {
  switch (filter.value) {
    case 'pending':
      return pendingTodos.value;
    case 'completed':
      return completedTodos.value;
    default:
      return todoStore.todos;
  }
});

const handleAddTodo = async () => {
  if (!newTodo.value.title.trim()) return;

  adding.value = true;
  const result = await todoStore.addTodo({
    title: newTodo.value.title.trim(),
    description: newTodo.value.description.trim()
  });

  if (result.success) {
    newTodo.value.title = '';
    newTodo.value.description = '';
  }

  adding.value = false;
};

const toggleTodo = async (todo) => {
  await todoStore.updateTodo(todo.id, { completed: !todo.completed });
};

const deleteTodo = async (id) => {
  await todoStore.deleteTodo(id);
};

const updateTodo = async (id, updates) => {
  await todoStore.updateTodo(id, updates);
};

onMounted(() => {
  todoStore.fetchTodos();
});
</script>

<style scoped>
.home {
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  color: white;
}

.stat-content h3 {
  font-size: 1.8rem;
  color: #333;
  margin: 0;
  font-weight: 700;
}

.stat-content p {
  color: #666;
  margin: 0.25rem 0 0 0;
  font-size: 0.9rem;
}

.add-todo-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.section-title {
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.add-todo-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.todo-input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.todo-input:focus {
  outline: none;
  border-color: #667eea;
}

.todo-textarea {
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 6px;
  font-size: 1rem;
  resize: vertical;
  transition: border-color 0.3s ease;
}

.todo-textarea:focus {
  outline: none;
  border-color: #667eea;
}

.add-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.add-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.todos-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #e1e5e9;
  background: white;
  color: #666;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.filter-btn.active {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.loading-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e1e5e9;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #333;
  margin-bottom: 0.5rem;
}

.todos-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    flex-direction: column;
  }

  .section-header {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-buttons {
    justify-content: center;
  }
}
</style>