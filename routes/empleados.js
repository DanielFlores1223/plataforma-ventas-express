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

//consulta especifica
router.post('/buscar-emp-correo', async(req, res) => {
    const empleado = await Empleado.findOne({ correo: req.body.correo });
    const correo = req.body.correo;
    if (!empleado)
        return res.status(404).send("aui " + correo);

    res.status(200).send(empleado);
});
/*
router.get('/:correo', async(req, res) => {
    const empleado = await Empleado.findOne({ correo: req.params.correo });

    if (!empleado)
        return res.status(404).send(false);

    res.status(200).send(empleado);
});
*/


module.exports = router;