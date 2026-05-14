const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const mensajes = [];

const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});

io.on('connection', (socket) => {
    console.log('Un usuario se conecto');
    socket.emit('messages', mensajes);

    socket.on('message', ({ nombre, msg }) => {
        const mensaje = {
            nombre,
            msg,
            hora: new Date().toLocaleTimeString('es-CO', {
                hour: '2-digit',
                minute: '2-digit'
            })
        };
        mensajes.push(mensaje);
        io.emit('message', mensaje);
    });
});

app.get('/', (req, res) => {
    res.send('<h1>Hola mundo</h1>');
});

httpServer.listen(3000, () => {
    console.log('Estoy corriendo');
});
