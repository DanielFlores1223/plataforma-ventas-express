const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const ProveedorSchema = new mongoose.Schema({
    nombreProveedor: {
        type: String,
        required: true
    },
    nombreAgente: {
        type: String,
        required: true
    },
    categoria: {
        type: String,
        required: true
    },
    horario: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        required: true
    }
});


//nombre de schema
mongoose.model('Proveedor', ProveedorSchema);