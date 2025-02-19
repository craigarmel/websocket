const WebSocket = require('ws');
const express = require('express');
const http = require('http');
const cors = require('cors');

const app = express();
app.use(cors()); // Permettre les requêtes entre domaines différents
const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

let clients = new Set();

wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('New client connected');

    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        clients.delete(ws);
        console.log('Client disconnected');
    });
});

server.listen(8080, () => {
    console.log('WebSocket server running on ws://localhost:8080');
});
