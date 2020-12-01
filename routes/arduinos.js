var express = require('express');
var router = express.Router();

const {check,validationResult} = require ('express-validator');
var Serialport = require('serialport');

const mongoose = require('mongoose');
const { parsers } = require('serialport');
const Arduino = mongoose.model('Arduino');

var arduinoCOMPort = 'COM4';
const ReadLine = Serialport.parsers.Readline;

var arduinoSerialPort = new Serialport(arduinoCOMPort,{
    baudRate: 9600
});

const parser = arduinoSerialPort.pipe(new ReadLine({delimiter: '\r\n'}))

let valor ="";

router.get('/vertemperatura',async(req,res)=>{
    res.send(valor)
})

router.get('/',async(req,res)=>{
    let temperatura = await Arduino.find()
    
    if (!temperatura) {
        return res.status(450).send("No hay temperatura")
    }
    res.send(temperatura)
})

router.post('/', async(req,res)=>{
    let numero = await Arduino.find().count() + 1
    var arduinotemp = new Arduino({
        estado:numero,
        temperatura:req.body.valor,
        fecha_reg:req.body.fecha
    })
    await arduinotemp.save();
    res.status(201).send(arduinotemp)
})

parser.on('open', function(){
    console.log('SerialPort '+ arduinoCOMPort + 'is opened.');
});

parser.on('data', function(data){
    console.log(data);
    valor = data;
})

module.exports = router;