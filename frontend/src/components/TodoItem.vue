<template>
  <div class="todo-item" :class="{ completed: todo.completed }">
    <div class="todo-content">
      <div class="todo-main">
        <label class="checkbox-container">
          <input
            type="checkbox"
            :checked="todo.completed"
            @change="$emit('toggle', todo)"
            class="checkbox"
          />
          <span class="checkmark"></span>
        </label>

        <div class="todo-details">
          <input
            v-if="editing"
            v-model="editData.title"
            @keyup.enter="saveEdit"
            @keyup.esc="cancelEdit"
            @blur="saveEdit"
            class="edit-input"
            ref="editInput"
          />
          <h3 v-else class="todo-title" :class="{ 'line-through': todo.completed }">
            {{ todo.title }}
          </h3>

          <textarea
            v-if="editing"
            v-model="editData.description"
            @blur="saveEdit"
            class="edit-textarea"
            rows="2"
          ></textarea>
          <p v-else-if="todo.description" class="todo-description" :class="{ 'line-through': todo.completed }">
            {{ todo.description }}
          </p>
        </div>
      </div>

      <div class="todo-actions">
        <button
          v-if="!editing"
          @click="startEdit"
          class="action-btn edit-btn"
          title="编辑"
        >
          ✏️
        </button>
        <button
          v-if="editing"
          @click="saveEdit"
          class="action-btn save-btn"
          title="保存"
        >
          💾
        </button>
        <button
          v-if="editing"
          @click="cancelEdit"
          class="action-btn cancel-btn"
          title="取消"
        >
          ❌
        </button>
        <button
          @click="confirmDelete"
          class="action-btn delete-btn"
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </div>

    <div class="todo-meta">
      <span class="todo-date">
        Created: {{ formatDate(todo.created_at) }}
      </span>
      <span v-if="todo.updated_at !== todo.created_at" class="todo-date">
        Updated: {{ formatDate(todo.updated_at) }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';

const props = defineProps({
  todo: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['toggle', 'delete', 'update']);

const editing = ref(false);
const editData = ref({
  title: props.todo.title,
  description: props.todo.description || ''
});
const editInput = ref(null);

const startEdit = () => {
  editing.value = true;
  editData.value = {
    title: props.todo.title,
    description: props.todo.description || ''
  };
  nextTick(() => {
    editInput.value?.focus();
  });
};

const saveEdit = async () => {
  if (!editing.value) return;

  const trimmedTitle = editData.value.title.trim();
  if (!trimmedTitle) return;

  if (trimmedTitle !== props.todo.title || editData.value.description !== (props.todo.description || '')) {
    emit('update', props.todo.id, {
      title: trimmedTitle,
      description: editData.value.description
    });
  }

  editing.value = false;
};

const cancelEdit = () => {
  editing.value = false;
  editData.value = {
    title: props.todo.title,
    description: props.todo.description || ''
  };
};

const confirmDelete = () => {
  if (confirm('Are you sure you want to delete this task?')) {
    emit('delete', props.todo.id);
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>

<style scoped>
.todo-item {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.todo-item:hover {
  border-color: #e1e5e9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.todo-item.completed {
  opacity: 0.7;
  background: #f0f8f0;
}

.todo-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.todo-main {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  flex: 1;
}

.checkbox-container {
  position: relative;
  cursor: pointer;
  user-select: none;
  margin-top: 0.25rem;
}

.checkbox {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  position: relative;
  height: 24px;
  width: 24px;
  background-color: white;
  border: 2px solid #e1e5e9;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.checkbox-container:hover .checkmark {
  border-color: #667eea;
}

.checkbox:checked ~ .checkmark {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
}

.checkmark:after {
  content: '';
  position: absolute;
  display: none;
  left: 7px;
  top: 3px;
  width: 6px;
  height: 12px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox:checked ~ .checkmark:after {
  display: block;
}

.todo-details {
  flex: 1;
}

.todo-title {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.4;
}

.todo-description {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
}

.line-through {
  text-decoration: line-through;
  opacity: 0.7;
}

.edit-input,
.edit-textarea {
  width: 100%;
  padding: 0.5rem;
  border: 2px solid #667eea;
  border-radius: 4px;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.edit-input {
  font-weight: 600;
  color: #333;
}

.edit-textarea {
  resize: vertical;
  min-height: 60px;
}

.edit-input:focus,
.edit-textarea:focus {
  outline: none;
  border-color: #764ba2;
}

.todo-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.action-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: all 0.3s ease;
  border: 2px solid #e1e5e9;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.edit-btn:hover {
  border-color: #667eea;
  background: #f0f4ff;
}

.save-btn:hover {
  border-color: #28a745;
  background: #f0fff4;
}

.cancel-btn:hover {
  border-color: #dc3545;
  background: #fff5f5;
}

.delete-btn:hover {
  border-color: #dc3545;
  background: #fff5f5;
}

.todo-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: #888;
  border-top: 1px solid #e1e5e9;
  padding-top: 0.75rem;
}

.todo-date {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

@media (max-width: 768px) {
  .todo-content {
    flex-direction: column;
    gap: 0.75rem;
  }

  .todo-actions {
    align-self: flex-end;
  }

  .todo-meta {
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style>