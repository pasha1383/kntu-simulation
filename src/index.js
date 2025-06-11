require("dotenv").config()
const express = require('express');
const app = express();
const connectDB = require('./config/db.config');
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


connectDB()

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



