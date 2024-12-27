import React from 'react'
import { Link } from 'react-router-dom'
import { FaListAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = ({ onLogout }) => {
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const navigate = useNavigate();



    const handleLogout = async () => {
        console.log('handle logout called')
        try {
            const response = await axios.post('http://localhost:6270/logout');

            // Remove the cookies
            removeCookie('token', { path: '/' });
            removeCookie('accessToken', { path: '/' });
            removeCookie('refreshToken', { path: '/' });

            localStorage.clear();


            if (response.status === 200) { // Use React Router's navigate function instead of window.location
                onLogout();
                navigate('/login');
            } else {
                console.error('Logout failed:', response.data);
                throw new Error('Logout failed');
            }
        } catch (error) {
            console.error('Error during logout:', error);
            // Optionally, show an error message to the user
            toast.error('Failed to logout. Please try again.');
        }
    };
    return (
        <nav className="bg-white border-gray-200 dark:bg-gray-900">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link to='/' className="flex items-center space-x-3 rtl:space-x-reverse">
                    <FaListAlt className='text-white size-9' />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Your Todos</span>
                </Link>
                <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                        <li>
                            <button onClick={handleLogout} className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Logout</button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar