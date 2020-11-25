var express = require('express');
var router = express.Router();
//Librerias:
//Validaciones
const { check, validationResult, Result } = require('express-validator');

//Schemas:
const mongoose = require('mongoose');
const Venta = mongoose.model('Venta');

/* GET users listing. */
router.get('/', async(req, res) => {
    await Venta.find((err, venta) => {
        if (err)
            return res.send(err);

        res.send(venta);
    })
});

//Consultar si hay una venta pendiente
router.post('/buscar-venta-pendiente', async(req, res) => {
    const venta = await Venta.findOne({ '$and': [{ 'empleado.correo': req.body.correoEmp }, { 'estatus': 'en proceso' }] });

    if (!venta)
        return res.status(404).send(false);

    res.status(200).send(venta);
});

//consultar venta, producto en venta-proceso
router.post('/buscar-producto-venta', async(req, res) => {
    const venta = await Venta.findOne({ '$and': [{ 'empleado.correo': req.body.corroeEmp }, { estatus: 'en proceso' }, { 'tiene.codigoProd': req.body.codigoProd }] });

    if (!venta)
        return res.status(404).send(false);

    res.status(200).send(venta.tiene);
});

//Agregar 
router.post('/', async(req, res) => {
    const errores = validationResult(req);

    if (!errores.isEmpty())
        return res.status(422).json({ errors: errores.array() });

    let venta = new Venta({
        total: req.body.total,
        estatus: req.body.estatus,
        empleado: {
            correo: req.body.correoEmp,
            nombre: req.body.nombreEmp,
            apellidos: req.body.apellidosEmp,
            telefono: req.body.telefonoEmp
        },
        tiene: [{
            codigoProd: req.body.codigoProd,
            precioProd: req.body.precioProd,
            nombreProd: req.body.nombreProd,
            cantidadProd: req.body.cantidadProd,
            monto: req.body.monto
        }]
    });

    await venta.save();
    res.status(200).send(venta);
});

//Agregar producto a tiene
router.post('/agregar-producto', async(req, res) => {
    let venta = await Venta.findOne({ '$and': [{ 'empleado.correo': 'daniel@cremeria.com' }, { 'estatus': 'en proceso' }] });

    if (!venta)
        return res.status(404).send(false);

    tieneArray = [{
        codigoProd: req.body.codigoProd,
        precioProd: req.body.precioProd,
        nombreProd: req.body.nombreProd,
        cantidadProd: req.body.cantidadProd,
        monto: req.body.monto
    }];

    venta.tiene = venta.tiene.concat(tieneArray);

    await venta.save();

    res.status(201).send(venta);
});

//Eliminar un producto del objeto tiene
router.post('/eliminar-producto', async(req, res) => {
    let venta = await Venta.findOne({ _id: req.body.id });

    if (!venta)
        return res.status(404).send(false);

    venta.tiene = venta.tiene.pull({ _id: req.body.idProd });

    await venta.save();

    res.status(201).send(venta);
});

//modificar cantidad y el monto de un producto
router.put('/modificar-prod', async(req, res) => {
    let venta = Venta.findOne({ '$and': [{ 'tiene._id': req.body._id }, { 'tiene.codigoProd': req.body.codigoProd }] });

    if (!venta)
        return res.status(404).send(false);

    productoMod = await Venta.update({ '$and': [{ 'tiene._id': req.body._id }, { 'tiene.codigoProd': req.body.codigoProd }] }, {
        $set: {
            'tiene.$.cantidadProd': req.body.cantidadProd,
            'tiene.$.monto': req.body.monto,
        }
    }, {
        new: true
    });

    res.send(productoMod);
})

//eliminar pedido
router.post('/eliminar', async(req, res) => {
    let venta = await Venta.findOne({ _id: req.body._id });

    if (!venta)
        return res.status(404).send(false);

    venta_eliminada = await Venta.findOneAndDelete({ _id: req.body._id });

    res.send(venta);
})

//Finalizar venta
router.put('/finalizarventa', async(req, res) => {
    let venta = Venta.findOne({ '$and': [{ 'empleado.correo': req.body.correoEmp }, { 'estatus': 'en proceso' }] });

    if (!venta)
        return res.status(404).send(false);

    venta_finalizada = await Venta.findOneAndUpdate({ '$and': [{ 'empleado.correo': req.body.correoEmp }, { 'estatus': 'en proceso' }] }, {
            'estatus': 'Finalizada',
            'total': req.body.total
        },

    )
    res.send(venta_finalizada);

})


module.exports = router;