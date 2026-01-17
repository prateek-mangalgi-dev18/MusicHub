const Admin = require('../models/admin');
const bcrypt = require('bcrypt');
const { setAdmin } = require('../routes/auth');

async function handleAdminSignup(req, res) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: "All fields are required." });
    }

    try {
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.json({ success: false, message: "Admin already exists." });
        }

        // Generate salt and hash the password (10 is the salt rounds)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await Admin.create({
            name,
            email,
            password: hashedPassword,  // Save the hashed password
        });

        return res.json({ success: true, message: "Signup successful!" });
    } catch (error) {
        console.error("Signup Error:", error);
        return res.json({ success: false, message: "Signup failed. Please try again." });
    }
}

async function handleAdminLogin(req, res) {
    console.log("Login Request Received");
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: "All fields are required." });
    }

    try {
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.json({ success: false, message: "Invalid Admin name or password" });
        }

        // Compare provided password with stored hashed password
        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
            return res.json({ success: false, message: "Invalid Admin name or password" });
        }

        // Generate JWT token for authenticated Admin
        const token = setAdmin(admin);
        
        // Store the token in a cookie
        res.cookie('token', token, { httpOnly: true });

        return res.json({ success: true, message: "Login successful!" });
    } catch (error) {
        console.error("Login Error:", error);
        return res.json({ success: false, message: "Login failed. Please try again." });
    }
}

module.exports = {
    handleAdminSignup,
    handleAdminLogin,
};
