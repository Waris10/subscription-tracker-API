import User from "../models/user.model.js";

export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getUser = async (req, res) => {
    try {
        const users = await User.findById(req.params.id).select('-password');

        if (!users) {
            res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}