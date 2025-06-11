const express = require('express');
const app = express();
const connectDB = require('./config/db.config');
const authRoutes = require('./routes/auth.routes');
const config = require('./config/main.config');
const PORT = config.port || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


connectDB()

app.get('/', (req, res) => {
    res.send('Welcome to the VC Project API!');
});

app.use('api',authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



