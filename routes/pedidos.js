var express = require('express');
var router = express.Router();
//Librerias: 
//validaciones
const { check, validationResult, Result } = require('express-validator');

//Schemas:
const mongoose = require('mongoose');
const Pedido = mongoose.model('Pedido');


//consultar pedido por id
router.post('/consultar-pedido-id', async(req, res) => {
    const pedido = await Pedido.findOne({ _id: req.body.id });

    if (!pedido)
        return res.status(404).send(false);

    res.status(200).send(pedido);
})

//buscar todos los pedidos diferente de carrito
router.get('/', async(req, res) => {
    pedidos = await Pedido.find({ estatus: { '$ne': 'en carrito' } });

    res.status(200).send(pedidos);
})


//consultar por estatus
router.post('/buscar-pedidos-estatus-cliente', async(req, res) => {
    const pedido = await Pedido.find({ '$and': [{ estatus: req.body.estatus }, { 'cliente.correo': req.body.correoCli }] });

    if (!pedido)
        return res.status(404).send(false);

    res.status(200).send(pedido);
});

//consultar si hay un pedido en carrito
router.post('/buscar-pedido-carrito', async(req, res) => {
    const pedido = await Pedido.findOne({ '$and': [{ 'cliente.correo': req.body.correoCli }, { estatus: 'en carrito' }] });

    if (!pedido)
        return res.status(404).send(false);

    res.status(200).send(pedido);
});

//consultar pedido, producto en carrito
router.post('/buscar-producto-carrito', async(req, res) => {
    const pedido = await Pedido.findOne({ '$and': [{ 'cliente.correo': req.body.correoCli }, { estatus: 'en carrito' }, { 'tiene.codigoProd': req.body.codigoProd }] });

    if (!pedido)
        return res.status(404).send(false);

    res.status(200).send(pedido.tiene);
});

router.post('/buscar-pedidos-diferente-carrito', async(req, res) => {
    const pedido = await Pedido.find({ '$and': [{ estatus: { '$ne': 'en carrito' } }, { 'cliente.correo': req.body.correoCli }] });

    if (!pedido)
        return res.status(404).send(false);

    res.status(200).send(pedido);
});

//buscar like con nombre cliente y _id pedido con filtro de estatus
router.post('/buscar-like-cliente-codigo-estatus', async(req, res) => {
    const pedidos = await Pedido.find({ '$and': [{ '$or': [{ 'cliente.nombre': { '$regex': req.body.nombre, '$options': 'i' } }, { 'cliente.apellidos': { '$regex': req.body.nombre } }, { 'cliente.correo': { '$regex': req.body.nombre } }] }, { estatus: req.body.estatus }] });

    if (!pedidos)
        return res.status(404).send(false);

    res.status(200).send(pedidos);
});

//buscar like con nombre cliente y _id pedido 
router.post('/buscar-like-cliente-codigo', async(req, res) => {
    const pedidos = await Pedido.find({ '$or': [{ 'cliente.nombre': { '$regex': req.body.nombre, '$options': 'i' } }, { 'cliente.apellidos': { '$regex': req.body.nombre } }, { 'cliente.correo': { '$regex': req.body.nombre } }] });

    if (!pedidos)
        return res.status(404).send(false);

    res.status(200).send(pedidos);
});

//insertar
router.post('/', async(req, res) => {
    const errores = validationResult(req);

    if (!errores.isEmpty())
        return res.status(422).json({ errors: errores.array() });

    let pedido = new Pedido({
        total: req.body.total,
        metodoPago: req.body.metodoPago,
        direccionEnvio: req.body.direccionEnvio,
        fechaEntrega: req.body.fechaEntrega,
        estatus: req.body.estatus,
        cliente: {
            correo: req.body.correoCli,
            nombre: req.body.nombreCli,
            apellidos: req.body.apellidosCli,
            telefono: req.body.telefonoCli
        },
        empleado: {
            correo: "",
            nombre: "",
            apellidos: "",
            telefono: ""
        },
        tiene: [{
            codigoProd: req.body.codigoProd,
            precioProd: req.body.precioProd,
            cantidadProd: req.body.cantidadProd,
            monto: req.body.monto
        }]
    });

    await pedido.save();
    res.status(200).send(pedido);
});

//agregar producto a tiene
router.post('/agregar-producto', async(req, res) => {
    let pedido = await Pedido.findOne({ _id: req.body.id });

    if (!pedido)
        return res.status(404).send(false);

    tieneArray = [{
        codigoProd: req.body.codigoProd,
        precioProd: req.body.precioProd,
        cantidadProd: req.body.cantidadProd,
        monto: req.body.monto
    }];

    pedido.tiene = pedido.tiene.concat(tieneArray);

    await pedido.save();

    res.status(201).send(pedido);
});

//modificar cantidad y el monto de un producto
router.put('/modificar-prod', async(req, res) => {
    let pedido = Pedido.findOne({ '$and': [{ 'tiene._id': req.body._id }, { 'tiene.codigoProd': req.body.codigoProd }] });

    if (!pedido)
        return res.status(404).send(false);

    productoMod = await Pedido.update({ '$and': [{ 'tiene._id': req.body._id }, { 'tiene.codigoProd': req.body.codigoProd }] }, {
        $set: {
            'tiene.$.cantidadProd': req.body.cantidadProd,
            'tiene.$.monto': req.body.monto,
        }
    }, {
        new: true
    });

    res.send(productoMod);
})

//modificar pedido
router.put('/modificar-pedido-carrito', async(req, res) => {
    const pedido = await Pedido.findOne({ '$and': [{ 'cliente.correo': req.body.correoCli }, { estatus: 'en carrito' }] });

    if (!pedido)
        return res.status(404).send(false);

    const pedido_actualizado = await Pedido.findOneAndUpdate({ '$and': [{ 'cliente.correo': req.body.correoCli }, { estatus: 'en carrito' }] }, {
        total: req.body.total,
        metodoPago: req.body.metodoPago,
        direccionEnvio: req.body.direccionEnvio,
        fechaEntrega: req.body.fechaEntrega,
        estatus: req.body.estatus
    }, {
        new: true
    })

    res.send(pedido_actualizado);
})

//modificar pedido
router.put('/modificar-pedido-estatus', async(req, res) => {
    const pedido = await Pedido.findOne({ _id: req.body.id });

    if (!pedido)
        return res.status(404).send(false);

    const pedido_actualizado = await Pedido.findOneAndUpdate({ _id: req.body.id }, {
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

    res.send(pedido_actualizado);
})


//eliminar un producto del objeto tiene
router.post('/eliminar-producto', async(req, res) => {
    let pedido = await Pedido.findOne({ _id: req.body.id });

    if (!pedido)
        return res.status(404).send(false);

    pedido.tiene = pedido.tiene.pull({ _id: req.body.idProd });

    await pedido.save();

    res.status(201).send(pedido);
});

//eliminar pedido
router.post('/eliminar', async(req, res) => {
    let pedido = await Pedido.findOne({ _id: req.body.id });

    if (!pedido)
        return res.status(404).send(false);

    pedido_eliminado = await Pedido.findOneAndDelete({ _id: req.body.id });

    res.send(pedido);
})


module.exports = router;