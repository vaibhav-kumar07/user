import mongoose from 'mongoose';

export interface Comment {
    _id?: mongoose.Types.ObjectId;
    commenter: string;
    comment: string;
    date: Date;
}



export interface Post {
    _id?: mongoose.Types.ObjectId;
    content: string;
    user: string | mongoose.Types.ObjectId;
    comments: Comment[];
    likes: string[];
    createdAt?: Date;
    updatedAt?: Date;
    bookmarks: string[],
}
