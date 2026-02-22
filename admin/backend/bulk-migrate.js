const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET,
});

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/rr';
const UPLOADS_DIR = path.join(__dirname, 'uploads');

const musicSchema = new mongoose.Schema({
    title: String,
    artist: String,
    movie: String,
    fileUrl: String,
    coverImage: String,
});
const Music = mongoose.model('Music', musicSchema);

async function verifyUrl(url) {
    try {
        const res = await axios.head(url);
        return res.status >= 200 && res.status < 300;
    } catch (err) {
        return false;
    }
}

async function migrate() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB");

        const songs = await Music.find();
        console.log(`🔍 Checking ${songs.length} songs...`);

        for (const song of songs) {
            let needsUpdate = false;

            // Logic for each URL (fileUrl and coverImage)
            const fields = ['fileUrl', 'coverImage'];
            for (const field of fields) {
                let url = song[field];
                if (!url) continue;

                // If it's already a Cloudinary URL, verify it
                if (url.includes('cloudinary.com')) {
                    const ok = await verifyUrl(url);
                    if (ok) {
                        console.log(`   ✅ URL OK: ${song.title} (${field})`);
                        continue;
                    } else {
                        console.warn(`   ❌ Cloudinary URL 404: ${song.title} (${field}). Attempting repair...`);
                    }
                }

                // Identify local file to upload/re-upload
                let filename;
                if (url.includes('cloudinary.com')) {
                    // If a broken cloudinary URL, try to find the filename from the path
                    filename = path.basename(url);
                } else {
                    filename = path.basename(url);
                }

                const localPath = path.join(UPLOADS_DIR, filename);
                if (fs.existsSync(localPath)) {
                    console.log(`📤 Uploading: ${song.title} (${field}) -> ${filename}`);
                    try {
                        const public_id = filename.split('.')[0]; // Use filename as ID to be deterministic
                        const resource_type = field === 'fileUrl' ? 'video' : 'image';
                        const folder = field === 'fileUrl' ? 'musichub/songs' : 'musichub/covers';

                        const upload = await cloudinary.uploader.upload(localPath, {
                            public_id: public_id,
                            resource_type: resource_type,
                            folder: folder,
                            overwrite: true,
                            invalidate: true
                        });

                        song[field] = upload.secure_url;
                        needsUpdate = true;
                        console.log(`   ✨ Success: ${upload.secure_url}`);
                    } catch (err) {
                        console.error(`   ❌ Failed: ${err.message}`);
                    }
                } else {
                    // If no local file, we might have to fallback to proxy if it was a local URL originally
                    if (!url.includes('cloudinary.com') && !url.includes('localhost:1000/proxy')) {
                        console.log(`   🔄 Updating to Proxy: ${song.title} (${field})`);
                        song[field] = `http://localhost:1000/proxy/uploads/${filename}`;
                        needsUpdate = true;
                    }
                }
            }

            if (needsUpdate) await song.save();
        }

        console.log(`\n✨ Migration Completed.`);
        process.exit(0);
    } catch (err) {
        console.error("❌ Process failed:", err);
        process.exit(1);
    }
}

migrate();
