# FINCA.AI Upload Service

This service handles PDF file uploads and stores them in Cloudinary using Multer middleware.

## Setup

### 1. Install Dependencies

```bash
cd Server
npm install multer cloudinary express-fileupload
```

### 2. Configure Cloudinary

1. Sign up for a Cloudinary account at [cloudinary.com](https://cloudinary.com)
2. Get your Cloud Name, API Key, and API Secret from the dashboard
3. Update your `.env` file with the Cloudinary credentials:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Environment Variables

Make sure your `.env` file includes:

```env
PORT=3000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## API Endpoints

### Upload Single PDF

```
POST /api/upload/single
Content-Type: multipart/form-data

Form Data:
- file: PDF file (max 10MB)
```

**Response:**

```json
{
  "success": true,
  "message": "File uploaded successfully.",
  "data": {
    "fileId": "pdf_1234567890_filename",
    "url": "https://res.cloudinary.com/.../raw/upload/v1234567890/finca-uploads/pdf_1234567890_filename.pdf",
    "originalName": "document.pdf",
    "size": 2457600,
    "uploadedAt": "2024-12-04T10:30:00.000Z"
  }
}
```

### Upload Multiple PDFs

```
POST /api/upload/multiple
Content-Type: multipart/form-data

Form Data:
- files: PDF files (max 10 files, 10MB each)
```

**Response:**

```json
{
  "success": true,
  "message": "2 file(s) uploaded successfully.",
  "data": [
    {
      "fileId": "pdf_1234567890_file1",
      "url": "https://res.cloudinary.com/...",
      "originalName": "file1.pdf",
      "size": 1234567,
      "uploadedAt": "2024-12-04T10:30:00.000Z"
    },
    {
      "fileId": "pdf_1234567890_file2",
      "url": "https://res.cloudinary.com/...",
      "originalName": "file2.pdf",
      "size": 2345678,
      "uploadedAt": "2024-12-04T10:30:00.000Z"
    }
  ]
}
```

### Get File Information

```
GET /api/upload/:fileId
```

**Response:**

```json
{
  "success": true,
  "data": {
    "fileId": "pdf_1234567890_filename",
    "url": "https://res.cloudinary.com/...",
    "format": "pdf",
    "size": 2457600,
    "createdAt": "2024-12-04T10:30:00.000Z"
  }
}
```

### Delete File

```
DELETE /api/upload/:fileId
```

**Response:**

```json
{
  "success": true,
  "message": "File deleted successfully."
}
```

## Client Usage

The upload functionality is integrated into the dashboard. Users can:

1. Navigate to `/upload` in the dashboard
2. Drag and drop PDF files or click to browse
3. Upload files individually or in bulk
4. View upload progress and status
5. Access uploaded files via the returned URLs

## Security Features

- **Authentication Required**: All upload endpoints require valid JWT token
- **File Type Validation**: Only PDF files are accepted
- **File Size Limits**: Maximum 10MB per file
- **Unique File Names**: Files are stored with timestamp-based unique names
- **Cloud Storage**: Files are securely stored in Cloudinary

## Error Handling

The service handles various error scenarios:

- Invalid file types
- File size exceeded
- Upload failures
- Authentication errors
- Missing files

All errors return appropriate HTTP status codes and descriptive error messages.
