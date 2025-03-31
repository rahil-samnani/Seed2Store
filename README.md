# Seed2Store

Seed2Store is a MERN stack web application that connects farmers and buyers, allowing buyers to place bids on agricultural products and farmers to negotiate and finalize deals.

## Features
- **User Authentication**: Secure login/signup using JWT authentication.
- **Product Listings**: Farmers can list products with details like variety, grade, certification, and pricing.
- **Bidding System**: Buyers can place bids on listed products, specifying quantity and bid amount.
- **Chat System**: Buyers and farmers can negotiate bids via an inbuilt chat system.
- **Search & Filtering**: Case-insensitive, partial matching search functionality.

## Tech Stack
- **Frontend**: React.js (with hooks, React Router)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT-based authentication
- **Payment Gateway**: Razorpay (for processing transactions)

## Installation
### Prerequisites
- Node.js & npm
- MongoDB (local or cloud-based)

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/Seed2Store.git
   cd Seed2Store
   ```
2. Install dependencies for both client and server:
   ```sh
   cd client && npm install
   cd ../server && npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the `server` directory and add:
     ```sh
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_secret_key
     RAZORPAY_KEY=your_razorpay_key
     ```
4. Start the backend server:
   ```sh
   cd server && npm start
   ```
5. Start the frontend:
   ```sh
   cd client && npm start
   ```
6. Open the app in your browser at `http://localhost:3000`.

## Contributing
Feel free to fork this repository and submit pull requests.

## License
This project is licensed under the MIT License.

---
Made with ❤️ by Seed2Store Team
