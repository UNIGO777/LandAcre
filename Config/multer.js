import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(process.cwd(), 'storage'); // Set the destination folder using process.cwd()
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir); // Use the directory for storing files
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now(); // Get the current timestamp
    const newFileName = `${timestamp}_${file.originalname}`; // Prepend timestamp to the original file name
    cb(null, newFileName); // Use the new file name
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB limit for files
}); // Allow multiple files to be uploaded

// Middleware to handle the file upload
const handleFileUpload = async (req, res, next) => {
  // Make sure there are files in the request
  if (req.files && req.files.length > 0) { // Check if req.files exists and has files
    try {
      const uploadedFiles = req.files; // Access the uploaded files
      
      // Attach the file details to the request object
      req.uploadedFiles = uploadedFiles.map(file => ({
        path: file.filename, // Save only the filename
        originalName: file.originalname // Include the original file name
      })); // Store all uploaded file details
      next(); // Proceed to the next middleware
    } catch (error) {
      console.error('Error during file upload:', error.message);
      res.status(500).json({ error: 'Error during file upload: ' + error.message }); // Changed to JSON response
    }
  } else {
    next(); // Proceed to the next middleware if no files are present
  }
};

export { handleFileUpload, upload }; // Use ES6 export syntax