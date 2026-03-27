const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        
        const isTargetingAdmin = role === 'admin' || email.toLowerCase().endsWith('@admin.admin');

        // Strictly prevent Admin registration via signup WITHOUT correct domain
        if (isTargetingAdmin && !email.toLowerCase().endsWith('@admin.admin')) {
            return res.status(403).json({ message: 'Admin role is restricted to @admin.admin emails.' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });
        
        // Finalize role
        const finalRole = isTargetingAdmin ? 'admin' : 'user';

        const user = await User.create({ username, email, password, role: finalRole });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        
        res.status(201).json({ token, user: { id: user._id, username, email, role: finalRole } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const isAdminEmail = email.toLowerCase().endsWith('@admin.admin');

        const user = await User.findOne({ email });
        
        // Enforce role-based email restrictions
        if (user && user.role === 'admin' && !isAdminEmail) {
            return res.status(403).json({ message: 'Admin login restricted to @admin.admin emails.' });
        }
        
        if (isAdminEmail && user && user.role !== 'admin') {
            return res.status(403).json({ message: 'Invalid admin credentials.' });
        }

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.json({ token, user: { id: user._id, username: user.username, email, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
