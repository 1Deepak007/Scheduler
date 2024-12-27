import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { jwtDecode } from 'jwt-decode';
// import api from '../api';
import { FaPlus, FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import { Dialog } from '@headlessui/react'
import axios from 'axios';
import Navbar from './utils/Navbar';
import { useCookies } from 'react-cookie';
import Cookies from 'js-cookie';

const Todos = () => {
    const [todos, setTodos] = useState([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedTodo, setSelectedTodo] = useState(null);
    const [cookies, setCookie] = useCookies(['token']); // Destructure for cleaner access

    const isValidToken = (token) => {
        try {
            // Decode the token 
            const decodedToken = jwtDecode(token);

            // Check if the token has expired
            const currentTime = Date.now() / 1000; // Current time in seconds
            if (decodedToken.exp < currentTime) {
                return false; // Token has expired
            }

            return true; // Token is valid

        } catch (error) {
            console.error("Error decoding token:", error);
            return false; // Error decoding token, consider it invalid
        }
    };

    const handleAddTodo = async (values, { setSubmitting }) => {
        const accessToken = Cookies.get('accessToken');
        try {
            const res = await axios.post("http://localhost:6270/todos", values,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }
                }
            );

            // Add the new todo to the existing todos array
            setTodos(prevTodos => [...prevTodos, { ...res.data, id: res.data.id }]);

            setOpen(false);
            setSubmitting(false);
            toast.success("Todo added successfully");
        } catch (error) {
            setSubmitting(false);
            toast.error(error.response?.data?.error || "Error adding todo");
        }
    };

    const handleUpdateTodo = async (values, { setSubmitting }) => {
        const accessToken = Cookies.get('accessToken');
        try {
            await axios.put(`http://localhost:6270/todos/${selectedTodo.id}`, values,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }
                }
            );
            setTodos(todos.map(todo => todo.id === selectedTodo.id ? { ...todo, ...values } : todo))
            setOpen(false)
            setSubmitting(false)
            toast.success("Todo updated successfully")
        } catch (error) {
            setSubmitting(false)
            toast.error(error.response?.data?.error || "Error updating todo")
        }
    };

    const handleDeleteTodo = async (id) => {
        const accessToken = Cookies.get('accessToken');
        try {
            await axios.delete(`http://localhost:6270/todos/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });
            setTodos(todos.filter(todo => todo.id !== id));
            toast.success("Todo deleted successfully")
        } catch (error) {
            toast.error(error.response?.data?.error || "Error deleting todo")
        }
    };

    useEffect(() => {
        const fetchTodos = async () => {
            const accessToken = Cookies.get('accessToken'); // Retrieve the token from cookies

            if (!accessToken || !isValidToken(accessToken)) {
                console.error('Missing access token in cookies');
                toast.error('Missing access token');
                return;
            }

            try {
                const response = await axios.get("http://localhost:6270/todos", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                setTodos(response.data);
            } catch (err) {
                console.error("error : ", err);
            }
        };

        fetchTodos();
    }, [cookies, handleAddTodo, handleUpdateTodo, handleDeleteTodo]);


    const initialValues = editMode && selectedTodo ? selectedTodo : { title: '', description: '', status: 'pending' }
    const validationSchema = Yup.object({
        title: Yup.string().required('Required'),
        description: Yup.string().required('Required'),
        status: Yup.string().oneOf(['pending', 'working', 'completed']).required('Required')
    })
    return (
        <>
            <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-[10%]">
                <h1 className="text-2xl font-bold mb-4">My Todos</h1>

                <button onClick={() => { setOpen(true); setEditMode(false); setSelectedTodo(null) }} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4 flex items-center gap-2">
                    <FaPlus /> Add Todo
                </button>

                {todos.length === 0 ? <p className='text-center text-gray-500'>No todos yet.</p> : (
                    <ul>
                        {todos.map(todo => (
                            <li key={todo.id} className="bg-gray-50 p-3 rounded mb-2 flex justify-between items-center">
                                <div>
                                    <h3 className="font-medium">{todo.title}</h3>
                                    <p className="text-sm text-gray-600">{todo.description}</p>
                                    <p className='text-xs text-gray-400'>{todo.status}</p>
                                </div>
                                <div className='flex gap-2'>
                                    <button onClick={() => { setOpen(true); setEditMode(true); setSelectedTodo(todo) }} className='text-blue-500'>
                                        <FaPencilAlt />
                                    </button>
                                    <button onClick={() => handleDeleteTodo(todo.id)} className='text-red-500'>
                                        <FaTrashAlt />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
                    <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                            <Dialog.Title
                                as="h3"
                                className="text-lg font-medium leading-6 text-gray-900"
                            >
                                {editMode ? "Update Todo" : "Add New Todo"}
                            </Dialog.Title>
                            <Formik
                                initialValues={initialValues}
                                enableReinitialize
                                validationSchema={validationSchema}
                                onSubmit={editMode ? handleUpdateTodo : handleAddTodo}
                            >
                                {({ isSubmitting }) => (
                                    <Form className="mt-4">
                                        <div className="mb-4">
                                            <label htmlFor="title" className="block text-gray-700 font-bold mb-2">Title</label>
                                            <Field type="text" id="title" name="title" className="border rounded w-full py-2 px-3" />
                                            <ErrorMessage name="title" component="div" className="text-red-500 text-sm" />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="description" className="block text-gray-700 font-bold mb-2">Description</label>
                                            <Field type="text" id="description" name="description" className="border rounded w-full py-2 px-3" />
                                            <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="status" className="block text-gray-700 font-bold mb-2">Status</label>
                                            <Field as="select" id="status" name="status" className="border rounded w-full py-2 px-3">
                                                <option value="pending">Pending</option>
                                                <option value="working">Working</option>
                                                <option value="completed">Completed</option>
                                            </Field>
                                            <ErrorMessage name="status" component="div" className="text-red-500 text-sm" />
                                        </div>
                                        <div className='flex justify-end'>
                                            <button type="submit" disabled={isSubmitting} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50">
                                                {isSubmitting ? (editMode ? "Updating..." : "Adding...") : (editMode ? "Update" : "Add")}
                                            </button>
                                            <button type="button" onClick={() => setOpen(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded ml-2">
                                                Cancel
                                            </button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </Dialog.Panel>
                    </div>
                </Dialog>
            </div>
        </>
    );
};

export default Todos;