const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, 'E-com', { expiresIn: '7d' });
};

const handleUserSignup = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword, role });

        await user.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        res.status(500).send('Error registering user');
    }
};

const handleUserLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send('Invalid credentials');
        }

        const token = generateToken(user);
        // res.cookie('token', token, { httpOnly: true });
        res.cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: false, // true in production (https)
        });

        
        if (user.role === 'admin') {
            res.redirect('/admin/dashboard');
        } else {
            res.redirect('/user/home');
        }
    } catch (error) {
        res.status(500).send('Error logging in');
    }
};

module.exports = { handleUserSignup, handleUserLogin };
