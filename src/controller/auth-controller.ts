import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user';

interface ValidationRule {
    field: string;
    regex: RegExp;
    errorMessage: string;
}

const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegexPattern = /^[a-zA-Z0-9_]+$/;
const handleServerError = (error: any, res: Response) => {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
};

const validateFields = (fields: Record<string, string | undefined>, rules: ValidationRule[], res: Response) => {
    for (const field in fields) {
        const value = fields[field];

        if (value !== undefined) {
            const rule = rules.find((r) => r.field === field);

            if (rule && !rule.regex.test(value)) {
                return res.status(400).json({ message: rule.errorMessage });
            }
        }
    }
};
export const signUp = async (req: Request, res: Response) => {
    try {
        const { name, username, email, password, image } = req.body;

        const validationRules: ValidationRule[] = [
            { field: 'email', regex: emailRegexPattern, errorMessage: 'Invalid email address' },
            { field: 'username', regex: usernameRegexPattern, errorMessage: 'Invalid username' },
        ];

        validateFields({ email, username }, validationRules, res);

        // Check if email is already in use
        const existingEmailUser = await User.findOne({ email });
        if (existingEmailUser) {
            return res.status(400).json({ message: 'Email is already in use' });
        }

        // Check if username is already in use
        const existingUsernameUser = await User.findOne({ username });
        if (existingUsernameUser) {
            return res.status(400).json({ message: 'Username is already in use' });
        }

        // If both email and username are unique, proceed to save the user
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, username, email, password: hashedPassword, image, updatedAt: new Date() });
        await user.save();

        res.status(201).json({ message: 'User created successfully', _id: user._id });
    } catch (error) {
        handleServerError(error, res);
    }
};


export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        // Validate the username using the validator library
        console.log("suername an dpass", username, password)
        if (!usernameRegexPattern.test(username)) {
            return res.status(400).json({ message: 'Username must be alphanumeric' });
        }

        let user;
        user = await User.findOne({ username });
        console.log("usernam", user)
        // Check if the user exists and the password is correct
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid username,or  password' });
        }

        res.status(200).json({
            message: 'Login successful',
            user: { _id: user._id, name: user.name, username: user.username, email: user.email, image: user.image },
        });
    } catch (error) {
        handleServerError(error, res);
    }
};


export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const { email, username, name, image } = req.body;

        const validationRules: ValidationRule[] = [
            { field: 'email', regex: emailRegexPattern, errorMessage: 'Invalid email address' },
            { field: 'username', regex: usernameRegexPattern, errorMessage: 'Invalid username' },
        ];

        validateFields({ email, username }, validationRules, res);

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (email) user.email = email;
        if (username) user.username = username;
        if (name !== undefined) user.name = name;
        if (image) user.image = image;
        user.updatedAt = new Date();


        await user.save();

        res.status(200).json({ message: 'User details updated successfully' });
    } catch (error) {
        handleServerError(error, res);
    }
};
