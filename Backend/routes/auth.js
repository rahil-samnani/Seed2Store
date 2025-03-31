const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const User = require('../models/User')
const fetchUser = require('../middleware/fetchUser')
const { validationResult, check } = require('express-validator');

const JSWT_SECRET = "R@#i|i$@G00dBoy";


//Route 1
// create user using : POST @ /api/auth/createuser . NO LOGIN
router.post("/createuser", check("name").isLength({ min: 3 }).withMessage('Name nust be atleast 3 character long'), check("email").isEmail().withMessage('Enter valid email'), check("password").isLength({ min: 6 }).withMessage('Password must be atleast 6 characters long'), check('type').exists().withMessage('Invalid user type'), async (req, res) => {

    let success = false

    // if there are errors return bad request and error
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        res.status(400).json({ success, errors: errors.array() });
    }
    else {
        try {
            const salt = await bcrypt.genSalt(10)
            const secPassword = await bcrypt.hash(req.body.password, salt)
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPassword,
                type: req.body.type
            })

            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JSWT_SECRET)

            res.json({ success: true, authToken , user })
        }

        catch (error) {
            console.error(error.message)
            res.status(500).json({ success, error: "Some Error Occured" })
        }
    }

})

//Route 2
// login user using : POST @ /api/auth/login . NO LOGIN
router.post("/login", check("email").isEmail().withMessage('Enter valid email'), check("password").exists().withMessage('Password cannot be Blank'), async (req, res) => {

    let success = false

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ success ,  errors: errors.array() });
    }

    const { email, password } = req.body
    try {
        let user = await User.findOne({ email })
        const passwordCompare = await bcrypt.compare(password, user.password)
        if (!user || !passwordCompare) {
            return res.status(400).json({success , errors : "Inavlid Credentials"})
        }

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JSWT_SECRET)
        res.json({ success : true , authToken , user})
    }
    catch (error) {
        console.error(error.message)
        res.status(500).json({ success, error: "Some Error Occured" })
    }

})

//Route 3
// Get logged in user details using : POST @ api/auth/getuser
router.post("/getuser",fetchUser, async (req, res) => {
    try{
        userId = req.user.id
        const user = await User.findById(userId).select("-password")
        res.send(user)
    }
    catch(error){
        console.error(error.message)
        res.status(500).json({ error: "Some Error Occured" })
    }
})

//Route 4
//get user from username using GET @ api/auth/getuserbyname 
router.get('/getuserbyname/:name' , fetchUser ,async (req,res) => {
    try{
        const {name} = req.params
        const user = await User.findOne({name})
        if(user)
            res.send(user)
        else
            res.status(404).send("User not found")
    }
    catch(error){
        console.error(error.message)
        res.status(500).json({ error: "Some Error Occured" })
    }
})

//Route 5
// Forgot Password using : POST @ /api/auth/forgotpassword
router.post(
    "/forgotpassword",
    [
        check("email").isEmail().withMessage("Enter a valid email"),
        check("password")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters long"),
        check("confirmPassword")
            .custom((value, { req }) => value === req.body.password)
            .withMessage("Passwords do not match"),
    ],
    async (req, res) => {
        let success = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() });
        }

        try {
            const { email, password } = req.body;

            // Check if user exists
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ success, error: "User not found" });
            }

            // Hash the new password
            const salt = await bcrypt.genSalt(10);
            const secPassword = await bcrypt.hash(password, salt);

            // Update user password
            user.password = secPassword;
            await user.save();

            res.json({ success: true, message: "Password reset successfully" });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success, error: "Some Error Occurred" });
        }
    }
);

module.exports = router