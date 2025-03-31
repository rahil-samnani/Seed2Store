import { useState } from 'react';
import UserContext from './userContext';

const UserState = (props) => {
    const [user, setUser] = useState({
        name : '',
        email : '',
        type : '',
        id  : ''
    })

    const getUserDetails = async () => {
        try{
            const response = await fetch('http://localhost:5000/api/auth/getuser' , {
                method : 'POST',
                headers : {
                    'Content-Type' : "application/json",
                    'auth-token' : localStorage.getItem('token')
                }
            })
            if(response.ok){
                const result = await response.json()
                setUser({name : result.name, email : result.email, type : result.type, id : result._id})
                localStorage.setItem('name', result.name)
            }
            else{
                console.log('error fetching info')
            }
        }
        catch(error){
            console.error(error)
        }
    }
    getUserDetails()

    return (
        <UserContext.Provider
            value={{user, getUserDetails}}
        >
            {props.children}
        </UserContext.Provider>
    );
}

export default UserState