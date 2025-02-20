import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";
import jsonwebtoken from "jsonwebtoken";
import User from "../models/user.model.js";


export const signUp = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, email, password } = req.body;

        // Check if a user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            const error = new Error('User already exists');
            error.statusCode = 409;
            throw error;
        }

        //Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUsers = await User.create([{ name, email, password: hashedPassword }], { session: session });
        const token = jsonwebtoken.sign({ userId: newUsers[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                user: newUsers[0], token
            }
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: error.message });
    }
}

export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if a user already exists
        const user = await User.findOne({ email });

        if (!user) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            throw error;
        }
        const token = jsonwebtoken.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            data: {
                user,
                token
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const signOut = async (req, res, next) => {

    //impelement signout logic here
}