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

//consulta especifica
router.get('/buscar-cli-correo', async(req, res) => {
    const cliente = await Cliente.findOne({ correo: req.body.correo });
    const correo = req.body.correo;
    if (!cliente)
        return res.status(404).send("aui " + correo);

    res.status(200).send(cliente);
});

//Insertar
router.post('/', async(req, res) => {

    //encriptacion de la contraseña del cliente
    const salt = await bcyrpt.genSalt(10);
    const passCifrado = await bcyrpt.hash(req.body.contrasenia, salt);

    let cliente = new Cliente({
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        telefono: req.body.telefono,
        correo: req.body.correo,
        contrasenia: passCifrado,
        tipo: req.body.tipo
    });

    await cliente.save();
    res.status(200).send(cliente);

});

module.exports = router;