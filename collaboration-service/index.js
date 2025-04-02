const express = require('express');
const cors = require('cors');
const knockknock = require("../Middlewares/knockknock");

const http = require('http');
const { Server } = require('socket.io');

require('dotenv').config();


const mongoose = require('mongoose');
const Message = require('./models/Message');

const app = express();
app.use(cors());
app.use(express.json());


const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});


mongoose.connect(process.env.DB_URI)
.then(() => console.log("Database Connecté"))
.catch(error => console.error("Erreur database :", error));



io.on('connection', (socket) => {
    console.log("Utilisateur connecté : ", socket.id);

    socket.on('joinToProject', (projectId) => {
        socket.join(projectId);
        console.log(`Utilisateur ${socket.id} a rejoint le projet ${projectId}`);
    });

    socket.on('sendMessage', async (data) => {
        const { sender, projectId, msgContent } = data;
        if (!socket.rooms.has(projectId)) {
            socket.join(projectId);
            console.log(`Utilisateur auto-joined le projet ${projectId}`);
        }
        const message = new Message({ sender, projectId, msgContent });
        await message.save();
        io.to(projectId).emit('receiveMessage', message);       
    });

    socket.on('sendNotification', (data) => {
        const {message, projectId } = data
        if (!socket.rooms.has(projectId)) {
            socket.join(projectId);
            console.log(`Utilisateur auto-joined le projet ${projectId}`);
        }
        const newMessage = `Projet: ${projectId} -> ${message}`;
        console.log(newMessage);
        io.to(projectId).emit('receiveNotification',  {message, projectId });
    });

    socket.on('disconnect', () => {
        console.log(`Utilisateur déconnecté : ${socket.id}`);
    });
});

app.get('/messages/:prjId', knockknock, async (req, res) => {
    try {
        const messages = await Message.find({ projectId: req.params.prjId });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
    console.log(`Serveur de collaboration connecté sur http://localhost:${PORT}`);
});