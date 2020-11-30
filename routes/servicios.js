var express = require('express');
var router = express.Router();

//Schemas:
const mongoose = require('mongoose');
const Servicio = mongoose.model('Servicio');

router.get('/', async(req, res) => {
    const servicios = await Servicio.find();

    res.status(200).send(servicios);
})

router.post('/', async(req, res) => {
    let servicio = new Servicio({
        nombre: req.body.nombre,
        boton: req.body.boton,
        precio: req.body.precio,
        img: req.body.img
    });

    await servicio.save();
    res.status(200).send(servicio);
})

module.exports = router;