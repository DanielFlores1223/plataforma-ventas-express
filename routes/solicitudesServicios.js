var express = require('express');
var router = express.Router();
//validaciones
const { check, validationResult, Result } = require('express-validator');

//Schemas:
const mongoose = require('mongoose');
const SolicitudServicio = mongoose.model('SolicitudServicio');

router.get('/', async(req, res) => {
    const solicitudes = await SolicitudServicio.find();

    res.status(200).send(solicitudes);
});

router.post('/buscar-like-cel', async(req, res) => {
    const solicitudes = await SolicitudServicio.find({ numCelular: { '$regex': req.body.numCelular, '$options': 'i' } });

    if (!solicitudes)
        return res.status(404).send(false);

    res.status(200).send(solicitudes);
})

router.post('/buscar-like-cel-estatus', async(req, res) => {
    const solicitudes = await SolicitudServicio.find({ '$and': [{ numCelular: { '$regex': req.body.numCelular, '$options': 'i' } }, { estatus: req.body.estatus }] });

    if (!solicitudes)
        return res.status(404).send(false);

    res.status(200).send(solicitudes);
})

router.post('/', [
    check('numCelular').isLength({ min: 1 })
], async(req, res) => {
    const errores = validationResult(req);

    if (!errores.isEmpty())
        return res.status(422).json({ errors: errores.array() });

    let solicitudes = new SolicitudServicio({
        numCelular: req.body.numCelular,
        estatus: req.body.estatus,
        cliente: {
            nombre: req.body.nombreCli,
            apellidos: req.body.apellidosCli,
            telefono: req.body.telefonoCli,
            correo: req.body.correoCli
        },
        empleado: {
            correo: "",
            nombre: "",
            apellidos: "",
            telefono: ""
        },
        servicio: {
            nombre: req.body.nombreS,
            precio: req.body.precioS
        }
    })

    await solicitudes.save();
    res.status(200).send(solicitudes);
});

//modificar
router.put('/modificar-estatus-emp', async(req, res) => {
    const solicitud = await SolicitudServicio.findOne({ _id: req.body.id });

    if (!solicitud)
        return res.status(404).send(false);

    const solicitud_actualizada = await SolicitudServicio.findOneAndUpdate({ _id: req.body.id }, {
        estatus: req.body.estatus,
        empleado: {
            correo: req.body.correoEmp,
            nombre: req.body.nombreEmp,
            apellidos: req.body.apellidosEmp,
            telefono: req.body.telefonoEmp
        }
    }, {
        new: true
    })

    res.send(solicitud_actualizada);

});


//eliminar pedido
router.post('/eliminar', async(req, res) => {
    let solicitud = await SolicitudServicio.findOne({ _id: req.body.id });

    if (!solicitud)
        return res.status(404).send(false);

    solicitud_eliminado = await SolicitudServicio.findOneAndDelete({ _id: req.body.id });

    res.send(solicitud);
})



module.exports = router;