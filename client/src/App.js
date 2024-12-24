import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";

function App() {
  const [cookies, removeCookie] = useCookies(["token"]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={!cookies.token ? <Register /> : <Navigate to="/home" />}
        />
        <Route
          path="/login"
          element={!cookies.token ? <Login /> : <Navigate to="/home" />}
        />
        <Route
          path="/home"
          element={cookies.token ? <Home /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
