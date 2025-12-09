const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../MIddlewares/auth.middleware");
const {
  uploadPDF,
  deleteFile,
  getFileInfo,
  getUserDocuments,
  summarizeDocument,
} = require("../Controllers/upload.controller");

router.use(authMiddleware);

router.post("/single", uploadPDF);

router.delete("/:fileId", deleteFile);

router.get("/user-documents", getUserDocuments);

router.get("/summarize/:fileId", summarizeDocument);

router.get("/:fileId", getFileInfo);

module.exports = router;
