var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
//mongoose
const mongoose = require('mongoose');

//conexion a la base de datos
mongoose.connect("mongodb+srv://DevYou:devyou123@cluster0.j7fv1.mongodb.net/Cremeria-Liz", { useNewUrlParser: true, useUnifiedTopology: true });

//Schemas 
require('./models/Empleado');
require('./models/Cliente');
require('./models/Proveedor');

//Referencia al archivo fisico a las rutas
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var empleadoRouter = require('./routes/empleados');
var loginRouter = require('./routes/login');
var clienteRouter = require('./routes/clientes');
var proveedorRouter = require('./routes/proveedores');

var app = express();

//conexion Angular y Express
app.use(cors({
    "origin": "http://localhost:4200",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Rutas
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/empleados', empleadoRouter)
app.use('/login', loginRouter);
app.use('/clientes', clienteRouter)
app.use('/proveedores', proveedorRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;