const express = require('express');
const router = express.Router();
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fetchUser = require("../middleware/fetchUser");


// Configure multer to store files in the 'uploads' directory
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Make sure this folder exists in your project root
    },
    filename: (req, file, cb) => {
        // Create a unique filename using the current timestamp and original extension
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
});
const upload = multer({ storage });

// Endpoint to update user profile details and profile picture
router.post('/updateProfile', fetchUser, upload.single('profilepicture'), async (req, res) => {
    // Extract userId, email, and type from the request.
    // In a real application, you would get the userId from an auth middleware.
    const { email, type } = req.body;
    const userId = req.user.id;

    try {
        // Build the fields to update
        const updateFields = { email, type };

        // If a file is uploaded, save its local path
        if (req.file) {
            updateFields.profilepicture = req.file.path;
        }

        // Update the user document
        const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(updatedUser);
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get('/profilepicture/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id)
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!user.profilepicture) {
            return res.status(404).json({ message: "Profile picture not set" });
        }
        // Get the absolute path of the file stored locally
        const absolutePath = path.resolve(user.profilepicture);
        return res.sendFile(absolutePath);
    } catch (error) {
        console.error("Error fetching profile picture:", error);
        return res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;
