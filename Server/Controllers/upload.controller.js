const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const path = require("path");
const prisma = require("../db/config");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "finca-uploads",
    allowed_formats: ["pdf"],
    resource_type: "raw", // Important for PDF files
    public_id: (req, file) => {
      // Generate unique filename with timestamp
      const timestamp = Date.now();
      const originalName = path.parse(file.originalname).name;
      return `pdf_${timestamp}_${originalName}`;
    },
  },
});

// File filter to allow only PDF files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed!"), false);
  }
};

// Configure Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Upload single PDF file
const uploadPDF = (req, res) => {
  try {
    // Use multer middleware
    const uploadSingle = upload.single("file");

    uploadSingle(req, res, (err) => {
      if (err) {
        console.error("Upload error:", err);

        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
              success: false,
              message: "File too large. Maximum size allowed is 10MB.",
            });
          }
        }

        return res.status(400).json({
          success: false,
          message: err.message || "File upload failed.",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded.",
        });
      }

      // File uploaded successfully
      (async () => {
        try {
          console.log("Debug - Saving to DB. User:", req.user);
          console.log("Debug - File info:", req.file);

          const newDoc = await prisma.document.create({
            data: {
              fileName: req.file.originalname,
              fileUrl: req.file.path,
              fileId: req.file.filename,
              size: req.file.size,
              userId: req.user.id,
            },
          });

          res.status(200).json({
            success: true,
            message: "File uploaded successfully.",
            data: {
              fileId: req.file.filename,
              url: req.file.path,
              originalName: req.file.originalname,
              size: req.file.size,
              uploadedAt: newDoc.uploadedAt,
              dbId: newDoc.id,
            },
          });
        } catch (dbError) {
          console.error("Database save error:", dbError);
          // Try to cleanup cloudinary if db save fails
          await cloudinary.uploader.destroy(req.file.filename, { resource_type: "raw" });

          return res.status(500).json({
            success: false,
            message: "Failed to save file metadata.",
          });
        }
      })();
    });
  } catch (error) {
    console.error("Upload controller error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// Delete file from Cloudinary and Database
const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const userId = req.user.id;

    console.log(`Debug: Attempting delete. FileId: ${fileId}, UserId: ${userId}`);

    if (!fileId) {
      return res.status(400).json({
        success: false,
        message: "File ID is required.",
      });
    }

    // Find the document to ensure it belongs to the user and gets the correct Cloudinary ID
    // fileId in params corresponds to the fileId field (which is the cloudinary filename)
    const document = await prisma.document.findFirst({
      where: {
        fileId: fileId,
        userId: userId
      }
    });

    console.log("Debug: Found document:", document);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found or access denied.",
      });
    }

    // Delete from Database
    await prisma.document.delete({
      where: {
        id: document.id
      }
    });

    console.log("Debug: Deleted from DB");

    // Delete from Cloudinary
    // fileId matches the cloudinary public_id for raw files in this setup
    const result = await cloudinary.uploader.destroy(fileId, {
      resource_type: "raw",
    });

    console.log("Debug: Cloudinary result:", result);

    if (result.result === "ok" || result.result === "not found") {
      res.status(200).json({
        success: true,
        message: "File deleted successfully.",
      });
    } else {
      // Ideally we might want to log this but we already deleted from DB so from user perspective it's gone
      console.warn(`Cloudinary delete result for ${fileId}: ${result.result}`);
      res.status(200).json({
        success: true,
        message: "File deleted from database (Cloudinary status: " + result.result + ")",
      });
    }
  } catch (error) {
    console.error("Delete file error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete file: " + error.message,
    });
  }
};

// Get file info from Cloudinary
const getFileInfo = async (req, res) => {
  try {
    const { fileId } = req.params;

    if (!fileId) {
      return res.status(400).json({
        success: false,
        message: "File ID is required.",
      });
    }

    // Get file info from Cloudinary
    const result = await cloudinary.api.resource(fileId, {
      resource_type: "raw",
    });

    res.status(200).json({
      success: true,
      data: {
        fileId: result.public_id,
        url: result.secure_url,
        format: result.format,
        size: result.bytes,
        createdAt: result.created_at,
      },
    });
  } catch (error) {
    console.error("Get file info error:", error);
    res.status(404).json({
      success: false,
      message: "File not found.",
    });
  }
};

// Get all documents for the authenticated user
const getUserDocuments = async (req, res) => {
  try {
    const userId = req.user.id;

    const documents = await prisma.document.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        uploadedAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      data: documents,
    });
  } catch (error) {
    console.error("Get user documents error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch documents.",
    });
  }
};

module.exports = {
  uploadPDF,
  deleteFile,
  getFileInfo,
  getUserDocuments,
};

