import mongoose, { Schema, Document } from 'mongoose';
import { User } from '../type';

const userSchema: Schema = new Schema({
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true }
});

export default mongoose.model<User>('User', userSchema);
