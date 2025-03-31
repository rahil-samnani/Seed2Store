import React, { useContext, useState } from 'react';
import logo from '../images/logo.png';
import { Link, useLocation, useNavigate } from "react-router-dom";
import UserContext from '../context/user/userContext';

const Navbar = () => {
    const { user } = useContext(UserContext)

    const location = useLocation()
    const path = location.pathname;
    const navigate = useNavigate()

    const [searchQuery, setSearchQuery] = useState("");

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('name')
        navigate('/login')
        alert("Logout successful")
    }

    const handleSearch = (event) => {
        if (event.key === "Enter" && searchQuery.trim() !== "") {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="flex flex-1 bg-gray-0" style={{ overflowY: "auto", float: "left" }}>
            <div className="hidden md:flex md:w-64 md:flex-col" style={{ overflowY: "auto", height: "100vh" }}>
                <div className="flex flex-col flex-grow overflow-y-auto" style={{ backgroundColor: "#032413" }}>
                    <div className="flex items-center flex-shrink-0 mx-auto ">
                        <img src={logo} alt="" style={{ width: "150px", height: "150px" }} />

                    </div>

                    <div className="px-2 mt-4">
                        <label className="sr-only"> Search </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>

                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                                className="block w-full py-2 pl-10 border-lime-500 border-2 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
                                placeholder="Search here..."
                            />
                        </div>
                    </div>

                    <div className="flex flex-col flex-1 px-3 mt-6">
                        <div className="space-y-4">
                            <nav className="flex-1 space-y-2">
                                <Link to="/" title="" className={path === '/' ? `flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 text-gray-900 rounded-lg bg-lime-600 group` : `flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 text-white hover:text-gray-900 rounded-lg hover:bg-lime-600 group`}>
                                    <svg className={path === '/' ? `flex-shrink-0 w-5 h-5 mr-4 text-black` : `flex-shrink-0 w-5 h-5 mr-4 text-white`} xmlns="http://www.w3.org/2000/svg w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    Home
                                </Link>

                                <Link to="/createpost" className={path === '/createpost' ? `flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 text-gray-900 rounded-lg bg-lime-600 group` : `flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 text-white hover:text-gray-900 rounded-lg hover:bg-lime-600 group`}>
                                    <svg className={path === '/createpost' ? `flex-shrink-0 w-5 h-5 mr-4 text-black` : `flex-shrink-0 w-5 h-5 mr-4 text-white`} xmlns="http://www.w3.org/2000/svg w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path d="M8 12H12M12 12H16M12 12V16M12 12V8M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Create Post
                                </Link>

                                <Link to={`/chat`} className={useLocation().pathname.startsWith("/chat") ? `flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 text-gray-900 rounded-lg bg-lime-600 group` : `flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 text-white hover:text-gray-900 rounded-lg hover:bg-lime-600 group`}>
                                    <svg className={useLocation().pathname.startsWith("/chat") ? `flex-shrink-0 w-5 h-5 mr-4 text-black` : `flex-shrink-0 w-5 h-5 mr-4 text-white`} fill="none" viewBox="0 0 60 55" stroke="currentColor" strokeWidth="5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M30,1.5c-16.542,0-30,12.112-30,27c0,5.205,1.647,10.246,4.768,14.604c-0.591,6.537-2.175,11.39-4.475,13.689
	c-0.304,0.304-0.38,0.769-0.188,1.153C0.276,58.289,0.625,58.5,1,58.5c0.046,0,0.093-0.003,0.14-0.01
	c0.405-0.057,9.813-1.412,16.617-5.338C21.622,54.711,25.738,55.5,30,55.5c16.542,0,30-12.112,30-27S46.542,1.5,30,1.5z" />
                                    </svg>
                                    Chats
                                </Link>


                                <Link to={`/acceptedbids/${user.name}`} className={useLocation().pathname.startsWith("/acceptedbids/") ? `flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 text-gray-900 rounded-lg bg-lime-600 group` : `flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 text-white hover:text-gray-900 rounded-lg hover:bg-lime-600 group`}>
                                    <svg className={useLocation().pathname.startsWith("/acceptedbids/") ? `flex-shrink-0 w-5 h-5 mr-4 text-black` : `flex-shrink-0 w-5 h-5 mr-4 text-white`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path transform="translate(12,0)" strokeLinecap="round" strokeLinejoin="round" d="M0 0 C1.01866229 1.65532623 2.01810813 3.32260138 3 5 C3.99 5.33 4.98 5.66 6 6 C5.44225728 9.23490776 4.62788492 10.97855006 2 13 C1.01 13 0.02 13 -1 13 C-1 12.01 -1 11.02 -1 10 C-3.75717702 11.37858851 -4.46321746 13.37466315 -6 16 C-6.66 16.66 -7.32 17.32 -8 18 C-10.125 17.625 -10.125 17.625 -12 17 C-11.4376049 13.73810844 -10.5859495 12.08865152 -8 10 C-7.01 9.67 -6.02 9.34 -5 9 C-4.67 8.34 -4.34 7.68 -4 7 C-4.99 7 -5.98 7 -7 7 C-6.22006468 2.47637516 -4.81844319 0 0 0 Z " />
                                    </svg>
                                    Placed Bids
                                </Link>

                                <Link to={`/dashboard/${user.name}`} className={useLocation().pathname.startsWith("/dashboard/") ? `flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 text-gray-900 rounded-lg bg-lime-600 group` : `flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 text-white hover:text-gray-900 rounded-lg hover:bg-lime-600 group`}>
                                    <svg className={useLocation().pathname.startsWith("/dashboard/") ? `flex-shrink-0 w-5 h-5 mr-4 text-black` : `flex-shrink-0 w-5 h-5 mr-4 text-white`} xmlns="http://www.w3.org/2000/svg w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    Orders
                                </Link>
                            </nav>

                            <hr className="border-gray-200" />
                            <nav className="flex-1 space-y-2">
                                <Link to="/aboutus" className={useLocation().pathname.startsWith("/aboutus") ? `flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 text-gray-900 rounded-lg bg-lime-600 group` : `flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 text-white hover:text-gray-900 rounded-lg hover:bg-lime-600 group`}>
                                    <svg className={useLocation().pathname.startsWith("/aboutus") ? `flex-shrink-0 w-5 h-5 mr-4 text-black` : `flex-shrink-0 w-5 h-5 mr-4 text-white`} xmlns="http://www.w3.org/2000/svg w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    About Us
                                </Link>

                                <Link to="/contactus" className={useLocation().pathname.startsWith("/contactus") ? `flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 text-gray-900 rounded-lg bg-lime-600 group` : `flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 text-white hover:text-gray-900 rounded-lg hover:bg-lime-600 group`}>
                                    <svg className={useLocation().pathname.startsWith("/contactus") ? `flex-shrink-0 w-5 h-5 mr-4 text-black` : `flex-shrink-0 w-5 h-5 mr-4 text-white`} xmlns="http://www.w3.org/2000/svg w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    Contact

                                </Link>
                            </nav>

                            <hr className="border-gray-200" />
                            <nav className="flex-1 space-y-2">
                                <button onClick={handleLogout} className="flex items-center px-4 py-2.5 text-sm w-full font-medium transition-all duration-200 text-red-700 hover:text-gray-900 rounded-lg hover:bg-red-600 group">
                                    <svg className="flex-shrink-0 w-5 h-5 mr-4" xmlns="http://www.w3.org/2000/svg w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M11.75 9.874C11.75 10.2882 12.0858 10.624 12.5 10.624C12.9142 10.624 13.25 10.2882 13.25 9.874H11.75ZM13.25 4C13.25 3.58579 12.9142 3.25 12.5 3.25C12.0858 3.25 11.75 3.58579 11.75 4H13.25ZM9.81082 6.66156C10.1878 6.48991 10.3542 6.04515 10.1826 5.66818C10.0109 5.29121 9.56615 5.12478 9.18918 5.29644L9.81082 6.66156ZM5.5 12.16L4.7499 12.1561L4.75005 12.1687L5.5 12.16ZM12.5 19L12.5086 18.25C12.5029 18.25 12.4971 18.25 12.4914 18.25L12.5 19ZM19.5 12.16L20.2501 12.1687L20.25 12.1561L19.5 12.16ZM15.8108 5.29644C15.4338 5.12478 14.9891 5.29121 14.8174 5.66818C14.6458 6.04515 14.8122 6.48991 15.1892 6.66156L15.8108 5.29644ZM13.25 9.874V4H11.75V9.874H13.25ZM9.18918 5.29644C6.49843 6.52171 4.7655 9.19951 4.75001 12.1561L6.24999 12.1639C6.26242 9.79237 7.65246 7.6444 9.81082 6.66156L9.18918 5.29644ZM4.75005 12.1687C4.79935 16.4046 8.27278 19.7986 12.5086 19.75L12.4914 18.25C9.08384 18.2892 6.28961 15.5588 6.24995 12.1513L4.75005 12.1687ZM12.4914 19.75C16.7272 19.7986 20.2007 16.4046 20.2499 12.1687L18.7501 12.1513C18.7104 15.5588 15.9162 18.2892 12.5086 18.25L12.4914 19.75ZM20.25 12.1561C20.2345 9.19951 18.5016 6.52171 15.8108 5.29644L15.1892 6.66156C17.3475 7.6444 18.7376 9.79237 18.75 12.1639L20.25 12.1561Z"
                                        />
                                    </svg>
                                    Logout
                                </button>
                            </nav>
                        </div>

                        <div className="pb-4 mt-2">
                            <Link to={`/profile/${user.name}`}>
                                <button type="button"className={useLocation().pathname.startsWith("/profile/") ? "flex items-center justify-between w-full px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg bg-lime-400 text-black" :  "flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-white transition-all duration-200 rounded-lg hover:bg-lime-400 hover:text-black"}>
                                    <img className="flex-shrink-0 object-cover w-6 h-6 mr-3 rounded-full" src={`http://localhost:5000/api/user/profilepicture/${user.id}`} alt="" />
                                    {user.name}
                                    <svg className="w-5 h-5 ml-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    </svg>
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
export default Navbar;