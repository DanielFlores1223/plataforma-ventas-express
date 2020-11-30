const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);

const ServicioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    boton: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    img: {
        type: String
    }
})

//nombre de schema
mongoose.model('Servicio', ServicioSchema);