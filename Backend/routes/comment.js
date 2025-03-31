const express = require("express")
const router = express.Router();
const Comment = require('../models/Comment')
const Post = require('../models/Post')
const { check, validationResult } = require('express-validator')
const fetchUser = require("../middleware/fetchUser");

//ROUTE 1
// create a comment using POST @ /api/comment/createcomment. LOGIN REQUIRED
router.post("/createcomment", fetchUser,
    check("content").isLength({ min: 1 }).withMessage('Content cannot be empty'),
    check("post").isMongoId().withMessage('Invalid post ID'),
    check("parentComment").optional().isMongoId().withMessage('Invalid parent comment ID'), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const { content, post, parentComment } = req.body

        const postExist = await Post.findById(post)
        if (!postExist) {
            return res.status(404).json({ error: "Post not found" })
        }

        if (parentComment) {
            const commentExist = await Comment.findById(parentComment)
            if (!commentExist) {
                return res.status(404).json({ error: "Comment not found" })
            }
        }

        const comment = new Comment({
            content,
            post,
            author: req.user.id,
            parentComment: parentComment || null,
        })

        const savedComment = await comment.save()
        res.json(savedComment)

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error")
    }
});

//ROUTE 2
// get comments for a specific post using POST @ /api/comment/getcomment/:postid
router.post("/getcomment/:postId",
    check("postId").isMongoId().withMessage("Invalid post ID"), async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { postId } = req.params;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const comments = await Comment.find({ post: postId }).populate('author','name profilepicture').exec();

        res.json(comments);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});

module.exports = router;