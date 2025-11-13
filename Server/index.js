const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config();
const app = express();

app.use(cookieParser());
app.use(express.json());

const mainRoutes = require('./Routes/mainRoutes');
app.use("/api", mainRoutes);


app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}`);
});