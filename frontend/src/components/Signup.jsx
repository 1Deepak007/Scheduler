import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        await axios
          .post("http://localhost:3728/register", values)
          .then((response) => {
            document.cookie = `token=${response.data.token}`;
            navigate("/login");
            toast.success("Signup successful. Please log in.");
          });
      } catch (error) {
        toast.error(error.response?.data?.message || "Signup failed");
      }
    },
  });

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
          />
          {formik.errors.username && <p>{formik.errors.username}</p>}
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
          />
          {formik.errors.password && <p>{formik.errors.password}</p>}
        </div>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

export default Signup;
