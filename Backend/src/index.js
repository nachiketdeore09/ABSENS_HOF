import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import app from './app.js';

// Create ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables first
dotenv.config({ 
  path: path.resolve(__dirname, '../.env') // Adjusted path based on typical project structure
});

// console.log('Cloudinary Config:', {
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });


// Verify environment variables
// console.log('Environment variables:', {
//   MONGO_URI: process.env.MONGODB_URI,
//   NODE_ENV: process.env.NODE_ENV,
//   PORT: process.env.PORT
// });

// Database connection and server start
connectDB()
  .then(() => {
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize server:', error);
    process.exit(1);
  });