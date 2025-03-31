const mongoose = require("mongoose");
const { Schema } = mongoose;

const BidSchema = new Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user',
        require : true,
    },
    postId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Post',
        require : true,
    },
    bidAmount : {
        type : Number,
        require : true,
    },
    bidQuantity : {
        type : Number,
        require : true,
    },
    bidState  : {
        type : String,
        enum : ['Pending', 'Accepted', 'Rejected', 'Paid'],
        default : 'Pending',
    },
    razorpay_order_id: { 
        type: String 
    },
    razorpay_payment_id: { 
        type: String 
    },
    acceptedAt: { 
        type: Date 
    },
    date:{
        type: Date,
        default: new Date
    }
});


const Bid = mongoose.model('bid', BidSchema)
module.exports = Bid; 