const mongoose = require("mongoose");
const Bid = require("../models/Bid");

// Run every hour
const checkExpiredBids = async () => {
    try {
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2); // ✅ 2 days ago

        // Find all bids that are accepted but not paid & expired
        const expiredBids = await Bid.find({
            bidState: "Accepted",
            acceptedAt: { $lt: twoDaysAgo }
        });

        for (const bid of expiredBids) {
            await Bid.findByIdAndDelete(bid._id); // ✅ Delete expired bid
            console.log(`Bid ${bid._id} expired and has been deleted.`);
        }
    } catch (error) {
        console.error("Error checking expired bids:", error);
    }
};

// ✅ Run the function every hour
setInterval(checkExpiredBids, 60 * 60 * 1000); // 1 hour

module.exports = checkExpiredBids;
