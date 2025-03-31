const express = require("express");
const router = express.Router();
const Post = require('../models/Post')
const User = require('../models/User')
const { check, validationResult } = require('express-validator')
const fetchUser = require("../middleware/fetchUser");
const multer = require('multer')
const path = require('path')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const upload = multer({ storage })

// ROUTE 1
// get all user posts using POST @ /api/post/getalluserposts . LOGIN REQUIRED
router.get("/getalluserposts/:id", fetchUser, async (req, res) => {
    const { id } = req.params;
    try {
        // Find all posts for the user, populating acceptedBidId (bidState only) and userId (name)
        let posts = await Post.find({ userId: id })
            .populate("acceptedBidId", "bidState")
            .populate("userId", "name profilepicture")
            .exec();

        // For each post that has an acceptedBidId, update its acceptedBidState field
        posts = await Promise.all(
            posts.map(async (post) => {
                if (post.acceptedBidId) {
                    // If the post's acceptedBidState is not the same as the bid's bidState, update it
                    if (post.acceptedBidState !== post.acceptedBidId.bidState) {
                        post.acceptedBidState = post.acceptedBidId.bidState;
                        await post.save();
                    }
                }
                return post;
            })
        );

        res.json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Server error" });
    }
});


// ROUTE 2
// post a post using POST @ /api/post/createpost . LOGIN REQUIRED
router.post("/createpost", fetchUser, upload.single('image'), check("postTitle").isLength({ min: 3 }).withMessage('Enter a valid title'),
    check("postDescription").isLength({ min: 5 }).withMessage('Enter a valid description'),
    check("productName").isLength({ min: 3 }).withMessage('Enter a valid product name'),
    check("variety").exists().withMessage('Enter a valid variety'),
    check("quantity").exists().withMessage('Enter a valid quantity'),
    check("unit").exists().withMessage('Enter a valid unit'),
    check("pricePerUnit").exists().withMessage('Enter a valid price per unit'),
    check("pricingType").exists().withMessage('Enter a valid pricing type'),
    check("grade").exists().withMessage('Enter a valid product grade'),
    check("harvestDate").exists().withMessage('Enter a valid product harvest date'),
    check("shelfLife").exists().withMessage('Enter a valid product shelf life'),
    async (req, res) => {

        // if there are errors return bad request and error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }
        else {
            try {
                const {
                    postTitle,
                    postDescription,
                    productName,
                    category,
                    variety,
                    quantity,
                    unit,
                    pricePerUnit,
                    pricingType,
                    grade,
                    certification,
                    pickupAvailable,
                    harvestDate,
                    shelfLife,
                } = req.body

                const { filename, path } = req.file

                const post = new Post({
                    postTitle,
                    postDescription,
                    productName,
                    category,
                    variety,
                    quantity,
                    unit,
                    pricePerUnit,
                    pricingType,
                    grade,
                    certification,
                    pickupAvailable,
                    harvestDate,
                    shelfLife,
                    images: { filename, path }
                    , userId: req.user.id
                })

                const savedPost = await post.save()

                res.json(savedPost)
            }
            catch (error) {
                console.error(error.message)
                res.status(500).json({ error: "Some Error Occured" })
            }
        }
    })



// Route 3
// Delete a post using : DELETE /api/posts/deletepost/:id . LOGIN REQUIRED
router.delete("/deletepost/:id", fetchUser, async (req, res) => {
    try {
        //Find the post to be deleted
        let post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).send("Not Found")
        }
        // allow deletion if it belongs to user
        if (post.userId.toString() !== req.user.id) {
            return res.status(401).send("Not Authorized")
        }

        //delete the found post
        post = await Post.findByIdAndDelete(req.params.id)
        res.json({ "success": "post has been deleted" })
    }
    catch (error) {
        console.error(error.message)
        res.status(500).json({ error: "Some Error Occured" })
    }
})

// ROUTE 4
// update post using /api/post/editpost/:id. LOGIN REQUIRED
router.put("/editpost/:id", fetchUser, check("postTitle").isLength({ min: 3 }).withMessage('Enter a valid title'),
    check("postDescription").isLength({ min: 5 }).withMessage('Enter a valid description'),
    check("productName").isLength({ min: 3 }).withMessage('Enter a valid product name'),
    check("variety").exists().withMessage('Enter a valid variety'),
    check("quantity").exists().withMessage('Enter a valid quantity'),
    check("unit").exists().withMessage('Enter a valid unit'),
    check("pricePerUnit").exists().withMessage('Enter a valid price per unit'),
    check("pricingType").exists().withMessage('Enter a valid pricing type'),
    check("grade").exists().withMessage('Enter a valid product grade'),
    check("harvestDate").exists().withMessage('Enter a valid product harvest date'),
    check("shelfLife").exists().withMessage('Enter a valid product shelf life'), async (req, res) => {

        // if there are errors return bad request and error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }
        else {
            try {
                const postId = req.params.id;

                let post = await Post.findById(postId)
                if (!post) {
                    return res.status(404).send("Not Found")
                }

                // allow updation if it belongs to user
                if (post.userId.toString() !== req.user.id) {
                    return res.status(401).send("Not Authorized")
                }
                const {
                    postTitle,
                    postDescription,
                    productName,
                    category,
                    variety,
                    quantity,
                    unit,
                    pricePerUnit,
                    pricingType,
                    grade,
                    certification,
                    pickupAvailable,
                    harvestDate,
                    shelfLife,
                } = req.body;

                const updatedPost = await Post.findByIdAndUpdate(
                    postId,
                    {
                        postTitle,
                        postDescription,
                        productName,
                        category,
                        variety,
                        quantity,
                        unit,
                        pricePerUnit,
                        pricingType,
                        grade,
                        certification,
                        pickupAvailable,
                        harvestDate,
                        shelfLife,
                    },
                    { new: true, runValidators: true }
                );

                if (!updatedPost) {
                    return res.status(404).json({ message: "Post not found" });
                }


                res.status(200).json({
                    message: "Post updated successfully",
                    post: updatedPost,
                });
            }
            catch (error) {
                console.error("Error updating post:", error);
                res.status(500).json({ message: "Server error. Could not update post." });
            }
        }

    });


// ROUTE 5
// get all posts using  GET @ /api/post/getallposts. LOGIN REQUIRED
router.get("/getallposts", fetchUser, async (req, res) => {
    try {
        const posts = await Post.find().populate('userId', 'name profilepicture').exec();
        if (posts.length === 0) {
            return res.status(404).json({ message: "No posts found" });
        }
        const formattedPosts = posts.map(post => ({
            ...post.toObject(),
            userId: post.userId.name,
        }));
        res.status(200).json({
            message: "Posts fetched successfully",
            posts,
        });
    }
    catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Server error. Could not fetch posts." });
    }
});

//ROUTE 6
// get post image using GET @ /api/post/getpostimage/:id. LOGIN REQUIRED
router.get("/getpostimage/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post || !post.images) {
            return res.status(404).json({ message: "No image found" });
        }

        res.sendFile(path.resolve(post.images.path))
    }
    catch (error) {
        console.error("Error fetching image:", error);
        res.status(500).json({ message: "Server error. Could not fetch image." });
    }
})

//ROUTE 7
//like a post using PUT @ /api/post/likepost/:id
router.put("/likepost/:id", fetchUser, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const post = await Post.findById(id);

        if (!post.likes.includes(userId)) {
            post.likes.push(userId);
            await post.save();
        }

        res.status(200).json({ success: true, likes: post.likes.length });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

//ROUTE 8
//unlike a post using PUT @ /api/post/unlikepost/:id
router.put("/unlikepost/:id", fetchUser, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const post = await Post.findById(id);

        if (post.likes.includes(userId)) {
            post.likes = post.likes.filter((like) => like.toString() !== userId);
            await post.save();
        }

        res.status(200).json({ success: true, likes: post.likes.length });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

//ROUTE 9
//fetch no of likes on post using GET @ /api/post/getlikes/:id . LOGIN REQUIERED
router.get('/getlikes/:id', fetchUser, async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id);
        res.status(200).json({ success: true, likes: post.likes.length });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
})

// ROUTE 10
// get a posts using GET @ /api/post/getpost . LOGIN REQUIRED
router.get("/getposts/:id", fetchUser, async (req, res) => {
    const { id } = req.params
    const post = await Post.find({ postId: id }).populate('userId', 'name profilepicture').exec();
    res.json(post)
})

//ROUTE 11
// GET /api/posts/filter?category=Fruits&productName=Apple&minPrice=10&maxPrice=50...
router.get('/filter', async (req, res) => {
    try {
        // Destructure filter parameters from query string
        const {
            category,
            productName,
            minPrice,
            maxPrice,
            minQuantity,
            maxQuantity,
            pricingType,
            pickupAvailable,
            harvestDateFrom,
            harvestDateTo,
        } = req.query;

        // Build the query object
        const query = {};

        // Filter by category if provided
        if (category) {
            query.category = category;
        }

        // Filter by product name using case-insensitive regex search
        if (productName) {
            query.productName = { $regex: productName, $options: 'i' };
        }

        // Filter by price range
        if (minPrice || maxPrice) {
            query.pricePerUnit = {};
            if (minPrice) {
                query.pricePerUnit.$gte = Number(minPrice);
            }
            if (maxPrice) {
                query.pricePerUnit.$lte = Number(maxPrice);
            }
        }

        // Filter by quantity range
        if (minQuantity || maxQuantity) {
            query.quantity = {};
            if (minQuantity) {
                query.quantity.$gte = Number(minQuantity);
            }
            if (maxQuantity) {
                query.quantity.$lte = Number(maxQuantity);
            }
        }

        // Filter by pricing type (Fixed or Negotiable)
        if (pricingType) {
            query.pricingType = pricingType;
        }

        // Filter by pickup availability; expecting a string "true" or "false"
        if (pickupAvailable) {
            query.pickupAvailable = pickupAvailable === 'true';
        }

        // Filter by harvest date range
        if (harvestDateFrom || harvestDateTo) {
            query.harvestDate = {};
            if (harvestDateFrom) {
                query.harvestDate.$gte = new Date(harvestDateFrom);
            }
            if (harvestDateTo) {
                query.harvestDate.$lte = new Date(harvestDateTo);
            }
        }

        // Execute the query
        const posts = await Post.find(query).populate('userId', 'name profilepicture').exec();

        res.status(200).json({
            success: true,
            count: posts.length,
            posts,
        });
    } catch (error) {
        console.error('Error fetching filtered posts:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

module.exports = router;



module.exports = router;