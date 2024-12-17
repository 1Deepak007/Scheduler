import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

function AddTodoForm({ onAdd }) {
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      onAdd(values);
      resetForm();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formik.values.title}
          onChange={formik.handleChange}
        />
        {formik.errors.title && <p>{formik.errors.title}</p>}
      </div>
      <div>
        <textarea
          name="description"
          placeholder="Description"
          value={formik.values.description}
          onChange={formik.handleChange}
        ></textarea>
      </div>
      <button type="submit">Add Todo</button>
    </form>
  );
}

export default AddTodoForm;
