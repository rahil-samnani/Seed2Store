import React, { useContext, useEffect, useState } from 'react';
import BidContext from '../context/bid/bidContext';
import { useParams } from 'react-router-dom';
import OrderTracking from './OrderTracking';

export default function Acceptedbids() {
  const { name } = useParams();
  const { fetchUserBids, bids } = useContext(BidContext);
  const [user, setUser] = useState({});
  const [responseId, setResponseId] = useState("");
  const [responseState, setResponseState] = useState([]);

  const getTimeRemaining = (acceptedAt) => {
    if (!acceptedAt) return null;

    const now = new Date();
    const expirationTime = new Date(acceptedAt);
    expirationTime.setDate(expirationTime.getDate() + 2); // ✅ 2 days

    const timeDiff = expirationTime - now;
    if (timeDiff <= 0) return "Expired";

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m remaining`;
  };


  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createRazorpayOrder = async (amount, bidId) => {
    let data = JSON.stringify({ bidId, amount }); // ✅ Include bidId

    try {
      const response = await fetch('http://localhost:5000/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data,
      });

      const responseData = await response.json();
      console.log(responseData);

      if (!response.ok) throw new Error(responseData.message || "Order creation failed");

      handleRazorpayScreen(amount, responseData.order_id, bidId); // ✅ Pass bidId
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const handleRazorpayScreen = async (amount, orderId, bidId) => { // ✅ Pass bidId
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    const options = {
      key: "rzp_test_HYnZ9zuIDYdtK8",
      currency: "INR",
      name: "Seed2Store",
      description: "Payment",
      amount: amount * 100,
      image: "https://papayacoders.com/demo.png",
      order_id: orderId,
      handler: async (response) => {
        setResponseId(response.razorpay_payment_id);
        setResponseState(response.razorpay_signature);

        try {
          const verifyResponse = await fetch("http://localhost:5000/api/razorpay/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              bidId: bidId
            }),
          });

          const verifyData = await verifyResponse.json();
          console.log("Payment verification:", verifyData);

          if (verifyData.success) {
            alert("Payment Successful! Your bid is now confirmed.");
          } else {
            alert("Payment verification failed!");
          }
        } catch (error) {
          console.error("Error verifying payment:", error);
        }
      },
      prefill: {
        name: 'Seed2Store',
        email: 'seed2store@email.com',
      },
      theme: { color: "#3399cc" },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/auth/getuserbyname/${name}`, {
          headers: { 'auth-token': localStorage.getItem('token') },
        });

        if (!response.ok) throw new Error("User not found");

        const data = await response.json();
        setUser(data);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchUser();
    if (user._id) fetchUserBids(user._id);
  }, [fetchUserBids, name, user._id]);

  const confirmDelivery = async (bidId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bid/updateOrderState`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' , 'auth-token': localStorage.getItem('token') },
        body: JSON.stringify({ bidId, orderState: 'Delivered' })
      });
      const data = await response.json();
      if (response.ok) {
        alert("Order marked as Delivered!");
        fetchUserBids(user._id);
      } else {
        alert(data.message || "Failed to update order state");
      }
    } catch (error) {
      console.error("Error updating order state:", error);
    }
  };

  return (
    <div className="flex flex-col items-center overflow-y-auto h-screen" style={{backgroundColor : "#E4FFF0"}}>
      <div className="flex w-3/4">
        <div className="flex-1 m-4">
          <div className="bg-lime-400 p-4 rounded-md">
            <h2 className="text-black text-3xl font-extrabold pb-4">Placed Bids</h2>
            <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mb-6" />
            {bids.length !== 0 && bids.map((p) => {
              const timeRemaining = getTimeRemaining(p.acceptedAt);
              return (
                <div className='bg-white p-4 rounded-md my-14' key={p.postId._id}>
                  <h3 className="font-extrabold text-xl text-gray-800">Product Description</h3>
                  <div className="h-[2px] bg-gray-800 w-full my-4"></div>
                  <div className='flex justify-around'>
                    <div>
                      <p>Product name: {p.postId.productName}</p>
                      <p>Product category: {p.postId.category}</p>
                      <p>Product variety: {p.postId.variety}</p>
                    </div>
                    <div>
                      <p>Product grade: {p.postId.grade}</p>
                      <p>Harvest date: {new Date(p.postId.harvestDate).toISOString().split("T")[0]}</p>
                      <p>Shelf life: {p.postId.shelfLife}</p>
                    </div>
                  </div>
                  <h3 className="mt-6 font-extrabold text-xl text-gray-800">Product Pricing and Quantity</h3>
                  <div className="h-[2px] bg-gray-800 w-full my-4"></div>
                  <div className='flex justify-around'>
                    <div>
                      <p>Product quantity: {p.postId.quantity}</p>
                      <p>Quantity unit: {p.postId.unit}</p>
                    </div>
                    <div>
                      <p>Price per unit: {p.postId.pricePerUnit}</p>
                      <p>Pricing type: {p.postId.pricingType}</p>
                    </div>
                  </div>
                  <table className="border-collapse w-full table-auto text-sm bg-lime-100 rounded-lg my-5 mt-7">
                    <thead>
                      <tr className="text-sm leading-normal bg-gray-200">
                        <th className="py-2 px-4 border-b">Buyer Name</th>
                        <th className="py-2 px-4 border-b">Bid Amount</th>
                        <th className="py-2 px-4 border-b">Bid Quantity</th>
                        <th className="py-2 px-4 border-b">Bid Status</th>
                        {p.bidState === "Accepted" && <th className="py-2 px-4 border-b">Payment</th>}
                        {p.bidState === "Dispatched" && <th className="py-2 px-4 border-b">Delivery</th>}
                      </tr>
                    </thead>
                    <tbody>
                      <tr key={p._id} className="hover:bg-gray-100">
                        <td className="py-2 px-4 border-b text-center">{p.userId?.name || "Unknown"}</td>
                        <td className="py-2 px-4 border-b text-center">{p.bidAmount}</td>
                        <td className="py-2 px-4 border-b text-center">{p.bidQuantity}</td>
                        <td className="py-2 px-4 border-b text-center">{p.bidState}</td>
                        {p.bidState === "Accepted" ? (
                          timeRemaining !== "Expired" ? (
                            <td className="py-2 px-4 border-b text-center">
                              <button
                                className="bg-lime-500 text-white px-2 py-1 rounded mt-2"
                                onClick={() => createRazorpayOrder(p.bidAmount * p.bidQuantity, p._id)}
                              >
                                Pay
                              </button>
                              <p className="text-sm text-gray-600">{timeRemaining}</p>
                            </td>
                          ) : (
                            <td className="text-red-500 font-bold text-center">Expired</td>
                          )
                        ) : null}
                        {p.bidState === "Dispatched" ? (
                          <td className="py-2 px-4 border-b text-center">
                            <button
                              className="bg-green-500 text-white px-2 py-1 rounded mt-2"
                              onClick={() => confirmDelivery(p._id)}
                            >
                              Confirm Delivery
                            </button>
                          </td>
                        ) : null}
                      </tr>
                    </tbody>
                  </table>
                  <div className='w-full'><OrderTracking currentStep={p.bidState} /></div>
                </div>
              )
            })}
            {bids.length === 0 && <div>No Bids Placed yet...</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
