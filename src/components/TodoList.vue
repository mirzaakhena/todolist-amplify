<template>
  <div class="container">
    <div class="header">
      <h1 class="title">Todo List</h1>
      <div
        class="loading-indicator"
        v-if="loading"
      >
        Loading...
      </div>
    </div>
    <div class="input-container">
      <input
        type="text"
        class="input-field"
        placeholder="input your new todo here..."
        v-model="newTodo"
        @input="validateInput"
      />
      <button
        class="input-button"
        @click="createTodo"
        :disabled="!isInputValid || loading"
      >
        Add New
      </button>
    </div>

    <ul class="item-list">
      <li
        class="item"
        v-for="todo in todos"
        :key="todo.id"
      >
        <input
          type="checkbox"
          class="item-checkbox"
          v-model="todo.completed"
          @change="toggleTodoCompletion(todo)"
        />
        <span
          class="item-label"
          :class="{ 'line-through': todo.completed }"
          >{{ todo.title }}</span
        >
        <button
          class="delete-button"
          @click="deleteTodoItem(todo.id)"
        >
          Delete
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import config from "../amplifyconfiguration.json";
import { v4 as uuidv4 } from "uuid";
import { addTodo, updateTodo, deleteTodo } from "../graphql/mutations";
import { getTodos } from "../graphql/queries";
import { onTodoChanged } from "../graphql/subscriptions";

Amplify.configure(config);

const client = generateClient();
const randomId = uuidv4();
const newTodo = ref("");
const todos = ref([]);
const loading = ref(false);
const isInputValid = ref(false);

console.log("randomId:", randomId);

const loadTodos = async () => {
  try {
    loading.value = true;
    const result = await client.graphql({
      query: getTodos,
    });
    todos.value = result.data.getTodos.sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate));
  } catch (error) {
    console.error("Error fetching todos:", error);
  } finally {
    loading.value = false;
  }
};

const createTodo = async () => {
  const inputTodo = newTodo.value.trim();
  if (inputTodo) {
    try {
      loading.value = true;

      todos.value.push({ title: inputTodo });

      await client.graphql({
        query: addTodo,
        variables: { title: inputTodo, randomId },
      });
      newTodo.value = "";
      validateInput();
      await loadTodos();
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  }
};

const toggleTodoCompletion = async (todo) => {
  try {
    loading.value = true;
    await client.graphql({
      query: updateTodo,
      variables: { id: todo.id, completed: todo.completed, randomId },
    });
  } catch (error) {
    console.error("Error updating todo:", error);
  } finally {
    loading.value = false;
  }
};

const deleteTodoItem = async (id) => {
  try {
    loading.value = true;

    // remove todo directly from todos array
    const index = todos.value.findIndex((todo) => todo.id === id);
    if (index !== -1) {
      // Remove the todo item from the array
      todos.value.splice(index, 1);
    }

    await client.graphql({
      query: deleteTodo,
      variables: { id, randomId },
    });
  } catch (error) {
    console.error("Error deleting todo:", error);
  } finally {
    loading.value = false;
  }
};

const validateInput = () => {
  isInputValid.value = newTodo.value.trim().length > 0;
};

const subscribeToTodoUpdates = () => {
  client.graphql({ query: onTodoChanged }).subscribe({
    next: async (value) => {
      //

      const receivedTodo = value.data.onTodoChanged;
      const receivedRandomId = receivedTodo.randomId;

      console.log("received %s === %s", receivedRandomId, randomId);
      if (receivedRandomId === randomId) {
        return;
      }

      await loadTodos();
    },
    error: (error) => {
      console.error("Error on subscription:", error);
    },
  });
};

onMounted(async () => {
  await loadTodos();
  subscribeToTodoUpdates();
});
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  background-color: #f5f5f5;
  padding: 30px;
  border-radius: 4px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
}

.input-container {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.input-field {
  flex: 1 1 auto; /* Allow the input to grow and shrink */
  margin-right: 10px;
  height: 30px;
  box-sizing: border-box;
  font-size: 14px;
  padding: 0 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #fff;
}

.input-button {
  height: 30px;
  padding: 0 10px;
  box-sizing: border-box;
  font-size: 14px;
  border-radius: 5px;
  border: none;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  white-space: nowrap; /* Prevent text wrapping */
  flex-shrink: 0; /* Prevent the button from shrinking */
}

.input-button:hover {
  background-color: #45a049;
}

.input-button[disabled] {
  background-color: #ccc;
  cursor: not-allowed;
}

.input-button:not([disabled]):hover {
  background-color: #45a049;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

.loading-indicator {
  font-size: 14px;
  color: #888;
}

.item-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  padding-left: 0px;
  padding-right: 0px;
  margin-bottom: 0px;
  border-bottom: 1px solid #e0e0e0;
}

.item-checkbox {
  margin-right: 10px;
}

.item-label {
  flex: 1;
  font-size: 14px;
}

.line-through {
  text-decoration: line-through;
  font-style: italic;
  color: #888;
}

.delete-button {
  height: 30px;
  padding: 0 10px;
  box-sizing: border-box;
  font-size: 14px;
  border-radius: 5px;
  border: none;
  background-color: #f44336;
  color: white;
  cursor: pointer;
}

.delete-button:hover {
  background-color: #d32f2f;
}
</style>
