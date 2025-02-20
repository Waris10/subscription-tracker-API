import mongoose from "mongoose";  // Import mongoose

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User Name is required'],
        trim: true,
        unique: true,
        minLength: [3, 'Name must be at least 3 characters.'],
        maxLength: [50, 'Name must be at most 50 characters.'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        unique: true,
        minLength: [5, 'Email must be at least 5 characters.'],
        maxLength: [50, 'Email must be at most 50 characters.'],
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please fill a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [6, 'Password must be at least 6 characters.'],
        maxLength: [255, 'Password must be at most 50 characters.'],
    },
}, { timestamps: true });


const User = mongoose.model('User', userSchema);  // Create a model

export default User;  // Export the model

