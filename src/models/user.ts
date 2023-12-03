import mongoose, { Schema } from 'mongoose';
import { User } from '../types/user';

const userSchema: Schema<User & { updatedAt: Date; updatedBy: string; }> = new Schema({
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<User & { updatedAt: Date; updatedBy: string; }>('User', userSchema);
