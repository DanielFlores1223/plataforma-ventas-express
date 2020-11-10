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
        return res.status(404).send(false);

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

//insertar
router.post('/', async(req, res) => {

    //encriptacion de la contraseña del empleado
    const salt = await bcyrpt.genSalt(10);
    const passCifrado = await bcyrpt.hash(req.body.contrasenia, salt);

    let empleado = new Empleado({
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        telefono: req.body.telefono,
        sueldo: req.body.sueldo,
        correo: req.body.correo,
        contrasenia: passCifrado,
        fechaNac: req.body.fechaNac,
        tipo: req.body.tipo
    });

    await empleado.save();
    res.status(200).send(empleado);

});

//modificar perfil


module.exports = router;