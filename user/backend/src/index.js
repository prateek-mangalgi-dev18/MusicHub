const express = require('express');
const app = express();
const port = 1000;
const { connectToMongoDB } = require('./config');
const { handleUserSignup, handleUserLogin } = require('../controllers/user');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const songRoutes = require('../routes/songroutes');
const userActionsRoutes = require('../routes/useractions');
const axios = require('axios');

// MongoDB Connection
connectToMongoDB('mongodb://localhost:27017/rr')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log("MongoDB connection error", err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(cors({ 
//   origin: ['http://localhost:5173', 'http://localhost:5174'],
//   credentials: true 
// }));
app.use(cors({
  origin: true,
  credentials: true
}));


// Routes
app.use('/api/songs', songRoutes);
app.use('/api/user', userActionsRoutes);

// Proxy route for audio files
app.get('/proxy/uploads/:filename', async (req, res) => {
  const { filename } = req.params;
  try {
    const response = await axios.get(`http://localhost:1001/uploads/${filename}`, {
      responseType: 'stream',
      headers: {
        'Accept': 'audio/mpeg'
      }
    });

    res.set({
      'Content-Type': response.headers['content-type'],
      'Content-Length': response.headers['content-length'],
      'Cache-Control': 'public, max-age=31536000'
    });

    response.data.pipe(res);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(error.response?.status || 500).send(error.response?.statusText || 'Error fetching file');
  }
});

// Views
app.set('view engine', 'ejs');
app.get('/login', (req, res) => res.render('login'));
app.get('/signup', (req, res) => res.render('signup'));
app.get('/home', (req, res) => res.render('home'));

// Auth Routes
app.post('/signup', handleUserSignup);
app.post('/login', handleUserLogin);

// Start Server
app.listen(port, () => console.log(`User server running on port ${port}`));

