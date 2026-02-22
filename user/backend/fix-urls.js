const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET,
});

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/rr';

async function fix() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB");

        const collection = mongoose.connection.db.collection('musics');

        // Fetch actual assets from Cloudinary
        const songRes = await cloudinary.api.resources({ type: 'upload', prefix: 'musichub/songs', resource_type: 'video' });
        const coverRes = await cloudinary.api.resources({ type: 'upload', prefix: 'musichub/covers', resource_type: 'image' });

        if (songRes.resources.length === 0 || coverRes.resources.length === 0) {
            console.log("❌ No assets found in Cloudinary folders.");
            process.exit(1);
        }

        const actualSongUrl = songRes.resources[0].secure_url;
        const actualCoverUrl = coverRes.resources[0].secure_url;

        console.log("Found Song URL:", actualSongUrl);
        console.log("Found Cover URL:", actualCoverUrl);

        const targetId = "6999fed2224f59095005fefe";
        const result = await collection.updateOne(
            { _id: new mongoose.Types.ObjectId(targetId) },
            {
                $set: {
                    fileUrl: actualSongUrl,
                    coverImage: actualCoverUrl
                }
            }
        );

        if (result.modifiedCount > 0) {
            console.log("✨ Successfully updated the song in DB with real Cloudinary URLs.");
        } else {
            console.log("ℹ️ No changes made (URLs might already be correct).");
        }

        process.exit(0);
    } catch (err) {
        console.error("❌ Fix failed:", err);
        process.exit(1);
    }
}

fix();
