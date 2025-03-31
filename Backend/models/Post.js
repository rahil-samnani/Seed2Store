const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    postTitle: {
      type: String,
      required: true,
    },
    postDescription: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true, // Category is mandatory
      enum: ["Fruits", "Vegetables", "Seeds", "Grains", "Dairy", "Livestock", "Others"],
    },
    variety: {
      type: String,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
      enum: ["kg", "lbs", "crates", "liters", "units"],
    },
    pricePerUnit: {
      type: Number,
      required: true,
    },
    pricingType: {
      type: String,
      default: "Fixed",
      enum: ["Fixed", "Negotiable"],
    },
    grade: {
      type: String,
      trim: true,
    },
    certification: {
      type: String,
      trim: true,
    },
    pickupAvailable: {
      type: Boolean,
      default: true,
    },
    harvestDate: {
      type: Date,
      required: true,
    },
    shelfLife: {
      type: String,
      trim: true,
    },
    images: {
      path: { type: String, required: true },
      filename: { type: String, required: true }
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    acceptedBidId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'bid'
    },
    acceptedBidState: { 
      type: String, 
      default: "Pending" 
    },
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
  },
  {
    timestamps: true,
  }
);

postSchema.index({ postTitle: "text", postDescription: "text", productName: "text", category: "text" });
const Post = mongoose.model("Post", postSchema);
module.exports = Post;
