const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload image to cloudinary
exports.uploadImage = async (file, folder = 'classic-wardrobe') => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: folder,
      width: 800,
      height: 800,
      crop: 'limit',
      quality: 'auto:good'
    });

    return {
      public_id: result.public_id,
      url: result.secure_url
    };
  } catch (error) {
    throw new Error('Image upload failed');
  }
};

// Delete image from cloudinary
exports.deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image:', error);
  }
};

// Upload multiple images
exports.uploadMultipleImages = async (files, folder = 'classic-wardrobe') => {
  try {
    const uploadPromises = files.map(file => 
      cloudinary.uploader.upload(file, {
        folder: folder,
        width: 800,
        height: 800,
        crop: 'limit',
        quality: 'auto:good'
      })
    );

    const results = await Promise.all(uploadPromises);
    
    return results.map(result => ({
      public_id: result.public_id,
      url: result.secure_url
    }));
  } catch (error) {
    throw new Error('Multiple image upload failed');
  }
};

module.exports = cloudinary;