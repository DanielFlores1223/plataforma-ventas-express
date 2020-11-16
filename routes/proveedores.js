var express = require('express');
var router = express.Router();
//Librerias: 
//validaciones
const { check, validationResult, Result } = require('express-validator');

//Schemas:
const mongoose = require('mongoose');
const Proveedor = mongoose.model('Proveedor');

/* GET users listing. */
router.get('/', async(req, res) => {
    await Proveedor.find((err, proveedor) => {
        if (err)
            return res.send(err);

        res.send(proveedor);
    })
});

//consulta especifica id
router.post('/buscar-prov-id', async(req, res) => {
    const proveedor = await Proveedor.findOne({ _id: req.body._id });
    if (!proveedor)
        return res.status(404).send(false);

    res.status(200).send(proveedor);
});

//buscar like
router.post('/buscar-like', async(req, res) => {
    const proveedores = await Proveedor.find({ '$or': [{ nombreProveedor: { '$regex': req.body.nombre, '$options': 'i' } }, { nombreAgente: { '$regex': req.body.nombre, '$options': 'i' } }] });

    if (!proveedores)
        return res.status(404).send(false);

    res.status(200).send(proveedores);
});

router.post('/', [
    //validaciones
    check('nombreProveedor').isLength({ min: 1 }),
    check('nombreAgente').isLength({ min: 1 }),
    check('horario').isLength({ min: 1 }),
    check('telefono').isLength({ min: 1 }),
], async(req, res) => {
    const errores = validationResult(req);

    if (!errores.isEmpty())
        return res.status(422).json({ errors: errores.array() });

    let proveedor = new Proveedor({
        nombreProveedor: req.body.nombreProveedor,
        nombreAgente: req.body.nombreAgente,
        categoria: req.body.categoria,
        horario: req.body.horario,
        telefono: req.body.telefono
    });

    await proveedor.save();
    res.status(200).send(proveedor);
});

//modificar proveedor
router.put('/', [
    //validaciones
    check('nombreProveedor').isLength({ min: 1 }),
    check('nombreAgente').isLength({ min: 1 }),
    check('horario').isLength({ min: 1 }),
    check('telefono').isLength({ min: 1 }),
], async(req, res) => {
    const errores = validationResult(req);

    if (!errores.isEmpty())
        return res.status(422).json({ errors: errores.array() });

    proveedorMod = await Proveedor.findOneAndUpdate({ _id: req.body._id }, {
        nombreProveedor: req.body.nombreProveedor,
        nombreAgente: req.body.nombreAgente,
        categoria: req.body.categoria,
        horario: req.body.horario,
        telefono: req.body.telefono
    }, {
        new: true
    });

    res.send(proveedorMod);
});

//eliminar
router.post('/eliminar', async(req, res) => {
    const proveedor = await Proveedor.findOne({ _id: req.body._id });

    if (!proveedor)
        return res.status(400).send(false);

    proveedor_eliminado = await Proveedor.findByIdAndDelete({ _id: req.body._id });

    res.send(proveedor);
})


module.exports = router;