const express = require("express");
const router = express.Router();
const Post = require('../models/Post')
const User = require('../models/User')
const Bid = require('../models/Bid')
const Message = require("../models/Message");
const { check, validationResult } = require('express-validator')
const fetchUser = require("../middleware/fetchUser");


// Place or update a bid using PUT @ /api/bid/placebid. LOGIN REQUIRED
router.put('/placebid', fetchUser,
    check("bidAmount").isNumeric().withMessage('Enter a valid bid Amount'),
    check("bidQuantity").isNumeric().withMessage('Enter a valid bid Quantity'),
    check('postId').isMongoId().withMessage('Enter valid post ID'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { postId, bidAmount, bidQuantity } = req.body;
            const buyerId = req.user.id;

            // Check if a bid already exists for this post by the same user
            let existingBid = await Bid.findOne({ userId: buyerId, postId });

            if (existingBid) {
                // If a bid exists, update it with the new bid values
                existingBid.bidAmount = bidAmount;
                existingBid.bidQuantity = bidQuantity;
                existingBid.date = new Date();
                await existingBid.save();

                return res.status(200).json({
                    success: true,
                    bid: existingBid,
                    message: "Bid updated successfully."
                });
            }

            // Create and save the new bid
            const newBid = new Bid({
                userId: buyerId,
                postId,
                bidAmount,
                bidQuantity,
            });
            await newBid.save();

            // Retrieve post details along with the seller information
            const post = await Post.findById(postId).populate("userId", "name");
            if (!post) {
                return res.status(404).json({ success: false, error: "Post not found" });
            }

            // Compose the initial message text with bid and post details
            const messageContent = `New Bid Placed:
    Bid Amount: ${bidAmount}
    Bid Quantity: ${bidQuantity}
    Product: ${post.postTitle}
    Description: ${post.postDescription}`;

            // Create a message from the buyer (bid placer) to the seller (post owner)
            const newMessage = new Message({
                senderId: buyerId,
                receiverId: post.userId._id,
                postId,
                bidId: newBid._id,
                message: messageContent,
            });
            await newMessage.save();

            res.status(201).json({
                success: true,
                bid: newBid,
                message: "Bid placed and initial message sent."
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
);


//get all bids for a particular post using GET @ api/bid/getpostbid .LOGIN REQUIERED
router.post('/getpostbid', fetchUser,
    check('postId').isMongoId().withMessage('Enter valid post id'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { postId } = req.body;
            const post = await Post.findById(postId);

            if (!post) {
                return res.status(404).json({ success: false, error: "No such post found" });
            }

            // Check if any bid is in the accepted
            const nonPendingBid = await Bid.findOne({
                postId,
                bidState: { $nin: ["Pending", "Rejected"] } 
            }).populate('userId', 'name').exec();

            // If a finalized bid exists, return only that bid.
            if (nonPendingBid) {
                return res.status(200).json({
                    success: false,
                    message: "A bid has already been finalized for this post, please check bids page for more details",
                    acceptedBid: nonPendingBid
                });
            }

            // Otherwise, return all pending bids.
            const bids = await Bid.find({ postId, bidState: "Pending" })
                .populate('userId', 'name')
                .exec();

            res.json({ success: true, bids: bids });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Some error occurred" });
        }
    }
);

//accept a bid using POST @api/bid/acceptbid . LOGIN Required 
router.post("/acceptbid", fetchUser, async (req, res) => {
    try {
        const { bidId } = req.body;
        const userId = req.user.id;

        // Find the bid
        const bid = await Bid.findById(bidId);
        if (!bid) {
            return res.status(404).json({ success: false, message: "Bid not found." });
        }

        // Find the related post
        const post = await Post.findById(bid.postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found." });
        }

        // Ensure only the post owner can accept bids
        if (post.userId.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized. Only the post owner can accept bids." });
        }

        // Update bid state to "Accepted"
        const updatedBid = await Bid.findByIdAndUpdate(
            bidId,
            { bidState: "Accepted", acceptedAt: new Date() },
            { new: true }
        );

        if (!updatedBid) {
            return res.status(500).json({ success: false, message: "Failed to update bid state." });
        }

        // Update the post with the accepted bid ID and bid state
        const updatedPost = await Post.findByIdAndUpdate(
            bid.postId,
            { acceptedBidId: bidId, acceptedBidState: "Accepted" },  // ✅ Updating state
            { new: true }
        );

        if (!updatedPost) {
            return res.status(500).json({ success: false, message: "Failed to update post with accepted bid." });
        }

        res.json({ success: true, message: "Bid accepted successfully.", updatedBid, updatedPost });

    } catch (error) {
        console.error("Error accepting bid:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});


//reject a bid using PUT @api/bid/acceptbid . LOGIN Required
router.delete('/rejectbid', fetchUser,
    check('bidId').isMongoId().withMessage('Enter valid bid id'),
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }
        else {
            try {
                const { bidId } = req.body
                const bid = await Bid.findById(bidId)
                if (!bid) {
                    return res.status(404).json({ success: false, error: "no such bid found" })
                }
                bid.bidState = "Rejected"
                await bid.save()
                res.json({ success: true, message: "Bid Rejected" })
            }
            catch (error) {
                console.error(error.message)
                res.status(500).json({ error: "Some Error Occured" })
            }
        }
    })

// Get all bids placed by a specific user using GET @ /api/bid/getuserbids. LOGIN REQUIRED
router.post('/getuserbids', fetchUser, async (req, res) => {
    try {
        const { userId } = req.body
        const userBids = await Bid.find({ userId: userId })
            .populate('postId', 'productName category variety quantity unit pricePerUnit pricingType harvestDate shelfLife grade userId').populate('userId', 'name')
            .exec();

        if (!userBids.length) {
            return res.status(404).json({ success: false, message: "No bids found for this user" });
        }

        res.json({ success: true, bids: userBids });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Some error occurred" });
    }
});

router.post("/updateOrderState", fetchUser, async (req, res) => {
    try {
        const { bidId, orderState } = req.body;
        if (!bidId || !orderState) {
            return res.status(400).json({ message: "Missing bidId or orderState" });
        }

        // Fetch the bid first
        const bid = await Bid.findById(bidId);
        if (!bid) {
            return res.status(404).json({ message: "Bid not found" });
        }

        // Fetch the associated post
        const post = await Post.findById(bid.postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // If bid is accepted, deduct quantity from the post
        let updatedQuantity = post.quantity;
        if (orderState === "Accepted") {
            if (post.quantity < bid.bidQuantity) {
                return res.status(400).json({ message: "Insufficient stock in post" });
            }
            updatedQuantity -= bid.bidQuantity;
        }

        // Update the bid state
        const updatedBid = await Bid.findByIdAndUpdate(
            bidId,
            { bidState: orderState },
            { new: true }
        );

        // Update the post with the new bid state and quantity
        const updatedPost = await Post.findByIdAndUpdate(
            post._id,
            { 
                acceptedBidState: orderState, 
                quantity: updatedQuantity 
            },
            { new: true }
        );

        res.json({ message: "Order state updated successfully", bid: updatedBid, post: updatedPost });
    } catch (error) {
        console.error("Error updating order state:", error);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;