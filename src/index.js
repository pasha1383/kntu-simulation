const express = require('express');
const app = express();
const path = require('path');
const connectDB = require('./config/db.config');
const authRoutes = require('./routes/auth.routes');
const config = require('./config/main.config');
const PORT = config.port || 5000;

connectDB()


app.set('view engine', 'ejs');
// Specify the directory for view files
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.send('Welcome to the VC Project API! Navigate to /login to view the login page.');
});

app.use('/api',authRoutes);

app.get('/login', (req, res) => {
    // Render the 'login.ejs' template and pass a title.
    // 'message' can be used later to display error messages from failed login attempts.
    res.render('login', { title: 'User Login', message: null });
});

app.use((err, req, res, next) => {
    console.error(err.stack); // Log the stack trace for debugging
    res.status(500).send('Something broke on the server!'); // Send a generic error response
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



