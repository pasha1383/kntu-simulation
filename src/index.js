require("dotenv").config()
const express = require('express'); // Example user routes
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



