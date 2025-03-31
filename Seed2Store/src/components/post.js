import React, { useState, useEffect, useContext } from 'react'
import userlogo from '../images/user.png'
import Comments from './comments'
import CommentContext from '../context/comment/commentContext';
import UserContext from '../context/user/userContext';
import { Link } from 'react-router-dom';
import Bid from './bid';

export default function Post(props) {
    const { addComment, fetchComments } = useContext(CommentContext);
    const { user } = useContext(UserContext)

    const [showComments, setShowComments] = useState(false)
    const [comment, setComment] = useState('')
    const [comments, setComments] = useState([])
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(props.post.likes.includes(user.id));

    useEffect(() => {
        setLikes(props.post.likes.length);
    }, [props.post.likes]);

    const handleChange = (e) => {
        setComment(e.target.value)
    }

    const submitComment = () => {
        addComment(comment, props.post._id)
        setShowComments(!showComments)
    }

    const handleCommentShow = async () => {
        setShowComments(!showComments)
        const res = await fetchComments(props.post._id)
        setComments(res)
    }

    const handleLike = async () => {
        try {
            const endpoint = isLiked
                ? `http://localhost:5000/api/post/unlikepost/${props.post._id}`
                : `http://localhost:5000/api/post/likepost/${props.post._id}`;

            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                }
            });
            const res = await response.json()
            setLikes(res.likes);
            setIsLiked(!isLiked);
        } catch (error) {
            console.error("Error updating like status", error);
        }
    }

    const date_difference = () => {
        const date1 = new Date(props.post.createdAt);
        const now = new Date();
        const differenceInMs = now - date1;

        const seconds = Math.floor(differenceInMs / 1000);
        const minutes = Math.floor(differenceInMs / (1000 * 60));
        const hours = Math.floor(differenceInMs / (1000 * 60 * 60));
        const days = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

        if (seconds < 60)
            return `${seconds} seconds`;
        else if (minutes < 60)
            return `${minutes} minutes`;
        else if (hours < 24)
            return `${hours} hours`;
        else
            return `${days} days`;
    }

    const date_parser = () => {
        const fullDate = new Date(props.post.harvestDate);
        return fullDate.toISOString().split("T")[0];
    }

    return (
        <div className="w-full flex items-center justify-center p-5 mb-12">
            <div className="w-4/7 rounded-lg p-10 border-2 shadow-[3px_-2px_19px_13px_#00000024]">
                {/* User Info with Three-Dot Menu */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                        <img
                            src={
                                props.post.userId.profilepicture
                                    ? `http://localhost:5000/api/user/profilepicture/${props.post.userId._id}`
                                    : userlogo
                            }
                            alt="User Avatar"
                            className="w-10 h-10 rounded-full"
                        />
                        <div>
                            <Link to={`/profile/${props.post.userId.name}`}>
                                <h2 className="text-gray-800 text-2xl font-extrabold">
                                    {props.post.userId.name}
                                </h2>
                            </Link>
                            <p className="text-gray-500 text-sm">Posted {date_difference()} ago</p>
                        </div>
                    </div>
                    <div className="text-gray-500 cursor-pointer">
                        {/* Three-dot menu icon or Bid component */}
                        {props.profile ? (
                            <button className="hover:bg-gray-50 rounded-full p-1">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={24}
                                    height={24}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx={12} cy={7} r={1} />
                                    <circle cx={12} cy={12} r={1} />
                                    <circle cx={12} cy={17} r={1} />
                                </svg>
                            </button>
                        ) : (
                            <Bid post={props.post} />
                        )}
                    </div>
                </div>
                {/* Divider */}
                <div className="h-[2px] bg-gray-800 w-full my-4"></div>
                {/* Post Title */}
                <div className="mb-6">
                    <p className="font-bold text-lg text-gray-800">
                        {props.post.postTitle}
                    </p>
                </div>
                <div className="h-[2px] bg-gray-800 w-full my-4"></div>
                {/* Post Description */}
                <div className="mb-6">
                    <p className="text-gray-800">
                        {props.post.postDescription}
                    </p>
                </div>
                <div className='border-2 rounded-xl border-black p-4 mb-3'>
                    <div className="mb-6">
                        <h3 className="font-extrabold text-xl text-gray-800">Product Description</h3>
                        <div className="h-[2px] bg-gray-800 w-full my-4"></div>
                        <div className='flex justify-around'>
                            <div>
                                <p>Product name : {props.post.productName}</p>
                                <p>Product category : {props.post.category}</p>
                                <p>Product variety : {props.post.variety}</p>
                            </div>
                            <div>
                                <p>Product grade : {props.post.grade}</p>
                                <p>Harvest date : {date_parser()}</p>
                                <p>Shelf life : {props.post.shelfLife}</p>
                            </div>
                        </div>
                    </div>
                    <div className="mb-6">
                        <h3 className="font-extrabold text-xl text-gray-800">Product Pricing and Quantity</h3>
                        <div className="h-[2px] bg-gray-800 w-full my-4"></div>
                        <div className='flex justify-around'>
                            <div>
                                <p>Product quantity : {props.post.quantity}</p>
                                <p>Quantity unit : {props.post.unit}</p>
                            </div>
                            <div>
                                <p>Price per unit : {props.post.pricePerUnit}</p>
                                <p>Pricing type : {props.post.pricingType}</p>
                            </div>
                        </div>
                    </div>
                    {/* Dynamic Image */}
                    <div className="mb-4">
                        <img
                            src={`http://localhost:5000/api/post/getpostimage/${props.post._id}`}
                            alt="Dynamic Content"
                            className="h-auto object-contain rounded-md"
                            style={{ width: "580px" }}
                        />
                    </div>
                </div>
                {/* Like and Comment Section */}
                <div className="flex items-center justify-between text-gray-500">
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleLike}
                            className={`flex justify-center items-center gap-2 px-2 rounded-full p-1 ${isLiked ? "bg-red-500 text-white hover:bg-red-600" : "hover:bg-gray-100"
                                }`}
                        >
                            <svg
                                className="w-5 h-5 fill-current"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 21.35l-1.45-1.32C6.11 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-4.11 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                            <span>{isLiked ? "Unlike" : "Like"} ({likes})</span>
                        </button>
                    </div>
                    <button onClick={handleCommentShow} id='commentButton' className="flex justify-center items-center gap-2 px-2 hover:bg-gray-100 rounded-full p-1">
                        <svg
                            width="22px"
                            height="22px"
                            viewBox="0 0 24 24"
                            className="w-5 h-5 fill-current"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                            <g id="SVGRepo_iconCarrier">
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22ZM8 13.25C7.58579 13.25 7.25 13.5858 7.25 14C7.25 14.4142 7.58579 14.75 8 14.75H13.5C13.9142 14.75 14.25 14.4142 14.25 14C14.25 13.5858 13.9142 13.25 13.5 13.25H8ZM7.25 10.5C7.25 10.0858 7.58579 9.75 8 9.75H16C16.4142 9.75 16.75 10.0858 16.75 10.5C16.75 10.9142 16.4142 11.25 16 11.25H8C7.58579 11.25 7.25 10.9142 7.25 10.5Z"
                                />
                            </g>
                        </svg>
                        <span>Comments</span>
                    </button>
                </div>
                {showComments && (
                    <>
                        <hr className="mt-2 mb-2" />
                        <p className="text-gray-800 font-semibold">
                            <input
                                type="text"
                                placeholder='Comment'
                                value={comment}
                                onChange={handleChange}
                                className="border border-indigo-600 w-3/4 px-3 py-1 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:ring ease-linear transition-all duration-150"
                            />
                            <button onClick={submitComment} className="ml-4 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-1 px-4 border border-blue-700 rounded">
                                Comment
                            </button>
                        </p>
                        <div className="mt-4">
                            {comments.map((comment) => (
                                <Comments key={comment._id} comment={comment} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}