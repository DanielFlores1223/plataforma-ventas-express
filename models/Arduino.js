const mongoose = require('mongoose')
mongoose.set('useCreateIndex',true)

const Arduino = new mongoose.Schema({
    estado:{
        type:Number
    },
    temperatura:{
        type:String
    },
    fecha_reg:{
        type:Date,
        default: Date.now
    }

})

mongoose.model('Arduino', Arduino)