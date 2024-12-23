const cloudinary = '../config/cloudinary';

const upload = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'resumes',
      resource_type: 'auto',
    });

    return result.secure_url;

  } catch (error) {
    next(error);
  }
}

module.exports = { upload };