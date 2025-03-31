import { useState } from 'react';
import BidContext from './bidContext';

const BidState = (props) => {
    const [bid, setBid] = useState({ bidAmount: 0, bidQuantity: 0 })
    const [bids, setBids] = useState([]);

    const placeBid = async (postId) => {
        try {
            const response = await fetch('http://localhost:5000/api/bid/placebid', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    bidAmount: bid.bidAmount,
                    bidQuantity: bid.bidQuantity,
                    postId: postId,
                })
            });
            if (!response.ok) {
                throw new Error('Failed to submit the form');
            }
        }
        catch (error) {
            console.error('Error submitting form:', error);
        }
    }

    const getBid = async (postId) => {
        try {
            const response = await fetch('http://localhost:5000/api/bid/getpostbid', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    postId: postId,
                })
            });
            if (!response.ok) {
                throw new Error('Failed to submit the form');
            }
            else {
                const data = await response.json()
                return data
            }
        }
        catch (error) {
            console.error('Error submitting form:', error);
        }
    }

    const acceptBid = async (bidId) => {
        try {
            const res = await fetch("http://localhost:5000/api/bid/acceptbid", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify({ bidId })
            });
            const data = await res.json();
            console.log("Accept response:", data);
        } catch (error) {
            console.error("Error accepting bid:", error);
        }
    };

    const rejectBid = async (bidId) => {
        try {
            const res = await fetch("http://localhost:5000/api/bid/rejectbid", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    'auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify({ bidId })
            });
            const data = await res.json();
            console.log("Reject response:", data);
        } catch (error) {
            console.error("Error rejecting bid:", error);
        }
    };

    const fetchUserBids = async (userId) => {
        try {
            const response = await fetch("http://localhost:5000/api/bid/getuserbids", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("token")
                },
                body: JSON.stringify({ userId })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch bids");
            }
            setBids(data.bids);
        } catch (err) {
            console.error(err.message);
        }
    }

    return (
        <BidContext.Provider value={{ placeBid, getBid, bid, setBid, acceptBid, rejectBid, fetchUserBids, bids }}>
            {props.children}
        </BidContext.Provider>
    )
}

export default BidState