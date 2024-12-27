import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import axios from 'axios';
import Cookies from 'js-cookie';

const Login = ({ onLogin }) => {
    const navigate = useNavigate();

    const initialValues = {
        email: '',
        password: '',
    };

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email address').required('Required'),
        password: Yup.string().required('Required'),
    });

    const onSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await axios.post('http://localhost:6270/login', values);
            if (response.status === 200) {
                const { accessToken, refreshToken } = response.data;

                // Set cookies
                // Cookies.set('accessToken', accessToken, { expires: 1, secure: true });   // for 1 day
                Cookies.set('accessToken', accessToken, { expires: 6 / 24, secure: true });   // for 6 hours
                Cookies.set('refreshToken', refreshToken, { expires: 6 / 24, secure: true });

                toast.success("Login successful");
                onLogin();
                navigate('/');
            }
        } catch (error) {
            setSubmitting(false);
            toast.error(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4">Login</h2>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {({ isSubmitting }) => ( // Access isSubmitting prop
                        <Form>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email</label>
                                <Field type="email" id="email" name="email" className="border rounded w-full py-2 px-3" />
                                <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password</label>
                                <Field type="password" id="password" name="password" className="border rounded w-full py-2 px-3" />
                                <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                            </div>
                            <button type="submit" disabled={isSubmitting} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full disabled:opacity-50">
                                {isSubmitting ? "Logging in..." : "Login"}
                            </button>
                        </Form>
                    )}
                </Formik>
                <p className="mt-2">
                    Don't have an account? <a href="/signup" className="text-blue-500">Signup</a>
                </p>
            </div>
        </div>
    );
};

export default Login;