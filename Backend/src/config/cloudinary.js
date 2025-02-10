import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });


import { v2 as cloudinary } from 'cloudinary';

// console.log("Cloudinary Variables:", process.env.CLOUDINARY_CLOUD_NAME, process.env.CLOUDINARY_API_KEY, process.env.CLOUDINARY_API_SECRET);


if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  throw new Error('Cloudinary environment variables missing!');
}

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

export const uploadToCloudinary = async (fileBuffer, fileFormat) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { resource_type: 'auto', folder: 'Absens_HOF', format: fileFormat },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    ).end(fileBuffer); // <-- Send buffer instead of file path
  });
};


export default cloudinary;