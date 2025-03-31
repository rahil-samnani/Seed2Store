const mongoose = require("mongoose");
const { Schema } = mongoose;

const MessageSchema = new Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    bidId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bid",
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    isRead: { 
        type: Boolean, 
        default: false 
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;
