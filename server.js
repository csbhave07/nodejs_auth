require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const mainRoute = require('./routes/main-routes');

const app = express();
const PORT = process.env.PORT || 3000;

// DB connection
connectDB();

// middleware
app.use(express.json());

// main routes
app.use('/api', mainRoute);

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})