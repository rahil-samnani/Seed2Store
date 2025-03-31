import React, { useContext, useEffect, useState } from 'react'
import PostContext from '../context/post/postContext'
import { useParams } from 'react-router-dom'
import PostTracking from './PostTracking'
import BidTable from './bidTable'

export default function Dashboard() {

    const { name } = useParams()
    const { userPosts, fetchUserPosts } = useContext(PostContext)
    const [user, setUser] = useState({});

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/auth/getuserbyname/${name}`, {
                    headers: {
                        'auth-token': localStorage.getItem('token')
                    }
                });
                if (!response.ok) {
                    throw new Error("User not found");
                }
                const data = await response.json();
                setUser(data);
            } catch (err) {
                console.error(err.message);
            }
        }
        fetchUser()
        if (user._id) {
            fetchUserPosts(user._id)
        }
    }, [fetchUserPosts, name, user._id]);

    useEffect(() => {
        fetchUserPosts(localStorage.getItem('userId'));
    }, [userPosts, fetchUserPosts]);

    const date_parser = (d) => {
        const fullDate = new Date(d);
        return fullDate.toISOString().split("T")[0];
    }

    return (
        <>
            <div className="flex flex-col items-center overflow-y-auto h-screen" style={{backgroundColor : "#E4FFF0"}}>
                <div className="flex w-3/4 ">
                    <div className="flex-1 m-4">
                        {/*all bids*/}
                        <div className="bg-lime-400 p-4 rounded-md">
                            <h2 className="text-black text-3xl font-extrabold pb-4">
                                All Bids
                            </h2>
                            <div className="my-1" />
                            <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mb-6" />
                            {userPosts.length !== 0 && userPosts.map((p) => {
                                return (<div className='bg-white p-4 rounded-md my-14' key={p._id}>
                                    <div className="mb-6">
                                        <h3 className="font-extrabold text-xl text-gray-800">Product Description</h3>
                                        <div className="h-[2px] bg-gray-800 w-full my-4"></div>
                                        <div className='flex justify-around'>
                                            <div>
                                                <p>Product name : {p.productName}</p>
                                                <p>Product category : {p.category}</p>
                                                <p>Product variety : {p.variety}</p>
                                            </div>
                                            <div>
                                                <p>Product garde : {p.grade}</p>
                                                <p>Harvest date : {date_parser(p.harvestDate)}</p>
                                                <p>Shelf life : {p.shelfLife}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-8">
                                        <h3 className="font-extrabold text-xl text-gray-800">Product Pricing and Quantity</h3>
                                        <div className="h-[2px] bg-gray-800 w-full my-4"></div>
                                        <div className='flex justify-around'>
                                            <div>
                                                <p>Product quantity : {p.quantity}</p>
                                                <p>Quantity unit : {p.unit}</p>
                                            </div>
                                            <div>
                                                <p>Price per unit : {p.pricePerUnit}</p>
                                                <p>Pricing type : {p.pricingType}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <BidTable p={p} ></BidTable>
                                    <div className='w-full'><PostTracking currentStep={p.acceptedBidState} /></div>
                                </div>)
                            })}
                            {userPosts.length === 0 && <div>
                                no post to show
                            </div>}
                        </div>
                    </div>
                </div>
            </div >
        </>

    )
}
