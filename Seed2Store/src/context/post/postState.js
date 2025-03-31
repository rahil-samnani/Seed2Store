import { useState } from 'react';
import PostContext from './postContext';

const PostState = (props) => {
    const [mode, setMode] = useState('light');
    const [img, setImg] = useState('');
    const [post, setPost] = useState({
        postTitle: '',
        postDescription: '',
        productName: '',
        category: 'Others',
        variety: '',
        quantity: '',
        unit: 'kg',
        pricePerUnit: '',
        pricingType: 'Fixed',
        grade: '',
        harvestDate: '',
        shelfLife: '',
    });
    const [allPosts, setAllPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userPosts, setUserPosts] = useState([])

    //fetch user posts
    const fetchUserPosts = async (id) => {
        if (userPosts.length === 0) {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/api/post/getalluserposts/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': localStorage.getItem('token'),
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }

                const result = await response.json();
                setUserPosts(result);
                
                return Array.isArray(result) ? result : [];
            } catch (error) {
                console.error('Error fetching posts:', error);
                return [];
            } finally {
                setLoading(false);
            }
        }
    };

    // Fetch posts
    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/post/getallposts', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token'),
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }

            const result = await response.json();
            setAllPosts(result.posts);


        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    // Add post
    const addPost = async () => {
        const formData = new FormData();
        Object.keys(post).forEach((key) => {
            formData.append(key, post[key]);
        });
        if (img) {
            formData.append('image', img);
        }
        try {
            const response = await fetch('http://localhost:5000/api/post/createpost', {
                method: 'POST',
                body: formData,
                headers: {
                    'auth-token': localStorage.getItem('token'),
                },
            });

            if (!response.ok) {
                throw new Error('Failed to submit the form');
            }

            const result = await response.json();
            console.log('Form submitted successfully:', result);

            fetchPosts();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <PostContext.Provider
            value={{
                allPosts,
                setAllPosts,
                post,
                setPost,
                img,
                setImg,
                mode,
                setMode,
                addPost,
                fetchPosts,
                loading,
                fetchUserPosts,
                userPosts
            }}
        >
            {props.children}
        </PostContext.Provider>
    );
};

export default PostState;
