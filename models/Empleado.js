const mongoose = require('mongoose');
//token
const jwt = require('jsonwebtoken');
mongoose.set('useCreateIndex', true);

const EmpleadoSchema = new mongoose.Schema({
    //Id_Empleado
    nombre: {
        type: String,
        required: true
    },

    apellidos: {
        type: String
    },

    telefono: {
        type: String,
        required: true
    },

    sueldo: {
        type: Number,
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
        type: String,
        required: true
    }

});

//generar token
EmpleadoSchema.methods.generadorJWT = function() {
    return jwt.sign({
        nombre: this.nombre,
        correo: this.correo
    }, "c0ntr4s3n14")
}

//nombre de schema
mongoose.model('Empleado', EmpleadoSchema);