import "./App.css";
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Signup from "./components/Signup";
import Login from "./components/Login";
import TodoList from "./components/TodoList";

function App() {
  const isAuthenticated = !!document.cookie.includes("token");

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route
          path="/signup"
          element={!isAuthenticated ? <Signup /> : <Navigate to="/todos" />}
        />
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/todos" />}
        />
        <Route
          path="/todos"
          element={isAuthenticated ? <TodoList /> : <Navigate to="/login" />}
        />
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/todos" : "/login"} />}
        />
      </Routes>
    </>
  );
}

export default App;
