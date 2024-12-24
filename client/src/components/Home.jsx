import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "react-icons";
import { HiPencilAlt } from "react-icons/hi";
import { IoTrashBin } from "react-icons/io5";
import Navbar from "./utils/Navbar";
import { jwtDecode } from "jwt-decode";

function Home() {
  const [cookies, removeCookie] = useCookies(["token"]);
  const [user, setUser] = useState(null);
  const [todos, setTodos] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const token = cookies.token;
  // console.log(token);

  // Fetch todos (asynchronous function)
  const fetchTodos = async () => {
    if (!user?.userId) {
      console.log('No user ID found. Skipping data fetch.');
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:6270/todos/${user.userId}`,
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        }
      );
      setTodos(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.error('Unauthorized access. Token might be invalid or expired.');
      } else {
        console.error("Error fetching todos:", error);
      }
    } finally {
      console.log(todos);
    }
  };

  useEffect(() => {
    fetchTodos();
  })

  // useEffect hook for data fetching and authentication handling
  useEffect(() => {
    const handleDataAndAuth = async () => {
      // Check for token and verify if necessary
      if (cookies.token) {
        try {
          const decoded = jwtDecode(cookies.token);
          const isExpired = decoded.exp * 1000 < Date.now();

          if (isExpired) {
            removeCookie("token");
            navigate("/login", { replace: true });
            return; // Early return to prevent unnecessary data fetch
          }

          setUser(decoded);
        } catch (error) {
          removeCookie("token");
          navigate("/login", { replace: true });
          return; // Early return to prevent unnecessary data fetch
        }
      } else {
        navigate("/login", { replace: true });
        return; // Early return to prevent unnecessary data fetch
      }

      if (user)
        await fetchTodos();
    };

    handleDataAndAuth();
  }, [cookies, navigate]); // Dependency array for token changes and navigation

  console.log('user : ', user); // Log user data after state update
  console.log(cookies.token);
  // console.log("user's id is:", user?.id); // Use optional chaining for safety

  return (
    <>
      <Navbar />
      <div className="mt-20 text-center mb-4">
        <h2 className="underline text-2xl">Your Todos</h2>
      </div>
      <div className="mt-1 ps-80 pe-80 sm:ps-50">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2 bg-gray-200">S.No.</th>
              <th className="border p-2">Title</th>
              <th className="border p-2 bg-gray-200">Date</th>
              <th className="border p-2">Status</th>
              <th className="border p-2 bg-gray-200">Update</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo, index) => (
              <tr key={index}>
                <td className="border p-2 bg-gray-100">{index + 1}</td>
                <td className="border p-2">{todo.title}</td>
                <td className="border p-2 bg-gray-100">{todo.status}</td>
                <td className="border p-2">
                  {new Date(todo.created_at).toLocaleString().slice(0, 10)}
                </td>
                <td className="border p-2 bg-gray-100">
                  <button
                    className=" hover:size-2 ms-4 text-blue-500"
                  // onClick={
                  // () => handleUpdateTodo(todo.id)
                  // }
                  >
                    <HiPencilAlt />
                  </button>
                  <button
                    className="ms-4 hover:size-2 text-red-400"
                  // onClick={
                  // () => handleUpdateTodo(todo.id)
                  // }
                  >
                    <IoTrashBin />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Home;

// useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:6270/todos/${userData.id}`,
//           {
//             headers: {
//               Authorization: `Bearer ${cookies.token}`,
//             },
//           }
//         );
//         setTodos(response.data);
//       } catch (error) {
//         console.error("Error fetching todos:", error);
//       }
//     };

//     fetchData();
// }, []);
