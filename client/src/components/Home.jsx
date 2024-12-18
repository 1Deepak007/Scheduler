// Home.js
import React from "react";
import { useCookies } from "react-cookie";
import axios from "axios";

function Home() {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  const handleLogout = async () => {
    try {
      // Send a logout request to the server (optional)
      await axios.get(
        "http://localhost:6270/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        }
      );

      // Remove the token cookie
      removeCookie("token", { path: "/" });
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div>
      <h2>Welcome to the Home Page!</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Home;
