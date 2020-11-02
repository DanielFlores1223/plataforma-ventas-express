var express = require('express');
var router = express.Router();
//Librerias: 
//validaciones
const { check, validationResult, Result } = require('express-validator');
//encriptacion
const bcyrpt = require('bcrypt');

//Schemas:
const mongoose = require('mongoose');
const Cliente = mongoose.model('Cliente');


/* GET users listing. */
router.get('/', async(req, res) => {
    await Cliente.find((err, cliente) => {
        if (err)
            return res.send(err);

        res.send(cliente);
    })
});

//Insertar
router.post('/', async(req, res) => {

    //encriptacion de la contraseña del cliente
    const salt = await bcyrpt.genSalt(10);
    const passCifrado = await bcyrpt.hash(req.body.contrasenia, salt);

    let cliente = new Cliente({
        nombre: req.body.nombre,
        apellidoP: req.body.apellidoP,
        apellidoM: req.body.apellidoM,
        telefono: req.body.telefono,
        estatus: req.body.estatus,
        correo: req.body.correo,
        contrasenia: passCifrado,
        fechaNac: req.body.fechaNac,
        tipo: req.body.tipo
    });

    await cliente.save();
    res.status(200).send(cliente);

});

module.exports = router;