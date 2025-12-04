const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const path = require("path");

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
      res.status(200).json({
        success: true,
        message: "File uploaded successfully.",
        data: {
          fileId: req.file.filename,
          url: req.file.path,
          originalName: req.file.originalname,
          size: req.file.size,
          uploadedAt: new Date().toISOString(),
        },
      });
    });
  } catch (error) {
    console.error("Upload controller error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// Delete file from Cloudinary
const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    if (!fileId) {
      return res.status(400).json({
        success: false,
        message: "File ID is required.",
      });
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(fileId, {
      resource_type: "raw",
    });

    if (result.result === "ok") {
      res.status(200).json({
        success: true,
        message: "File deleted successfully.",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "File not found or already deleted.",
      });
    }
  } catch (error) {
    console.error("Delete file error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete file.",
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

module.exports = {
  uploadPDF,
  uploadMultiplePDFs,
  deleteFile,
  getFileInfo,
};
