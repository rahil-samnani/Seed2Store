const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    profilepicture: {
        type: String,
        default: ""
    }
});
UserSchema.index({ name: "text", email: "text" });
const User = mongoose.model('user', UserSchema);
User.createIndexes();
module.exports = User;
