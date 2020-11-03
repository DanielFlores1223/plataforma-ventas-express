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
const Cliente = mongoose.model('Cliente');

//Login
router.post('/', [
    //validaciones
    check('correo').isEmail(),
    check('contrasenia').isLength({ min: 1 })
], async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty)
        return res.status(422).json({ errors: errors.array() });

    let usuario = await Empleado.findOne({ correo: req.body.correo });

    //si no se encontro el usuario en empleado, se busca en cliente
    if (!usuario)
        usuario = await Cliente.findOne({ correo: req.body.correo });

    if (!usuario)
        return res.status(400).send('Datos incorrectos');

    //comparar contraseña
    let pass = await bcyrpt.compare(req.body.contrasenia, usuario.contrasenia);

    if (!pass)
        return res.status(400).send('Datos incorrectos');

    //token
    const jwtoken = usuario.generadorJWT();
    const envio = jwtoken + "," + usuario.nombre + "," + usuario.tipo + "," + usuario.correo;
    res.status(201).send({ envio });
});





module.exports = router;