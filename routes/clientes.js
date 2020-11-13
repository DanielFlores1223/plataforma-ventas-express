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
        return res.status(404).send(false);

    res.status(200).send(cliente);
});

router.post('/buscar-like', async(req, res) => {

    const clientes = await Cliente.find({ '$or': [{ nombre: { '$regex': req.body.nombre, '$options': 'i' } }, { apellidos: { '$regex': req.body.nombre, '$options': 'i' } }] });

    if (!clientes)
        return res.status(404).send(false);

    res.status(200).send(clientes);
})

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

//modificar perfil

//modificar cliente
router.put('/', async(req, res) => {
    const cliente = await Cliente.findOne({ correo: req.body.correo });

    if (!cliente)
        return res.status(400).send(false);

    clienteMod = await Cliente.findOneAndUpdate({ correo: req.body.correo }, {
        //campos a modificar
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        telefono: req.body.telefono,
        correo: req.body.correo,
        tipo: req.body.tipo
    }, {
        new: true
    });

    res.send(clienteMod);
});

router.put('/modificar-contrasenia', async(req, res) => {
    const cliente = await Cliente.findOne({ correo: req.body.correo });

    if (!cliente)
        return res.status(400).send(false);

    const salt = await bcyrpt.genSalt(10);
    const contraCifrada = await bcyrpt.hash(req.body.contrasenia, salt);

    clienteMod = await Cliente.findOneAndUpdate({ correo: req.body.correo }, {
        //modificar contraseña
        contrasenia: contraCifrada
    }, {
        new: true
    });
    res.send(clienteMod);
});

//Eliminar
router.post('/eliminar', async(req, res) => {
    const cliente = await Cliente.findOne({ correo: req.body.correo });

    if (!cliente)
        return res.status(400).send(false);

    cliente_eliminado = await Cliente.findOneAndDelete({ correo: req.body.correo });

    res.send(cliente_eliminado);

})

module.exports = router;