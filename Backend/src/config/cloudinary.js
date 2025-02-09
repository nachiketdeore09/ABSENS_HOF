import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

export const uploadToCloudinary = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { resource_type: 'auto', folder: 'question-papers' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    ).end(fileBuffer);
  });
};

export default cloudinary;