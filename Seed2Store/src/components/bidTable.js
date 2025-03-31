import React, { useContext, useEffect, useState } from 'react';
import BidContext from '../context/bid/bidContext';
import PostContext from '../context/post/postContext';

export default function BidTable({ p }) {
    const { getBid, acceptBid, rejectBid } = useContext(BidContext);
    const { fetchUserPosts } = useContext(PostContext)
    const [bid, setBid] = useState([]);
    const [state, setState] = useState(null);
    const [message, setMessage] = useState("No Bids Yet");

    useEffect(() => {
        const fetchBids = async () => {
            const result = await getBid(p._id);
            setState(result.success);
            if (!result.success) {
                setMessage(result.message);
                setBid([result.acceptedBid]);
            } else {
                setBid(result.bids);
            }
        };
        fetchBids();
    }, [getBid, p._id]);

    useEffect(() => {
        fetchUserPosts(localStorage.getItem('userId'));
    }, [fetchUserPosts, p.acceptedBidState]);

    const acceptaBid = async (id) => {
        await acceptBid(id);
        const result = await getBid(p._id);
        setState(result.success);
        if (!result.success) {
            setMessage(result.message);
            setBid([result.acceptedBid]);
        } else {
            setBid(result.bids);
        }
        fetchUserPosts(localStorage.getItem('userId'));
    };

    const rejectaBid = async (id) => {
        await rejectBid(id);
        const result = await getBid(p._id);
        setState(result.success);
        if (!result.success) {
            setMessage(result.message);
            setBid([result.acceptedBid]);
        } else {
            setBid(result.bids);
        }
    };

    // New function to dispatch a bid
    const dispatchBid = async (id) => {
        try {
            const res = await fetch("http://localhost:5000/api/bid/updateOrderState", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("token"),
                },
                body: JSON.stringify({ bidId: id, orderState: "Dispatched" }),
            });
            const data = await res.json();
            if (data.message) {
                alert(data.message);
            }
            // Refresh bids after updating the state
            const result = await getBid(p._id);
            setState(result.success);
            if (!result.success) {
                setMessage(result.message);
                setBid([result.acceptedBid]);
            } else {
                setBid(result.bids);
            }
            fetchUserPosts(localStorage.getItem('userId'));
        } catch (error) {
            console.error("Error dispatching bid:", error);
        }
    };

    // Determine if any bid has bidState === "Paid"
    const showDispatchColumn = bid.some(b => b.bidState === "Paid" || b.bidState === "Dispatched");

    return (
        <>
            <table className="border-collapse w-full table-auto text-sm bg-lime-200 rounded-lg">
                <thead>
                    <tr className="text-sm leading-normal bg-gray-200">
                        <th className="py-2 px-4 border-b">Buyer Name</th>
                        <th className="py-2 px-4 border-b">Bid Amount</th>
                        <th className="py-2 px-4 border-b">Bid Quantity</th>
                        {state && <th className="py-2 px-4 border-b">Accept/Reject</th>}
                        {showDispatchColumn && <th className="py-2 px-4 border-b">Dispatch</th>}
                    </tr>
                </thead>
                <tbody>
                    {bid.length > 0 ? (
                        bid.map((b) => (
                            <tr key={b._id} className="hover:bg-gray-100">
                                <td className="py-2 px-4 border-b text-center">{b.userId?.name || "Unknown"}</td>
                                <td className="py-2 px-4 border-b text-center">{b.bidAmount}</td>
                                <td className="py-2 px-4 border-b text-center">{b.bidQuantity}</td>
                                {state && (
                                    <td className="py-2 px-4 border-b text-center">
                                        <button className="bg-green-500 text-white px-2 py-1 rounded mr-2" onClick={() => acceptaBid(b._id)}>Accept</button>
                                        <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => rejectaBid(b._id)}>Reject</button>
                                    </td>
                                )}
                                {showDispatchColumn && (
                                    <td className="py-2 px-4 border-b text-center">
                                        {b.bidState === "Paid" && (
                                            <button
                                                className="bg-green-500 text-white px-2 py-1 rounded"
                                                onClick={() => dispatchBid(b._id)}
                                            >
                                                Order Dispatched
                                            </button>
                                        )}
                                        {b.bidState === "Dispatched" && (
                                            <span className="text-green-600 font-bold">Dispatched</span>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={state ? (showDispatchColumn ? "5" : "4") : "3"} className="py-2 px-4 text-center text-gray-500">
                                {message}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );
}
