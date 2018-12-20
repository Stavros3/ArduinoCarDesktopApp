//https://node-serialport.github.io/utilities/ReadLineParser.html
//https://www.chartjs.org/docs/latest/charts/polar.html
//https://www.jsdelivr.com/package/npm/chart.js?path=dist
//https://socket.io/get-started/chat/#Introduction
//https://github.com/socketio/chat-example 
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
var usbPort = process.argv.slice(2).length == 0 ? ['COM3'] : process.argv.slice(2);
    console.log('Connected to:',usbPort);
const port = new SerialPort(usbPort[0])
const parser = port.pipe(new Readline({ delimiter: '\r\n' }))
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    console.log('a user connected');

    parser.on('data', function (data) {
        var d = data.split(",");
        if (d.length <= 1) {
            console.log(d[0])

            io.emit('reciveData', d[0]);

        } else {

            io.emit('reciveData', d);

        }
    })

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

});


http.listen(3000, function () {
    console.log('listening on *:3000');
});
