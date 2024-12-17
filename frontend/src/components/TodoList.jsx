import React, { useState } from "react";
import TodoItem from "./TodoItem";
import AddTodoForm from "./AddTodoForm";
import { toast } from "react-toastify";
import axios from "axios";

function TodoList() {
  const [todos, setTodos] = useState([]);

  const fetchTodos = async (userId) => {
    try {
      const { data } = await axios.get(
        `http://localhost:3728/todos?user_id=${userId}`
      );
      setTodos(data);
    } catch (error) {
      toast.error("Failed to fetch todos");
    }
  };

  // useEffect(() => {
  //   const loggedInUserId = fetchTodos(loggedInUserId); // Get logged-in user ID (replace with your logic)
  // }, []);

  const handleAddTodo = async (todo) => {
    try {
      const { title, description } = todo; // Access data from the todo object
      await axios.post("/todos", { title, description }); // Send data in the request body
      toast.success("Todo added");
      fetchTodos(); // Refetch todos after adding
    } catch (error) {
      toast.error("Failed to add todo");
    }
  };

  const handleUpdateTodo = async (id, updatedTodo) => {
    try {
      const { title, description } = updatedTodo; // Access data from the updatedTodo object
      await axios.put(`/todos/${id}`, { title, description }); // Send data in the request body
      toast.success("Todo updated");
      fetchTodos(); // Refetch todos after updating
    } catch (error) {
      toast.error("Failed to update todo");
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`/todos/${id}`); // Send request with the ID in the URL
      toast.success("Todo deleted");
      fetchTodos(); // Refetch todos after deleting
    } catch (error) {
      toast.error("Failed to delete todo");
    }
  };

  const handleLogout = async () => {
    // get cookies stored
    const cookies = document.cookie.split(";");
    // get token from cookies
    const token = cookies.find((c) => c.trim().startsWith("token="));
    // remove token from cookies
    document.cookie = token
      .replace(/^token=/, "")
      .concat("; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/");
    // navigate to login page
    // navigate("/login");
    toast.success("Logged out");
  };

  return (
    <div>
      <h2>Your Todos</h2>
      <AddTodoForm onAdd={handleAddTodo} />
      <ul>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onUpdate={handleUpdateTodo}
            onDelete={handleDeleteTodo}
          />
        ))}
      </ul>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default TodoList;
