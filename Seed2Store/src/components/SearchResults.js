import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import userlogo from "../images/user.png";
import Post from "./post";
import { motion, AnimatePresence } from "framer-motion";

const SearchResults = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search).get("q");
    const [results, setResults] = useState({ posts: [], users: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("posts");

    useEffect(() => {
        if (!query) return;

        const fetchResults = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(query)}`);
                const data = await response.json();
                setResults(data);
            } catch (err) {
                setError("Failed to fetch search results");
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    return (
        <div className="flex flex-col items-center h-screen overflow-y-auto" style={{ backgroundColor: "#E4FFF0" }}>
            {/* Search Title */}
            <h2 className="text-3xl mt-5 font-bold text-center mb-6 text-green-950">
                Search Results for "<span className="text-lime-500">{query}</span>"
            </h2>

            {/* Sticky Tab Switcher */}
            <div className="sticky top-0 z-10 w-full bg-opacity-80 backdrop-blur-md border-b-2 border-green-950 pb-2 mb-4 flex justify-center space-x-8 px-4">
                {["posts", "users"].map((tab) => (
                    <button
                        key={tab}
                        className={`relative text-xl w-full font-semibold pb-1 p-5 transition-all ${
                            activeTab === tab ? "text-green-950" : "text-gray-700"
                        }`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
                {/* Animated Underline */}
                <motion.div
                    className="absolute bottom-0 h-1 bg-green-950 rounded"
                    layoutId="underline"
                    initial={false}
                    animate={{ left: activeTab === "posts" ? "12%" : "63%", width: "20%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
            </div>

            {/* Display loading or error message */}
            {loading && <p className="text-gray-700">Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {/* Search Results */}
            {!loading && !error && (
                <div className="w-full max-w-4xl">
                    <AnimatePresence mode="wait">
                        {/* Post Results */}
                        {activeTab === "posts" && (
                            <motion.div
                                key="posts"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-4 h-full flex flex-col justify-center items-center"
                            >
                                {results.posts.length > 0 ? (
                                    results.posts.map((post) => <Post key={post._id} post={post} />)
                                ) : (
                                    <p className="text-green-950 text-2xl mt-20 font-semibold">No posts found.</p>
                                )}
                            </motion.div>
                        )}

                        {/* User Results */}
                        {activeTab === "users" && (
                            <motion.div
                                key="users"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-4 h-full flex flex-col justify-center items-center"
                            >
                                {results.users.length > 0 ? (
                                    results.users.map((user) => (
                                        <div key={user._id} className="flex w-3/4 items-center p-4 border border-green-950 rounded-lg shadow-md bg-white">
                                            <img
                                                src={
                                                    user.profilepicture
                                                        ? `http://localhost:5000/api/user/profilepicture/${user._id}`
                                                        : userlogo
                                                }
                                                alt={user.name}
                                                className="w-12 h-12 rounded-full mr-4"
                                            />
                                            <div>
                                                <a
                                                    href={`/profile/${user.name}`}
                                                    className="text-xl font-semibold text-green-950 hover:underline"
                                                >
                                                    {user.name}
                                                </a>
                                                <p className="text-gray-700">{user.email}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-green-950 text-2xl mt-20 font-semibold">No users found.</p>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default SearchResults;
