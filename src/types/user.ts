import mongoose from "mongoose";

export interface User {
    _id?: mongoose.Types.ObjectId;
    name: string,
    username: string;
    email: string;
    password: string;
    image: string;
    createdAt: Date;
    updatedAt: Date;
    updatedBy: string;
}


