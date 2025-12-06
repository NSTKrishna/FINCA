# FINCA - AI-Powered Financial Document Analysis

FINCA is a sophisticated full-stack web application designed to simplify financial document management. It allows users to upload financial reports (PDFs), enabling automatic AI-powered summarization and extraction of key figures using Google's Gemini models.

## 🚀 Features

*   **Secure Authentication**: User signup and login functionality.
*   **Document Management**: Upload, view, and delete financial PDF documents.
*   **AI Analysis**: Automatically extracting summaries, key financial figures, dates, and topics from PDFs using the **Gemini 2.0 Flash** model.
*   **Interactive Dashboard**: Visualizes data, including storage usage, analyzed report metrics, and latest AI insights.
*   **Smart Caching**: Persists analysis results in the database to prevent redundant API calls and ensure instant load times.

## 🛠️ Technology Stack

### Client-Side
*   **React.js** (Vite): Fast and modern frontend framework.
*   **Tailwind CSS**: For a premium, responsive, and clean UI design.
*   **Lucide React**: Beautiful iconography.
*   **Axios**: For handling API requests.

### Server-Side
*   **Node.js & Express**: Robust backend API.
*   **Prisma ORM**: Type-safe database interactions with **PostgreSQL** (Neon.tech).
*   **Google Generative AI SDK**: Integration with Gemini 2.0 Flash for document intelligence.
*   **Cloudinary**: Secure cloud storage for PDF files.
*   **pdf2json**: Efficient server-side PDF text extraction.

## ⚙️ Setup & Installation

### Prerequisites
*   Node.js (v16+)
*   PostgreSQL database (or a connection string from a provider like Neon/Supabase)
*   Cloudinary Account
*   Google Gemini API Key

### 1. Clone the Repository
```bash
git clone <repository-url>
cd FINCA
```

### 2. Backend Setup
Navigate to the server directory and install dependencies:
```bash
cd Server
npm install
```

Create a `.env` file in the `Server` directory with the following variables:
```env
PORT=3000
DATABASE_URL="postgresql://user:password@host:port/dbname?sslmode=require"
JWT_SECRET="your_very_secure_jwt_secret"

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Google Gemini API
GEMINI_API_KEY="your_gemini_api_key"
```

Run Database Migrations:
```bash
npx prisma db push
```

Start the Server:
```bash
npm run start
# OR for development
npm run dev
```

### 3. Frontend Setup
Navigate to the client directory and install dependencies:
```bash
cd ../Client
npm install
```

Start the Development Server:
```bash
npm run dev
```

The application should now be accessible at `http://localhost:5173`.

## 📂 Project Structure

```
FINCA/
├── Client/                 # React Frontend
│   ├── src/
│   │   ├── component/      # Reusable UI components
│   │   ├── pages/          # Application pages (Dashboard, Report, Login)
│   │   ├── context/        # Auth Context
│   │   └── ...
│   └── ...
├── Server/                 # Node.js Backend
│   ├── Controllers/        # Business logic (Upload, Auth)
│   ├── Routes/             # API Routes
│   ├── prisma/             # Database Schema
│   └── ...
└── README.md               # Project Documentation
```

## 🔐 API Endpoints

*   **Auth**: `/api/auth/signup`, `/api/auth/login`
*   **Uploads**:
    *   `POST /api/upload/single`: Upload a PDF.
    *   `GET /api/upload/user-documents`: Get list of uploaded docs.
    *   `GET /api/upload/summarize/:fileId`: Trigger AI analysis.
    *   `DELETE /api/upload/:fileId`: Delete a document.

## 📝 License

This project is open-source and available for educational and personal use.
