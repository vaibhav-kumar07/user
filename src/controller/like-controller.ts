import { Request, Response } from 'express';
import { Types } from 'mongoose'; // Import the Types object from mongoose
import Post from '../models/post';
import User from '../models/user';

// Like a post
export async function likePost(req: Request, res: Response) {
    const { id: userId, postId } = req.params;

    try {
        // Check if the user ID and post ID are valid ObjectIds
        if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid user ID or post ID format' });
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

        // Check if the user has already liked the post
        const hasLiked = post.likes.some((like) => like.toString() === userId);
        if (hasLiked) {
            return res.status(400).json({ message: 'User has already liked the post' });
        }

        // Add the user to the likes array
        post.likes.push(userId);

        // Save the updated post
        const updatedPost = await post.save();
        res.json(updatedPost);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

// Unlike a post
export async function unlikePost(req: Request, res: Response) {
    const { id: userId, postId } = req.params;

    try {
        // Check if the user ID and post ID are valid ObjectIds
        if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid user ID or post ID format' });
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

        // Check if the user has liked the post
        const hasLiked = post.likes.some((like) => like.toString() === userId);
        if (!hasLiked) {
            return res.status(400).json({ message: 'User has not liked the post' });
        }

        // Remove the user from the likes array
        post.likes = post.likes.filter((like) => like.toString() !== userId);

        // Save the updated post
        const updatedPost = await post.save();
        res.json(updatedPost);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}
