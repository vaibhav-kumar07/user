import { Request, Response } from 'express';
import { Types } from 'mongoose';
import User from '../models/user';
import Post from '../models/post';

export async function createPost(req: Request, res: Response) {
    const { id: userId } = req.params;
    const { title, content } = req.body;

    try {
        // Check if the user ID is a valid ObjectId
        if (!Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a new post associated with the user
        const newPost = new Post({
            title,
            content,
            user: userId,
            updatedAt: new Date()
        });

        await newPost.save();
        res.status(200).json({ message: "Post saved successfully" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export async function updatePost(req: Request, res: Response) {
    const { id: userId, postId } = req.params;
    const { content } = req.body;

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

        post.content = content;
        post.updatedAt = new Date();
        await post.save();
        res.json({ message: 'Post updated successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export async function get(req: Request, res: Response) {
    try {

        const posts = await Post.find();
        res.json(posts);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}


export async function getPostsByUserId(req: Request, res: Response) {
    const { id: userId } = req.params;

    try {
        // Check if the user ID is a valid ObjectId
        if (!Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }

        // Find posts by user ID
        const posts = await Post.find({ user: userId });
        res.json(posts);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export async function getPostDetails(req: Request, res: Response) {
    const { id: userId, postId } = req.params;

    try {
        // Check if the user ID and post ID are valid ObjectIds
        if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid user ID or post ID format' });
        }

        // Check if the post exists and belongs to the user
        const post = await Post.findOne({ _id: postId, user: userId });
        if (!post) {
            return res.status(404).json({ message: 'Post not found or does not belong to the user' });
        }

        res.json(post);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export async function deletePost(req: Request, res: Response) {
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

        // Delete the post
        await post.remove();
        res.json({ message: 'Post deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

