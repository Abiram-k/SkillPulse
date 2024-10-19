const multer = require('multer');
const cloudinary = require("../config/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "Skillpulse_products", 
      allowed_formats: ["jpg", "png", "jpeg"],
    },
  });
  const uploadImage = multer({ storage: storage });
  
  module.exports = uploadImage;
