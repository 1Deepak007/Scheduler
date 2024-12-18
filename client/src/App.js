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
  const [cookies, , removeCookie] = useCookies(["token"]);

  return (
    <Router>
      <AuthWrapper cookies={cookies} removeCookie={removeCookie}>
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
      </AuthWrapper>
    </Router>
  );
}

function AuthWrapper({ cookies, removeCookie, children }) {
  const location = useLocation(); // Now it's within the <Router> context

  useEffect(() => {
    const token = cookies.token;

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Current time in seconds

        if (decodedToken.exp < currentTime) {
          // Token has expired
          removeCookie("token", { path: "/" });
          window.location.href = "/login";
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        removeCookie("token", { path: "/" });
        window.location.href = "/login";
      }
    }
  }, [cookies, removeCookie, location.pathname]);

  return children;
}

export default App;
