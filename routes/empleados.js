var express = require('express');
var router = express.Router();
//Librerias: 
//validaciones
const { check, validationResult, Result } = require('express-validator');
//encriptacion
const bcyrpt = require('bcrypt');

//Schemas:
const mongoose = require('mongoose');
const Empleado = mongoose.model('Empleado');


/* GET users listing. */
router.get('/', async(req, res) => {
    await Empleado.find((err, empleado) => {
        if (err)
            return res.send(err);

        res.send(empleado);
    })
});

module.exports = router;