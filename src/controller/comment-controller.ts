import { Request, Response } from 'express';
import { Types } from 'mongoose'; // Import the Types object from mongoose
import User from "../models/user"
import Post from '../models/post';
import { Comment } from '../types/post'; // Import the Comment type from postType.ts

// Add a comment to a post
export async function addComment(req: Request, res: Response) {
    const { id: userId, postId } = req.params;
    const { commenter, comment } = req.body;

    try {
        // Check if the user ID and post ID are valid ObjectIds
        if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid user ID or post ID format' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const post = await Post.findOne({ _id: postId });
        if (!post) {
            return res.status(404).json({ message: 'Post not found or does not belong to the user' });
        }

        // Create a new comment
        const newComment: Comment = {
            commenter,
            comment,
            date: new Date(),
        };

        post.comments.push(newComment);

        // Save the updated post
        await post.save();
        res.json("Comment added successfully");
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

// Delete a comment from a post
export async function deleteComment(req: Request, res: Response) {
    const { id: userId, postId, commentId } = req.params;

    try {
        // Check if the user ID, post ID, and comment ID are valid ObjectIds
        if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(postId) || !Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({ message: 'Invalid user ID, post ID, or comment ID format' });
        }

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the post exists and belongs to the user
        const post = await Post.findOne({ _id: postId, user: userId });
        if (!post) {
            return res.status(404).json({ message: 'Post not found or does not belong to the user' });
        }

        // Find the index of the comment to be deleted
        const commentIndex = post.comments.findIndex((comment) => comment._id!.toString() === commentId);
        if (commentIndex === -1) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Remove the comment from the post
        post.comments.splice(commentIndex, 1);

        // Save the updated post
        await post.save();
        res.json({ message: 'Comment removed successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}
