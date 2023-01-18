import express from 'express';

// library for web socket
import http from 'http';
import { Server as SocketIO } from 'socket.io';

// connection config (port, express and web socket)
export const PORT = 8080;
export const app = express();
export const server = new http.Server(app);
export const io = new SocketIO(server);