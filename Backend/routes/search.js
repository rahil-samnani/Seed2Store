const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");

router.get("/", async (req, res) => {
    try {
        const searchQuery = req.query.q;
        if (!searchQuery || searchQuery.trim() === "") {
            return res.status(400).json({ error: "Search query is required" });
        }

        const regex = new RegExp(searchQuery, "i"); // Case-insensitive fuzzy search

        // Search in Posts
        const posts = await Post.find({
            $or: [
                { productName: regex },
                { category: regex },
                { variety: regex },
                { postTitle: regex }
            ]
        }).populate('userId', 'name profilepicture').exec();

        // Search in Users
        const users = await User.find({
            $or: [
                { name: regex },
                { email: regex }
            ]
        }).select("-password"); // Exclude passwords from the response

        res.json({ posts, users });
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
