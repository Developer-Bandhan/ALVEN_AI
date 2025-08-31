import 'dotenv/config';
import http from 'http';
import app from './app.js';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import projectModel from './models/project.model.js';
import { generateResult } from './services/ai.service.js';

const port = process.env.PORT || 8000;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];
        if(!token){
            return next(new Error('Authentication error'));
        }

        const projectId = socket.handshake.query.projectId;
        if(!mongoose.Types.ObjectId.isValid(projectId)){
            return next(new Error('Invalid projectId'));
        }

        socket.project = await projectModel.findById(projectId);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if(!decoded){
            return next(new Error('Authentication error'));
        }

        socket.user = decoded;
        socket.roomId = socket.project._id.toString();
        socket.join(socket.roomId);
        
        next();
    } catch (error) {
        next(error);
    }
});

io.on('connection', socket => {
    console.log(`User ${socket.user._id} connected to project ${socket.roomId}`);

    socket.on('project-message', async data => {
        try {
            const { message, sender, projectId } = data;
            
            // Broadcast original message immediately
            io.to(socket.roomId).emit('project-message', {
                message,
                sender,
                projectId,
                timestamp: Date.now(),
                isMe: socket.user._id === sender._id
            });

            // Check for AI mention
            if(message.includes('@al')) {
                const prompt = message.replace('@al', '').trim();
                
                if(prompt) {
                    console.log(`Processing AI request: ${prompt}`);
                    const result = await generateResult(prompt);
                    
                    io.to(socket.roomId).emit('project-message', {
                        message: result,
                        sender: {
                            _id: 'ai-bot',
                            username: 'AI Assistant',
                            avatar: 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png'
                        },
                        projectId,
                        timestamp: Date.now(),
                        isAi: true
                    });
                }
            }
        } catch (error) {
            console.error('Error handling message:', error);
            // Send error message back to sender
            socket.emit('project-error', {
                message: 'Failed to process message',
                error: error.message
            });
        }
    });

    socket.on('disconnect', () => {
        console.log(`User ${socket.user._id} disconnected`);
        socket.leave(socket.roomId);
    });
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});