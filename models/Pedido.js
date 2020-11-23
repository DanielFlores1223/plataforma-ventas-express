const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const PedidoSchema = new mongoose.Schema({
    fechaPedido: {
        type: Date,
        default: Date.now
    },
    total: {
        type: Number,
    },
    metodoPago: {
        type: String,
    },
    direccionEnvio: {
        type: String,
    },
    fechaEntrega: {
        type: Date
    },
    estatus: {
        type: String,
        required: true
    },
    empleado: {
        correo: String,
        nombre: String,
        apellidos: String,
        telefono: String
    },
    cliente: {
        nombre: String,
        apellidos: String,
        telefono: String,
        correo: String
    },
    tiene: [{
        codigoProd: String,
        precioProd: Number,
        cantidadProd: Number,
        monto: Number
    }]
})


//nombre de schema
mongoose.model('Pedido', PedidoSchema);