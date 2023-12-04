import mongoose, { Schema } from 'mongoose';
import { Post } from '../types/post';

const commentSchema = new mongoose.Schema({
    commenter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

const postSchema: Schema<Post> = new mongoose.Schema({
    content: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    comments: [commentSchema],
    likes: [{ type: String }],
    bookmarks: [String],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, required: true },
});

postSchema.pre(['find', 'findOne'], function (next) {
    this.populate({
        path: 'user',
        select: '_id username image',
    });

    this.populate({
        path: 'comments.commenter',
        select: '_id username image', // Adjust this as per your User schema
    });

    next();
});

export default mongoose.model<Post>('Post', postSchema);
