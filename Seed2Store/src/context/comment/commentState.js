import { useState } from 'react';
import CommentContext from './commentContext';

const CommentState = (props) => {
    const [comment,setComment] = useState("")

    // add a comment
    const addComment= async (content, postid) => {
        try{
            const response = await fetch('http://localhost:5000/api/comment/createcomment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    content: content,
                    post: postid,
                })
            });
            if (!response.ok) {
                throw new Error('Failed to submit the form');
            }
        }
        catch(error){
            console.error('Error submitting form:', error);
        }
    }

    //fetch all comments
    const fetchComments = async (id) => {
        try{
            const response = await fetch(`http://localhost:5000/api/comment/getcomment/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                }
            });
            if (!response.ok) {
                throw new Error('Failed to submit the form');
            }
            const result = await response.json();
            return result
        }
        catch(error){
            console.error('Error submitting form:', error);
        }
    }

    return (
        <CommentContext.Provider value={{comment, setComment, addComment, fetchComments}}>
            {props.children}
        </CommentContext.Provider>
    )
}

export default CommentState