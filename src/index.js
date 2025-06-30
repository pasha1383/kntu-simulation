const express = require('express');
const app = express();
const path = require('path');
const connectDB = require('./config/db.config');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes'); // Routes for general user actions and profile management
const courseRoutes = require('./routes/course.routes');
const announcementRoutes = require('./routes/announcement.routes'); // NEW: Import announcement routes


const config = require('./config/main.config');
const PORT = config.port || 5000;
const { verifyToken } = require('./middleware/authJwt'); // Middleware for JWT verification


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

app.use(verifyToken)

app.use('/api', userRoutes)
app.use('/api', courseRoutes);
app.use('/api', announcementRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack); // Log the stack trace for debugging
    res.status(500).send('Something broke on the server!'); // Send a generic error response
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Access login page: http://localhost:${PORT}/login`);
    console.log(`Access registration page: http://localhost:${PORT}/register.html`);
});



