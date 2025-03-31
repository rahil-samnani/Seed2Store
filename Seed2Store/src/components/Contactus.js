import React from 'react'
import logo from '../images/logo.png'

export default function Contactus() {
    return (
        <div className='h-screen overflow-y-auto' style={{backgroundColor : "#E4FFF0"}}>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Contact Us</title>
            <style dangerouslySetInnerHTML={{ __html: "\n        /* General Styling */\n        body {\n            font-family: 'Poppins', sans-serif;\n            margin: 0;\n            padding: 0;\n            background-color: #f0f9f4; /* Light off-white green */\n            color: #333;\n        }\n\n        .container {\n            max-width: 900px; /* Increased width for two-column layout */\n            margin: 50px auto;\n            background: white;\n            padding: 30px;\n            border-radius: 12px;\n            box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.1);\n            display: flex; /* Use flexbox for layout */\n            justify-content: space-between; /* Space items evenly */\n        }\n\n        .contact-info {\n            width: 40%; /* Left column width */\n            text-align: left;\n        }\n\n        .contact-form {\n            width: 55%; /* Right column width */\n        }\n\n        h1 {\n            color: #2e7d32; /* Medium Green */\n            text-align: left; /* Align to the left */\n            margin-bottom: 20px;\n        }\n\n        label {\n            display: block;\n            margin-bottom: 8px;\n            font-weight: 500;\n            color: #444;\n        }\n\n        input[type=\"text\"],\n        input[type=\"email\"],\n        textarea {\n            width: 100%;\n            padding: 12px;\n            border: 1px solid #ccc;\n            border-radius: 8px;\n            box-sizing: border-box;\n            margin-bottom: 20px;\n            font-family: 'Poppins', sans-serif;\n        }\n\n        textarea {\n            height: 150px;\n            resize: vertical;\n        }\n\n        .button {\n            background-color: #4caf50; /* Green */\n            color: white;\n            padding: 12px 20px;\n            border: none;\n            border-radius: 8px;\n            cursor: pointer;\n            font-size: 1rem;\n            font-weight: 600;\n            transition: background-color 0.3s ease;\n        }\n\n        .button:hover {\n            background-color: #45a049;\n        }\n\n        .success-message {\n            background-color: #d4edda;\n            color: #28a745;\n            padding: 15px;\n            margin-top: 20px;\n            border: 1px solid #c3e6cb;\n            border-radius: 8px;\n            display: none; /* Hidden by default */\n        }\n\n        .logo {\n            font-size: 1.5rem;\n            color: #2e7d32;\n            font-weight: 600;\n            text-decoration: none;\n        }\n\n        .logo:hover {\n            color: #1b5e20;\n        }\n\n        .contact-details {\n            margin-top: 20px;\n            text-align: left;\n        }\n\n        .contact-details p {\n            margin-bottom: 5px;\n        }\n    " }} />
            <div className="container">
                <div className="contact-info">
                    <a href="/" className="logo">
                        <img src={logo} alt="Seed2Store Logo" style={{ height: 250, verticalAlign: 'middle', marginRight: 250, paddingLeft: 50, paddingRight: 50 }} />
                    </a>
                    <div className="contact-details">
                        <p>Contact us for any doubt or queries.</p>
                        <p><strong>Phone:</strong> +91-1234567890</p>
                        <p><strong>Phone:</strong> +91-9876543210</p>
                        <p><strong>Email:</strong> contactus@seed2store.com</p>
                        <p><strong>Address:</strong> 123 GCET Ghugrawala k baaju mein fezu bhai mil jaayenge unko puchna office tak chhod jaayenge</p>
                    </div>
                </div>
                <div className="contact-form">
                    <h1>Contact Us</h1>
                    <form id="contactForm">
                        <label htmlFor="name">Your Name</label>
                        <input type="text" id="name" name="name" placeholder="Enter your name" required />
                        <label htmlFor="email">Your Email</label>
                        <input type="email" id="email" name="email" placeholder="Enter your email" required />
                        <label htmlFor="subject">Subject</label>
                        <input type="text" id="subject" name="subject" placeholder="Enter the subject" />
                        <label htmlFor="message">Your Message</label>
                        <textarea id="message" name="message" placeholder="Enter your message" required defaultValue={""} />
                        <button className='button' type="submit">Send Message</button>
                        <div className="success-message" id="successMessage">
                            Thank you! Your message has been sent.
                        </div>
                    </form>
                </div>
            </div>
        </div>

    )
}
