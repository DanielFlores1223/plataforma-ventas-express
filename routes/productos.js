var express = require('express');
var router = express.Router();
//Librerias: 
//validaciones
const { check, validationResult, Result } = require('express-validator');

//Schemas:
const mongoose = require('mongoose');
const Producto = mongoose.model('Producto');

/* GET users listing. */
router.get('/', async(req, res) => {
    await Producto.find((err, producto) => {
        if (err)
            return res.send(err);

        res.send(producto);
    })
});

//buscar like
router.post('/buscar-like', async(req, res) => {
    const productos = await Producto.find({ '$or': [{ nombreProd: { '$regex': req.body.nombre, '$options': 'i' } }, { marca: { '$regex': req.body.nombre, '$options': 'i' } }] });

    if (!productos)
        return res.status(404).send(false);

    res.status(200).send(productos);
});

//buscar like con categoria
router.post('/buscar-like-categoria', async(req, res) => {
    const productos = await Producto.find({ '$and': [{ '$or': [{ nombreProd: { '$regex': req.body.nombre, '$options': 'i' } }, { marca: { '$regex': req.body.nombre, '$options': 'i' } }] }, { categoria: req.body.categoria }] });

    if (!productos)
        return res.status(404).send(false);

    res.status(200).send(productos);
});

//buscarTodo sin categoria
router.post('/buscar-todo', async(req, res) => {
    const productos = await Producto.find({ '$or': [{ nombreProd: { '$regex': req.body.nombre, '$options': 'i' } }, { marca: { '$regex': req.body.nombre, '$options': 'i' } }] });

    if (!productos)
        return res.status(404).send(false);

    res.status(200).send(productos);
});

//buscar like con categoria y subcategoria
router.post('/buscar-like-categoria-sub', async(req, res) => {
    const productos = await Producto.find({ '$and': [{ '$or': [{ nombreProd: { '$regex': req.body.nombre, '$options': 'i' } }, { marca: { '$regex': req.body.nombre, '$options': 'i' } }] }, { categoria: req.body.categoria }, { subCategoria: req.body.subCategoria }] });

    if (!productos)
        return res.status(404).send(false);

    res.status(200).send(productos);
});

//consulta especifica id
router.post('/buscar-prod-codigo', async(req, res) => {
    const producto = await Producto.findOne({ codigo: req.body.codigo });
    if (!producto)
        return res.status(404).send(false);

    res.status(200).send(producto);
});

//consulta especifica codigo para el carrito
router.post('/buscar-prod-codigoProd', async(req, res) => {
    const producto = await Producto.findOne({ codigo: req.body.codigoProd });
    if (!producto)
        return res.status(404).send(false);

    res.status(200).send(producto);
});

//insertar
router.post('/', [
    //validaciones
    check('codigo').isLength({ min: 1 }),
    check('nombreProd').isLength({ min: 1 }),
    check('precio').isLength({ min: 1 }),
    check('marca').isLength({ min: 1 })
], async(req, res) => {
    const errores = validationResult(req);

    if (!errores.isEmpty())
        return res.status(422).json({ errors: errores.array() });

    let producto = new Producto({
        codigo: req.body.codigo,
        nombreProd: req.body.nombreProd,
        existencia: req.body.existencia,
        precio: req.body.precio,
        categoria: req.body.categoria,
        subCategoria: req.body.subCategoria,
        marca: req.body.marca,
        descripcion: req.body.descripcion,
        img: req.body.img,
        proveedor: [{
            nombreProveedor: req.body.nombreProveedor,
            horario: req.body.horario,
            telefono: req.body.telefono
        }]
    });

    await producto.save();
    res.status(200).send(producto);
});

router.post('/agregar-proveedor', async(req, res) => {
    let producto = await Producto.findOne({ codigo: req.body.codigo });

    if (!producto)
        res.status(404).send(false);

    proveedorArray = [{
        nombreProveedor: req.body.nombreProveedor,
        horario: req.body.horario,
        telefono: req.body.telefono
    }];

    producto.proveedor = producto.proveedor.concat(proveedorArray);

    await producto.save();

    res.status(201).send(producto);
});

//modificar producto
router.put('/', [
    //validaciones
    check('codigo').isLength({ min: 1 }),
    check('nombreProd').isLength({ min: 1 }),
    check('precio').isLength({ min: 1 }),
    check('marca').isLength({ min: 1 })
], async(req, res) => {
    const errores = validationResult(req);

    if (!errores.isEmpty())
        return res.status(422).json({ errors: errores.array() });

    productoMod = await Producto.findOneAndUpdate({ codigo: req.body.codigo }, {
        codigo: req.body.codigo,
        nombreProd: req.body.nombreProd,
        existencia: req.body.existencia,
        precio: req.body.precio,
        categoria: req.body.categoria,
        subCategoria: req.body.subCategoria,
        marca: req.body.marca,
        descripcion: req.body.descripcion,
        img: req.body.img
    }, {
        new: true
    });

    res.send(productoMod);
});

//eliminar producto completo
router.post('/eliminar', async(req, res) => {
    const producto = await Producto.findOne({ codigo: req.body.codigo });

    if (!producto)
        return res.status(400).send(false);

    producto_eliminado = await Producto.findOneAndDelete({ codigo: req.body.codigo });

    res.send(producto);
});

//eliminar un proveedor del objeto producto
router.post('/eliminar-proveedor', async(req, res) => {
    let producto = await Producto.findOne({ codigo: req.body.codigo });

    if (!producto)
        res.status(404).send(false);

    producto.proveedor = producto.proveedor.pull({ _id: req.body.id });

    await producto.save();

    res.status(201).send(producto);
})


module.exports = router;