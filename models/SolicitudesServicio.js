const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);

const SolicitudServicioSchema = new mongoose.Schema({
    numCelular: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    estatus: {
        type: String,
        required: true
    },
    cliente: {
        nombre: String,
        apellidos: String,
        correo: String,
        telefono: String
    },
    empleado: {
        correo: String,
        nombre: String,
        apellidos: String,
        telefono: String
    },
    servicio: {
        nombre: String,
        precio: Number
    }
})

//nombre de schema
mongoose.model('SolicitudServicio', SolicitudServicioSchema);