const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const ProductoSchema = new mongoose.Schema({
    codigo: {
        type: String,
        required: true,
        unique: true
    },
    nombreProd: {
        type: String,
        required: true,
    },
    existencia: {
        type: Number,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    categoria: {
        type: String,
        required: true
    },
    subCategoria: {
        type: String,
        required: true
    },
    marca: {
        type: String,
        required: true
    },
    descripcion: {
        type: String
    },
    img: {
        type: String
    },
    proveedor: [{
        nombreProveedor: {
            type: String
        },
        horario: {
            type: String
        },
        telefono: {
            type: String
        }
    }]

});


//nombre de schema
mongoose.model('Producto', ProductoSchema);