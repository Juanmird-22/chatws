const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io'); 
const cors = require('cors');

const app = express();
const httpServer = createServer(app); 

const io = new Server(httpServer, {  
    cors: {
        origin: "*"
    }
});

io.on('connection', (socket) => {
    console.log('Un usuario se conectó');

    socket.emit('message', 'Hola');

    socket.on('message', (msg) => {
        socket.emit("confirmacion", "Mensaje enviado")
        socket.broadcast.emit('message', "Enviaron esto: " + msg);
    });
});

app.get('/', (req, res) => {
    res.send('<h1>Hola mundo</h1>');
});

httpServer.listen(3000, () => {  
    console.log('Estoy corriendo');
});

