import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaRegClipboard } from "react-icons/fa6";
import axios from 'axios';
import { useCookies } from 'react-cookie';

const Navbar = () => {
    const navigate = useNavigate;
    const [cookies, removeCookie] = useCookies(["token"]);
    const handleLogout = async () => {
        console.log('handle logout');
        try {
            await axios.get("http://localhost:6270/auth/logout", {
                headers: {
                    Authorization: `Bearer ${cookies.token}`,
                },
            });
            removeCookie("token", { path: "/" });
            sessionStorage.removeItem("token");
            localStorage.removeItem("token");
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };
    return (
        <div>
            <nav className="border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <Link href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <FaRegClipboard className='size-8 text-white' />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Tasks List</span>
                    </Link>
                    <button data-collapse-toggle="navbar-solid-bg" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-solid-bg" aria-expanded="false">
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                    <div className="hidden w-full md:block md:w-auto" id="navbar-solid-bg">
                        <ul className="flex flex-col font-medium mt-4 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="text-white bg-red-500 p-1 text-sm rounded-md hover:text-yellow-100 hover:bg-red-700" aria-current="page">Logout</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar