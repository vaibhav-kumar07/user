import { Request, Response } from 'express';
import { Types } from 'mongoose'; // Import the Types object from mongoose
import Post from '../models/post';
import User from '../models/user';


const isValidObjectId = (id: string) => Types.ObjectId.isValid(id) && new Types.ObjectId(id).toString() === id;
export async function likePost(req: Request, res: Response) {
    const { id: userId, postId } = req.params;

    try {
        if (!isValidObjectId(userId) || !isValidObjectId(postId)) {
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

        const hasLiked = post.likes.includes(userId);
        if (hasLiked) {
            return res.status(409).json({ message: 'User has already liked the post' });
        }

        post.likes.push(userId);
        await post.save();

        res.json({ message: 'Post liked successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export async function unlikePost(req: Request, res: Response) {
    const { id: userId, postId } = req.params;

    try {
        if (!isValidObjectId(userId) || !isValidObjectId(postId)) {
            return res.status(400).json({ message: 'Invalid user ID or post ID format' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const post = await Post.findOne({ _id: postId });
        if (!post) {
            return res.status(404).json({ message: 'Post not found ' });
        }

        const hasLiked = post.likes.includes(userId);
        if (!hasLiked) {
            return res.status(400).json({ message: 'User has not liked the post' });
        }

        post.likes = post.likes.filter((like) => like.toString() !== userId);
        await post.save();

        res.json({ message: 'Post unliked successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}
