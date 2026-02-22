const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const userEnv = require('dotenv').parse(fs.readFileSync(path.join(__dirname, 'user', 'backend', '.env')));
const MONGO_URI = userEnv.MONGO_URI || 'mongodb://localhost:27017/rr';

const musicSchema = new mongoose.Schema({
    title: String,
    artist: String,
    movie: String,
    fileUrl: String,
    coverImage: String,
});

const Music = mongoose.model('Music', musicSchema);

async function check() {
    try {
        await mongoose.connect(MONGO_URI);
        const songs = await Music.find();
        console.log(JSON.stringify(songs, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
