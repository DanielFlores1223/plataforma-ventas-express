var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//mongoose
const mongoose = require('mongoose');

//conexion a la base de datos
mongoose.connect("mongodb+srv://DevYou:devyou123@cluster0.j7fv1.mongodb.net/Cremeria-Liz", { useNewUrlParser: true, useUnifiedTopology: true });

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;