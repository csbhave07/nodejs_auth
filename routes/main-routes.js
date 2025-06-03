const express = require('express');
const authRoute = require('./auth-routes');
const homeRoute = require('./home-routes');
const adminRoute = require('./admin-routes');
const imageRoute = require('./image-routes');

const app = express();

app.use('/auth', authRoute);
app.use('/home', homeRoute);
app.use('/admin', adminRoute);
app.use('/image', imageRoute);

module.exports = app;