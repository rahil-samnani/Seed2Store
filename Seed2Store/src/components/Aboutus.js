import React from 'react'
import logo from '../images/logo.png'

export default function Aboutus() {
    return (
        <div className='overflow-y-scroll h-screen' style={{backgroundColor : "#E4FFF0"}}>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>About Us - Seed2Store</title>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />

            <style dangerouslySetInnerHTML={{ __html: "\n        /* General Styling */\n        body {\n            font-family: 'Poppins', sans-serif;\n            margin: 0;\n            padding: 0;\n            background-color: #e8f5e9;\n            color: #2c3e50;\n        }\n        \n        /* Container Styling */\n        .container {\n            max-width: 850px;\n            margin: 50px auto;\n            background: white;\n            padding: 30px;\n            border-radius: 12px;\n            box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.15);\n            text-align: center;\n        }\n\n        h1 {\n            color: #1b5e20;\n            text-align: center;\n            font-size: 2.5rem;\n        }\n\n        h2 {\n            color: #2e7d32;\n            text-align: center;\n            font-size: 2rem;\n            margin-bottom: 15px;\n        }\n\n        p {\n            color: #555;\n            font-size: 1.1rem;\n            line-height: 1.8;\n            text-align: justify;\n        }\n\n        .highlight {\n            font-weight: bold;\n            color: #388e3c;\n        }\n\n        .underline {\n            width: 100px;\n            height: 4px;\n            background: #43a047;\n            margin: 8px auto 20px;\n            border-radius: 2px;\n        }\n\n        .cta-button {\n            display: inline-block;\n            margin-top: 20px;\n            padding: 12px 24px;\n            background-color: #2e7d32;\n            color: white;\n            font-size: 1.2rem;\n            border-radius: 25px;\n            text-decoration: none;\n            font-weight: bold;\n            transition: 0.3s ease;\n        }\n\n        .cta-button:hover {\n            background-color: #1b5e20;\n            transform: scale(1.05);\n        }\n\n        /* Added Styles */\n        .hero {\n            position: relative;\n            text-align: center;\n            margin-bottom: 30px;\n        }\n\n        .hero-image img {\n            max-width: 100%;\n            height: auto;\n            border-radius: 12px;\n            box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);\n        }\n\n        .hero-text {\n            position: absolute;\n            top: 50%;\n            left: 50%;\n            transform: translate(-50%, -50%);\n            color: white;\n            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);\n        }\n\n        .hero-text h2 {\n            font-size: 2.5rem;\n            margin-bottom: 10px;\n        }\n\n        .features {\n            display: flex;\n            justify-content: space-around;\n            margin-top: 30px;\n        }\n\n        .feature {\n            text-align: center;\n            width: 30%;\n        }\n\n        .feature i {\n            font-size: 3rem;\n            color: #43a047;\n            margin-bottom: 10px;\n        }\n    " }} />
            <div className="w-4/6 container">
                <div className="hero ">
                    <img src={logo} alt="Seed2Store" className='h-40 w-40' />
                    <div className="hero-text">
                        <h2>Connecting Farmers <br /> Directly to Buyers</h2>
                    </div>
                </div>
                <h1>About Seed2Store</h1>
                <p>
                    In today’s fast-evolving agricultural sector, farmers often struggle to receive fair prices for their produce due to multiple intermediaries.
                    Traditional agricultural markets are dominated by middlemen who take a significant share of the profit, leaving farmers with minimal returns.
                    On the other hand, buyers—including wholesalers, retailers, and consumers—face challenges in accessing fresh, high-quality produce directly from the source.
                </p>
                <p>
                    To tackle these challenges, <span className="highlight">Seed2Store</span> was created as a game-changing platform that provides <span className="highlight">Direct Market Access</span> for farmers, removing unnecessary intermediaries and enabling direct connections with buyers.
                    This digital marketplace promotes fairness, transparency, and greater reach for farmers, ensuring they receive the profits they deserve.
                </p>
                <div className="features">
                    <div className="feature">
                        <i className="fas fa-leaf" />
                        <h3>Fresh Produce</h3>
                        <p>Directly from the farm, ensuring quality and freshness.</p>
                    </div>
                    <div className="feature">
                        <i className="fas fa-handshake" />
                        <h3>Fair Trade</h3>
                        <p>Empowering farmers with better pricing and market access.</p>
                    </div>
                    <div className="feature">
                        <i className="fas fa-truck" />
                        <h3>Efficient Delivery</h3>
                        <p>Streamlined logistics for timely and reliable delivery.</p>
                    </div>
                </div>
                <h2>Our Mission</h2>
                <div className="underline" />
                <p>To build a sustainable, technology-driven agricultural marketplace that empowers farmers with <span className="highlight">fair trade opportunities</span>, while providing buyers with high-quality, fresh produce directly from the source.</p>
                <h2>Our Vision</h2>
                <div className="underline" />
                <p>To revolutionize the agri-commerce ecosystem by eliminating unnecessary middlemen, leveraging technology for efficiency, and creating a <span className="highlight">profitable and equitable</span> market for all stakeholders.</p>
                <a href="/" className="cta-button">Join Us Today</a>
            </div>
        </div>

    )
}
