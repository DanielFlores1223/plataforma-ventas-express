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

router.post('/buscar-like', async(req, res) => {

    const empleados = await Empleado.find({ '$or': [{ nombre: { '$regex': req.body.nombre, '$options': 'i' } }, { apellidos: { '$regex': req.body.nombre, '$options': 'i' } }] });

    if (!empleados)
        return res.status(404).send(false);

    res.status(200).send(empleados);
})


//insertar
router.post('/', [
    //validaciones
    check('nombre').isLength({ min: 1 }),
    check('apellidos').isLength({ min: 1 }),
    check('telefono').isLength({ min: 1 }),
    check('sueldo').isLength({ min: 1 }),
    check('correo').isLength({ min: 1 }),
    check('correo').isEmail(),
], async(req, res) => {

    const errores = validationResult(req);

    if (!errores.isEmpty())
        return res.status(422).json({ errors: errores.array() });

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


//modificar empleado (sin contraseña)
router.put('/', async(req, res) => {
    const empleado = await Empleado.findOne({ correo: req.body.correo });

    if (!empleado)
        return res.status(400).send(false);


    empleadoMod = await Empleado.findOneAndUpdate({ correo: req.body.correo }, {
        //campos a modificar
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        telefono: req.body.telefono,
        sueldo: req.body.sueldo,
        correo: req.body.correo,
        fechaNac: req.body.fechaNac,
        tipo: req.body.tipo
    }, {
        new: true
    });

    res.send(empleadoMod);
});

router.put('/modificar-contrasenia', async(req, res) => {
    const empleado = await Empleado.findOne({ correo: req.body.correo });

    if (!empleado)
        return res.status(400).send(false);

    const salt = await bcyrpt.genSalt(10);
    const contraCifrada = await bcyrpt.hash(req.body.contrasenia, salt);

    empleadoMod = await Empleado.findOneAndUpdate({ correo: req.body.correo }, {
        //modificar contraseña
        contrasenia: contraCifrada
    }, {
        new: true
    });
    res.send(empleadoMod);
});

//Eliminar
router.post('/eliminar', async(req, res) => {
    const empleado = await Empleado.findOne({ correo: req.body.correo });

    if (!empleado)
        return res.status(400).send(false);

    empelado_eliminado = await Empleado.findOneAndDelete({ correo: req.body.correo });

    res.send(empleado);
})


module.exports = router;