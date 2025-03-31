import React from 'react'
import user from '../images/user.png'
import { Link } from 'react-router-dom'


export default function comments(props) {
    return (
        <div>
            <div className="flex items-center space-x-2">
                <img
                    src={
                        props.comment.author.profilepicture
                            ? `http://localhost:5000/api/user/profilepicture/${props.comment.author._id}`
                            : user
                    }
                    alt="User Avatar"
                    className="w-6 h-6 rounded-full"
                />
                <div>
                    <Link to={`/dashboard/${props.comment.author.name}`}><p className="text-gray-800 font-semibold">{props.comment.author.name}</p></Link>
                    <p className="text-gray-500 text-sm">{props.comment.content}</p>
                </div>
            </div>
            {/* Reply from John Doe with indentation 
                        <div className="flex items-center space-x-2 mt-2 ml-6">
                            <img
                                src={user}
                                alt="User Avatar"
                                className="w-6 h-6 rounded-full"
                            />
                            <div>
                                <p className="text-gray-800 font-semibold">John Doe</p>
                                <p className="text-gray-500 text-sm">
                                    That little furball is from a local shelter. You should check it
                                    out! 🏠😺
                                </p>
                            </div>
                        </div>*/}
        </div>
    )



}
