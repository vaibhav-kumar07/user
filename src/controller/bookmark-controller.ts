import { Request, Response } from 'express';
import Post from '../models/post';
import mongoose from 'mongoose';

export const addBookmark = async (req: Request, res: Response) => {
    try {
        const { id, postId } = req.params;

        // Validate user ID and post ID formats
        if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(postId)) {
            return res.status(400).json({ message: 'Invalid user ID or post ID format' });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }


        // Check if the post is already bookmarked
        if (post.bookmarks.includes(id)) {
            return res.status(400).json({ message: 'Post already bookmarked' });
        }

        // Add user to bookmarks
        post.bookmarks.push(id);
        await post.save();

        res.status(200).json({ message: 'Bookmark added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const removeBookmark = async (req: Request, res: Response) => {
    try {
        const { id, postId } = req.params;

        // Validate user ID and post ID formats
        if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(postId)) {
            return res.status(400).json({ message: 'Invalid user ID or post ID format' });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the post is bookmarked
        const index = post.bookmarks.indexOf(id);
        if (index === -1) {
            return res.status(400).json({ message: 'Post is not bookmarked' });
        }

        // Remove user from bookmarks
        post.bookmarks.splice(index, 1);
        await post.save();

        res.status(200).json({ message: 'Bookmark removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
