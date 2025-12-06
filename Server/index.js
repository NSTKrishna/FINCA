const express = require('express');
// Force restart for Prisma Client update
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require("cors");
dotenv.config();
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

const mainRoutes = require('./Routes/mainRoutes');
app.use("/api", mainRoutes);


app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}`);
});