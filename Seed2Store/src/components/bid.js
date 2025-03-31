import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import BidContext from '../context/bid/bidContext';

export default function Bid({ post }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (window?.HSStaticMethods?.autoInit) {
            window.HSStaticMethods.autoInit();
        }
    }, [location.pathname]);

    const { bid, setBid, placeBid } = useContext(BidContext) || { bid: {}, setBid: () => {} };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBid(prevBid => ({ ...prevBid, [name]: value }));
    };

    const submitBid = (e) => {
        e.preventDefault();
        if (bid.bidAmount <= 0 || bid.bidQuantity <= 0) {
            alert("Bid amount and quantity must be greater than 0");
            return;
        }
        if (post.pricingType === "Fixed" && bid.bidAmount < post.pricePerUnit) {
            alert("For fixed pricing, bid amount cannot be less than the price per unit");
            return;
        }
        placeBid(post._id);
        setIsModalOpen(false);
    };

    // Modal animation variants
    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
        exit: { opacity: 0, scale: 0.8, transition: { duration: 0.15, ease: "easeIn" } },
    };

    // Background overlay animation
    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.2, ease: "easeOut" } },
        exit: { opacity: 0, transition: { duration: 0.15, ease: "easeIn" } },
    };

    return (
        <div>
            <button
                type="button"
                className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-lime-600 text-white hover:bg-green-950 focus:outline-none focus:bg-green-950 disabled:opacity-50 disabled:pointer-events-none"
                onClick={() => setIsModalOpen(true)}
            >
                Place Bid
            </button>

            {/* AnimatePresence ensures smooth enter & exit animations */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        {/* Background Overlay Animation */}
                        <motion.div
                            className="fixed inset-0 bg-black"
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={backdropVariants}
                            style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }} // Initial opacity to match animation
                        />

                        {/* Modal Animation */}
                        <motion.div
                            className="fixed inset-0 flex items-center justify-center"
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={modalVariants}
                        >
                            <motion.div className="bg-white rounded-lg p-6 w-96 border-2 border-green-950 shadow-lg">
                                <h2 className="text-2xl font-bold mb-4 text-green-950">Place a Bid</h2>
                                <div className='mb-4'>
                                    <p className="text-green-950 font-semibold">Product Name: <span className="font-normal">{post.productName}</span></p>
                                    <p className="text-green-950 font-semibold">Quantity Available: <span className="font-normal">{post.quantity} {post.unit}</span></p>
                                    <p className="text-green-950 font-semibold">Variety: <span className="font-normal">{post.variety}</span></p>
                                    <p className="text-green-950 font-semibold">Price per Unit: <span className="font-normal">{post.pricePerUnit}</span></p>
                                    <p className="text-green-950 font-semibold">Pricing Type: <span className="font-normal">{post.pricingType}</span></p>
                                </div>
                                <form onSubmit={submitBid}>
                                    <div className="mb-4">
                                        <label className="block text-green-950 font-semibold mb-1">Bid Amount:</label>
                                        <input type="number" name="bidAmount" value={bid.bidAmount || ''} onChange={handleChange} className="w-full border border-green-950 p-2 rounded focus:outline-none focus:ring-2 focus:ring-lime-400" placeholder="Enter bid amount" required />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-green-950 font-semibold mb-1">Bid Quantity:</label>
                                        <input type="number" name="bidQuantity" value={bid.bidQuantity || ''} onChange={handleChange} className="w-full border border-green-950 p-2 rounded focus:outline-none focus:ring-2 focus:ring-lime-400" placeholder="Enter bid quantity" required />
                                    </div>
                                    <div className="flex justify-between mt-6">
                                        <button type="submit" className="bg-lime-400 text-green-950 font-bold px-4 py-2 rounded hover:bg-lime-500 transition-colors" disabled={!bid.bidAmount || !bid.bidQuantity || bid.bidQuantity > post.quantity || bid.bidAmount <= 0 || bid.bidQuantity <= 0 || (post.pricingType === "Fixed" && bid.bidAmount < post.pricePerUnit)}>Place Bid</button>
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="bg-green-950 text-white font-bold px-4 py-2 rounded hover:bg-green-800 transition-colors">Cancel</button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
