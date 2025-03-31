import React, { useState } from 'react'
import logo from '../images/logo.png'
import background from '../images/bg.jpg'
import { Link, useNavigate } from 'react-router-dom'

export default function ForgotPassword() {

    const navigate = useNavigate()

    const [credential, setCredentials] = useState({
        email: '',
        password: '',
        cpassword: ''
    })

    const handleCredentialChange = (event) => {
        setCredentials({
            ...credential,
            [event.target.name]: event.target.value
        })
    }

    const handleForgotPassword = async () => {
        if (credential.password !== credential.cpassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/forgotpassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: credential.email,
                    password: credential.password,
                    confirmPassword: credential.cpassword
                })
            })
            const result = await response.json()
            if (result.success) {
                alert('Password reset successful')
                navigate('/login')
            }
            else {
                alert(result.error || "Something went wrong")
            }
        }
        catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="font-[sans-serif] bg-gradient-to-r from-green-900 via-green-500 to-lime-800 text-gray-800" style={{ backgroundImage: `url(${background})` }}>
            <div className="min-h-screen flex flex-col items-center justify-center">
                <div className="flex items-center gap-10 w-full">
                    <div className='self-start w-1/2'>
                        <div className='flex mx-auto w-full'>
                            <a href="/"><img src={logo} alt="logo" className='inline-block h-5/6 mx-48' /></a>
                        </div>
                    </div>

                    <form className="bg-white rounded-l-full px-6 py-8 space-y-10 w-2/4 h-screen self-end flex flex-col items-center">
                        <h3 className="text-4xl font-extrabold mt-16 text-lime-600 text-left">FORGOT PASSWORD</h3>
                        <div className="h-[2px] bg-lime-600 w-4/6 mx-auto"></div>

                        <div className="space-y-4 w-full flex-col items-center justify-center my-8">
                            <div className='flex flex-col items-center justify-center'>
                                <input onChange={handleCredentialChange} name="email" type="email" required className="border-lime-400 border-2 font-bold bg-gray-100 focus:bg-transparent w-4/6 text-sm px-4 py-3.5 rounded-md outline-gray-800" placeholder="Email address" />
                            </div>
                            <div className='flex flex-col items-center justify-center'>
                                <input onChange={handleCredentialChange} name="password" type="password" required className="border-lime-400 border-2 font-bold bg-gray-100 focus:bg-transparent w-4/6 text-sm px-4 py-3.5 rounded-md outline-gray-800" placeholder="New Password" />
                            </div>
                            <div className='flex flex-col items-center justify-center'>
                                <input onChange={handleCredentialChange} name="cpassword" type="password" required className="border-lime-400 border-2 font-bold bg-gray-100 focus:bg-transparent w-4/6 text-sm px-4 py-3.5 rounded-md outline-gray-800" placeholder="Confirm New Password" />
                            </div>
                        </div>
                        <div className='w-full flex justify-center '>
                            <button onClick={handleForgotPassword} type="button" className="w-4/6 shadow-xl py-3 px-6 text-lg font-semibold rounded-md text-white bg-gray-800 hover:bg-[#222] focus:outline-none">
                                Reset Password
                            </button>
                        </div>
                        <p className='text-sm'>Do not have an account ? <Link to="/signup" className='text-indigo-600 underline'>Sign up</Link></p>
                    </form>
                </div>
            </div>
        </div>
    )
}
