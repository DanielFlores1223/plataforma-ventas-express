const mongoose = require('mongoose');
//token
const jwt = require('jsonwebtoken');
mongoose.set('useCreateIndex', true);

const ClienteSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },

    apellidoP: {
        type: String
    },

    apellidoM: {
        type: String
    },

    telefono: {
        type: String,
        required: true
    },

    estatus: {
        type: String,
        required: true
    },

    correo: {
        type: String,
        required: true,
        unique: true
    },

    contrasenia: {
        type: String,
        required: true
    },

    fechaNac: {
        type: Date,
        required: true
    },

    tipo: {
        type: String
    }
});

//generar token
ClienteSchema.methods.generadorJWT = function() {
    return jwt.sign({
        nombre: this.nombre,
        correo: this.correo
    }, "c0ntr4s3n14")
}

//nombre de schema
mongoose.model('Cliente', ClienteSchema);