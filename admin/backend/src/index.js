const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const { handleAdminSignup , handleAdminLogin } = require('../controllers/admin.js');
const cookieParser = require('cookie-parser');
const adminRoutes = require('../routes/admin.js');
const port = 1001;
const { connectToMongoDB } = require('./config.js');

// Connect to MongoDB
connectToMongoDB('process.env.MONGO_URI').then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log("MongoDB connection error", err);
});

app.set('view engine', 'ejs');

app.use(cors({ origin: 'http://localhost:5174', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// **Fix Static Uploads Directory**
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));


app.use('/admin', adminRoutes);

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.post('/signup', handleAdminSignup);
app.post('/login', handleAdminLogin);

