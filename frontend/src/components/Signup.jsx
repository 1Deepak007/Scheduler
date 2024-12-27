import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

const Signup = () => {
    const navigate = useNavigate();
    const api = 'http://localhost:6270'

    const initialValues = {
        name: '',
        email: '',
        password: '',
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Required'),
        email: Yup.string().email('Invalid email address').required('Required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
    });

    const onSubmit = async (values, { setSubmitting }) => {
        try {
            await api.post('/signup', values);
            setSubmitting(false);
            navigate('/login'); // Redirect to login after successful signup
            toast.success("Signup successful. Please login.");
        } catch (error) {
            setSubmitting(false);
            toast.error(error.response?.data?.error || "Signup failed");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4">Signup</h2>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Name</label>
                                <Field type="text" id="name" name="name" className="border rounded w-full py-2 px-3" />
                                <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                            </div>
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
                                {isSubmitting ? "Signing up..." : "Signup"}
                            </button>
                        </Form>
                    )}
                </Formik>
                <p className="mt-2">
                    Already have an account? <a href="/login" className="text-blue-500">Login</a>
                </p>
            </div>
        </div>
    );
};

export default Signup;