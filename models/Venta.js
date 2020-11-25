const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const VentaSchema = new mongoose.Schema({
    fechaVenta: {
        type: Date,
        default: Date.now
    },
    estatus: {
        type: String
    },
    total: {
        type: Number,
    },
    empleado: {
        correo: String,
        nombre: String,
        apellidos: String,
        telefono: String
    },
    tiene: [{
        codigoProd: String,
        precioProd: Number,
        nombreProd: String,
        cantidadProd: Number,
        monto: Number
    }]
});

//nombre de schema
mongoose.model('Venta', VentaSchema);