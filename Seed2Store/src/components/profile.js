import React, { useState, useEffect, useContext } from 'react';
import userlogo from '../images/profile-3x3.png';
import cover from '../images/cover.jpg';
import { useParams } from 'react-router-dom';
import PostContext from '../context/post/postContext';
import Post from './post';
import ProfileEditModal from './ProfileEditModal';

export default function Dashboard() {
    const { name } = useParams();
    const { fetchUserPosts, userPosts } = useContext(PostContext);
    const [user, setUser] = useState({});
    const [error, setError] = useState(false);
    const [sameUser, setSameUser] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://kit.fontawesome.com/45d9f606a8.js";
        script.crossOrigin = "anonymous";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/auth/getuserbyname/${name}`, {
                    headers: { "auth-token": localStorage.getItem("token") }
                });
                if (!response.ok) throw new Error("User not found");
                const data = await response.json();
                setUser(data);
            } catch (err) {
                console.error(err.message);
                setError(true);
            }
        };

        fetchUser();
        if (localStorage.getItem("name") === user.name) setSameUser(true);
        fetchUserPosts(user._id)
    }, [fetchUserPosts, name, user._id, user.name]);

    const date_parser = () => {
        if (user.date) {
            const fullDate = new Date(user.date);
            return fullDate.toISOString().split("T")[0];
        }
        return null;
    };

    return (
        <>
            {!error && (
                <section className="flex-col flex-1 items-center justify-center h-screen overflow-y-auto" style={{ backgroundColor: "#E4FFF0" }}>
                    <div className="flex flex-col">
                        <img
                            src={cover}
                            alt="User Cover"
                            className="w-full xl:h-[14rem] lg:h-[13rem] md:h-[12rem] sm:h-[11rem] xs:h-[11rem]"
                        />

                        <div className="sm:w-[80%] xs:w-[90%] mx-auto flex items-center relative">
                            <img

                                src={
                                    user.profilepicture
                                        ? `http://localhost:5000/api/user/profilepicture/${user._id}`
                                        : userlogo
                                }
                                alt="User Profile"
                                className="bg-white rounded-md lg:w-[12rem] lg:h-[12rem] md:w-[10rem] md:h-[10rem] sm:w-[8rem] sm:h-[8rem] xs:w-[7rem] xs:h-[7rem] outline outline-2 outline-offset-2 outline-blue-500 relative lg:bottom-[5rem] sm:bottom-[4rem] xs:bottom-[3rem]"
                            />

                            {/* Only allow the user to edit if they are viewing their own profile */}
                            {sameUser && (
                                <i
                                    className="fa-solid fa-user-pen relative p-4 hover:text-green-400 cursor-pointer"
                                    onClick={() => setIsModalOpen(true)}
                                ></i>
                            )}

                            <h1 className="w-full text-left my-4 sm:mx-4 xs:pl-4 text-gray-800 lg:text-5xl md:text-4xl sm:text-3xl xs:text-2xl font-extrabold">
                                {user.name}
                            </h1>
                        </div>

                        {/* Additional user details and posts */}
                        <div className="xl:w-[80%] lg:w-[90%] md:w-[90%] sm:w-[92%] xs:w-[90%] mx-auto flex flex-col gap-4 items-center relative lg:-top-8 md:-top-6 sm:-top-4 xs:-top-4">
                            {/* Detail Section */}
                            <div className="w-full my-auto py-6 flex flex-col justify-center gap-2">
                                <div className="w-full flex sm:flex-row xs:flex-col gap-2 justify-center">
                                    <div className="w-full">
                                        <dl className="text-gray-900 divide-y divide-gray-900">
                                            <div className="flex flex-col pb-3">
                                                <dt className="mb-1 text-gray-500 md:text-lg">User Name</dt>
                                                <dd className="text-lg font-semibold">{user.name}</dd>
                                            </div>
                                            <div className="flex flex-col py-3">
                                                <dt className="mb-1 text-gray-500 md:text-lg">Date Of Joining</dt>
                                                <dd className="text-lg font-semibold">{date_parser()}</dd>
                                            </div>
                                        </dl>
                                    </div>
                                    <div className="w-full">
                                        <dl className="text-gray-900 divide-y divide-gray-900">
                                            <div className="flex flex-col pb-3">
                                                <dt className="mb-1 text-gray-500 md:text-lg">Email</dt>
                                                <dd className="text-lg font-semibold"><a href={`mailto:${user.email}`}>{user.email}</a></dd>
                                            </div>
                                            <div className="flex flex-col py-3">
                                                <dt className="mb-1 text-gray-500 md:text-lg">User Type</dt>
                                                <dd className="text-lg font-semibold">{user.type}</dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>
                                <div className="my-10 w-full">
                                    <div className="w-full font-extrabold px-4 sticky top-0 pr-2 lg:text-3xl bg-opacity-30 backdrop-blur-md">
                                        <h2 className='pt-7 pb-2'>Your Posts</h2>
                                        <div className="h-[2px] bg-gray-800 w-full my-4"></div>
                                    </div>
                                    <div className="w-full flex flex-col gap-6 justify-center items-center">
                                        {userPosts.length !== 0 ? (
                                            userPosts.map((post) => (
                                                <Post key={post.images.filename} post={post} profile={true} />
                                            ))
                                        ) : (
                                            <div>No Posts to display....</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {error && <h1>404 Not found</h1>}

            {isModalOpen && <ProfileEditModal user={user} onClose={() => setIsModalOpen(false)} />}
        </>
    );
}
