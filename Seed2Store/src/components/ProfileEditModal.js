import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfileEditModal({ user, onClose }) {
    const [email, setEmail] = useState(user.email);
    const [userType, setUserType] = useState(user.type);
    const [profilePic, setProfilePic] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isClosing, setIsClosing] = useState(false); // Fix for exit animation

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData();
        formData.append("userId", user._id);
        formData.append("email", email);
        formData.append("type", userType);
        if (profilePic) {
            formData.append("profilepicture", profilePic);
        }

        try {
            const res = await fetch("http://localhost:5000/api/user/updateProfile", {
                method: "POST",
                body: formData,
                headers: { "auth-token": localStorage.getItem("token") }
            });
            if (!res.ok) {
                throw new Error("Failed to update profile");
            }
            const updatedUser = await res.json();
            console.log("Profile updated", updatedUser);
            closeModal(); // Close modal properly
        } catch (err) {
            console.error(err);
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    // Handles closing with animation
    const closeModal = () => {
        setIsClosing(true);
        setTimeout(onClose, 200); // Match exit animation duration
    };

    // Animation Variants
    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
        exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2, ease: "easeIn" } },
    };

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.2, ease: "easeOut" } },
        exit: { opacity: 0, transition: { duration: 0.2, ease: "easeIn" } },
    };

    return (
        <AnimatePresence>
            {!isClosing && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={backdropVariants}
                >
                    {/* Background Overlay */}
                    <motion.div
                        className="fixed inset-0 bg-black"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={backdropVariants}
                        style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
                        onClick={closeModal} // Close modal on background click
                    />

                    {/* Modal */}
                    <motion.div
                        className="bg-white rounded-lg p-6 w-96 border-2 border-green-950 shadow-lg relative z-10"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={modalVariants}
                    >
                        <h2 className="text-2xl font-bold mb-4 text-green-950">Edit Profile</h2>
                        {error && <p className="text-red-500 mb-2">{error}</p>}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-green-950 font-semibold mb-1">Email:</label>
                                <input
                                    type="email"
                                    className="w-full border border-green-950 p-2 rounded focus:outline-none focus:ring-2 focus:ring-lime-400"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-green-950 font-semibold mb-1">Account Type:</label>
                                <select
                                    className="w-full border border-green-950 p-2 rounded focus:outline-none focus:ring-2 focus:ring-lime-400"
                                    value={userType}
                                    onChange={(e) => setUserType(e.target.value)}
                                >
                                    <option value="Farmer">Farmer</option>
                                    <option value="Buyer">Buyer</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-green-950 font-semibold mb-1">Profile Picture:</label>
                                <input
                                    type="file"
                                    className="w-full border border-green-950 p-2 rounded focus:outline-none focus:ring-2 focus:ring-lime-400"
                                    onChange={(e) => setProfilePic(e.target.files[0])}
                                />
                            </div>

                            <div className="flex justify-between mt-6">
                                <button
                                    type="submit"
                                    className="bg-lime-400 text-green-950 font-bold px-4 py-2 rounded hover:bg-lime-500 transition-colors"
                                    disabled={loading}
                                >
                                    {loading ? "Saving..." : "Save"}
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="bg-green-950 text-white font-bold px-4 py-2 rounded hover:bg-green-800 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
