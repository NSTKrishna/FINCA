const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../MIddlewares/auth.middleware");
const {
  uploadPDF,
  deleteFile,
  getFileInfo,
  getUserDocuments,
} = require("../Controllers/upload.controller");

// Apply authentication middleware to all upload routes
router.use(authMiddleware);

// Upload single PDF file
router.post("/single", uploadPDF);

// Delete a file
router.delete("/:fileId", deleteFile);

// Get all user documents
router.get("/user-documents", getUserDocuments);

// Get file information
router.get("/:fileId", getFileInfo);

module.exports = router;
