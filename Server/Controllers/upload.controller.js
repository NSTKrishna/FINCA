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
              // parsedText: text, // You might want to save the parsed text
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

// Get all documents for the authenticated user with search, filter, and sort
const getUserDocuments = async (req, res) => {
  try {
    const userId = req.user.id;
    const { search, startDate, endDate, sortBy, sortOrder } = req.query;

    console.log("Debug: getUserDocuments params:", { search, startDate, endDate, sortBy, sortOrder });

    // Build where clause
    const where = {
      userId: userId,
    };

    if (search) {
      where.fileName = {
        contains: search,
        mode: "insensitive",
      };
    }

    if (startDate || endDate) {
      where.uploadedAt = {};
      if (startDate) {
        where.uploadedAt.gte = new Date(startDate);
      }
      if (endDate) {
        // Set end date to end of the day if needed, or just strict comparison
        // Assuming endDate is just a date string, let's treat it inclusively
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.uploadedAt.lte = end;
      }
    }

    // Build orderBy clause
    let orderBy = {};
    if (sortBy && sortOrder) {
      // Allowed sort fields
      const allowedSortFields = ["fileName", "uploadedAt", "size"];
      if (allowedSortFields.includes(sortBy)) {
        orderBy[sortBy] = sortOrder.toLowerCase() === "asc" ? "asc" : "desc";
      } else {
        orderBy = { uploadedAt: "desc" };
      }
    } else {
      orderBy = { uploadedAt: "desc" };
    }

    const documents = await prisma.document.findMany({
      where: where,
      orderBy: orderBy,
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

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("CRITICAL ERROR: GEMINI_API_KEY is not defined in environment variables.");
}
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");
const genAI = new GoogleGenerativeAI(apiKey || "dummy_key_to_prevent_init_crash");

const summarizeDocument = async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ success: false, message: "Server configuration error: Gemini API Key is missing." });
    }

    const { fileId } = req.params;
    const userId = req.user.id;

    console.log(`Debug: Summarizing fileId: ${fileId} for user: ${userId}`);

    // 1. Get file URL and check for existing analysis
    const document = await prisma.document.findFirst({
      where: { fileId: fileId, userId: userId }
    });

    if (!document) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    // Check if analysis already exists
    if (document.analysis) {
      console.log("Debug: Returning cached analysis from DB.");
      return res.status(200).json({
        success: true,
        data: document.analysis
      });
    }

    console.log("Debug: Found document URL:", document.fileUrl);

    // 2. Download the PDF buffer
    console.log("Debug: Downloading PDF...");
    const response = await axios.get(document.fileUrl, { responseType: "arraybuffer" });
    const pdfBuffer = response.data;
    console.log(`Debug: Downloaded PDF, size: ${pdfBuffer.length} bytes`);

    // 3. Extract text
    console.log("Debug: Extracting text with pdf2json...");
    const PDFParser = require("pdf2json");

    const text = await new Promise((resolve, reject) => {
      const pdfParser = new PDFParser(null, 1); // 1 = raw text

      pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
      pdfParser.on("pdfParser_dataReady", pdfData => {
        const rawText = pdfParser.getRawTextContent();
        resolve(rawText);
      });

      pdfParser.parseBuffer(pdfBuffer);
    });
    console.log(`Debug: Extracted text length: ${text ? text.length : 0}`);

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ success: false, message: "Could not extract text from PDF. It might be scanned or empty." });
    }

    // 4. Call Gemini API
    console.log("Debug: Calling Gemini API...");
    // Using gemini-2.0-flash as listed in available models
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // JSON Prompt
    const prompt = `Analyze the following financial/business document and return a JSON object with the following structure:
    {
        "summary": "A concise summary of the document",
        "key_figures": ["Key figure 1", "Key figure 2"],
        "dates": ["Important date 1", "Important date 2"],
        "topics": ["Topic 1", "Topic 2"]
    }
    Ensure the response is valid JSON. Do not include markdown formatting like \`\`\`json.
    
    Document Text:
    ${text.substring(0, 30000)}`;

    const result = await model.generateContent(prompt);
    let summaryText = result.response.text();
    console.log("Debug: Gemini response received.");

    // Clean up potential markdown formatting if Gemini adds it despite instructions
    summaryText = summaryText.replace(/```json/g, "").replace(/```/g, "").trim();

    let summaryJson;
    try {
      summaryJson = JSON.parse(summaryText);
    } catch (e) {
      console.error("Failed to parse Gemini response as JSON:", summaryText);
      // Fallback if not valid JSON
      summaryJson = {
        summary: summaryText,
        key_figures: [],
        dates: [],
        topics: []
      };
    }

    // 5. Save analysis to DB
    console.log("Debug: Saving analysis to DB...");
    await prisma.document.update({
      where: { id: document.id },
      data: { analysis: summaryJson }
    });

    res.status(200).json({
      success: true,
      data: summaryJson
    });

  } catch (error) {
    console.error("Summarization error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to summarize document: " + error.message
    });
  }
};

module.exports = {
  uploadPDF,
  deleteFile,
  getFileInfo,
  getUserDocuments,
  summarizeDocument
};

