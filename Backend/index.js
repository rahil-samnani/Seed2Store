const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");
const User = require("./models/User");
const Post = require("./models/Post");

require("./cronJobs/bidExpiry");

connectToMongo();

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Available Routes
app.use('/api/auth', require("./routes/auth"));
app.use('/api/post', require("./routes/post"));
app.use('/api/comment', require("./routes/comment"));
app.use('/api/bid', require("./routes/bids"));
app.use('/api/razorpay', require("./routes/razorpay"));
app.use('/api/chat', require("./routes/chat"));
app.use('/api/user', require("./routes/user"));
app.use('/api/search', require("./routes/search"));


app.listen(port, () => {
    console.log(`Seed2Store Backend running on port ${port}`);
});