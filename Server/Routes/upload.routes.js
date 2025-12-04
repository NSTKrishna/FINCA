const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../MIddlewares/auth.middleware");
const {
  uploadPDF,
  uploadMultiplePDFs,
  deleteFile,
  getFileInfo,
} = require("../Controllers/upload.controller");

// Apply authentication middleware to all upload routes
router.use(authMiddleware);

// Upload single PDF file
router.post("/single", uploadPDF);

// Delete a file
router.delete("/:fileId", deleteFile);

// Get file information
router.get("/:fileId", getFileInfo);

module.exports = router;
