const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

// Configuration constants
const ROOM_CLEANUP_INTERVAL = 300000; // 5 minutes
const MAX_USERS_PER_ROOM = 50;
const MAX_MESSAGE_LENGTH = 500;


const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? [
      // Vercel deployment
      "https://collaborative-whiteboard-liart.vercel.app",
      // Add your Render backend URL here when you get it
      // "https://your-render-app-name.onrender.com"
    ] : [
      // Local development - more permissive for testing
      "http://localhost:5173", 
      "http://localhost:5174", 
      "http://localhost:5175", 
      "http://localhost:5176",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174",
      "http://127.0.0.1:5175",
      "http://127.0.0.1:5176"
    ],
    methods: ["GET", "POST"],
    credentials: true,
    allowEIO3: true
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ['websocket', 'polling']
});

app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? [
    // Vercel deployment
    "https://collaborative-whiteboard-liart.vercel.app",
    // Add your Render backend URL here when you get it
    // "https://your-render-app-name.onrender.com"
  ] : [
    // Local development - more permissive for testing
    "http://localhost:5173", 
    "http://localhost:5174", 
    "http://localhost:5175", 
    "http://localhost:5176",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:5175",
    "http://127.0.0.1:5176"
  ],
  credentials: true
}));
app.use(express.json());

// Store rooms and their data
const rooms = new Map();
const userRooms = new Map();

// Room management functions
function createRoom() {
  const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
  rooms.set(roomId, {
    id: roomId,
    users: new Set(),
    drawingData: [],
    createdAt: new Date()
  });
  return roomId;
}

function joinRoom(socketId, roomId, username) {
  if (!rooms.has(roomId)) {
    return { success: false, error: 'Room not found' };
  }

  const room = rooms.get(roomId);
  const userInfo = { socketId, username, joinedAt: new Date() };
  
  // Convert Set to Array, add user, then convert back to Set
  const usersArray = Array.from(room.users);
  usersArray.push(userInfo);
  room.users = new Set(usersArray);
  
  userRooms.set(socketId, roomId);

  return { success: true, room, userInfo };
}

function leaveRoom(socketId) {
  const roomId = userRooms.get(socketId);
  if (roomId && rooms.has(roomId)) {
    const room = rooms.get(roomId);
    const usersArray = Array.from(room.users).filter(user => user.socketId !== socketId);
    room.users = new Set(usersArray);

    // Keep room alive for 5 minutes after last user leaves
    if (room.users.size === 0) {
      room.emptyAt = Date.now();
      setTimeout(() => {
        if (rooms.has(roomId) && rooms.get(roomId).users.size === 0) {
          rooms.delete(roomId);

        }
      }, ROOM_CLEANUP_INTERVAL);
    }

    userRooms.delete(socketId);
    return roomId;
  }
  return null;
}

function getRandomRoom() {
  const availableRooms = [...rooms.values()].filter(room => room.users.size < MAX_USERS_PER_ROOM);
  if (availableRooms.length === 0) {
    return createRoom();
  }
  return availableRooms[Math.floor(Math.random() * availableRooms.length)].id;
}

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // Create room
  socket.on('create-room', (data) => {
    try {
      console.log(`Create room request from ${socket.id}:`, data);
      const username = data.username || 'Anonymous';
      const roomId = createRoom();
      const result = joinRoom(socket.id, roomId, username);
      console.log(`Room created: ${roomId}, User: ${username}`);

      if (result.success) {
        socket.join(roomId);

        const participants = Array.from(result.room.users).map(user => ({
          username: user.username,
          socketId: user.socketId
        }));

        socket.emit('room-created', {
          roomId,
          drawingData: result.room.drawingData,
          participants,
          userCount: result.room.users.size
        });

        socket.to(roomId).emit('user-joined', {
          username: username,
          userCount: result.room.users.size,
          participants
        });
      } else {
        socket.emit('room-error', { error: result.error });
      }
    } catch (error) {
      socket.emit('room-error', { error: 'Failed to create room' });
    }
  });

  // Join specific room
  socket.on('join-room', (data) => {
    try {
      console.log(`Join room request from ${socket.id}:`, data);
      const { roomId, username } = data;
      const result = joinRoom(socket.id, roomId, username || 'Anonymous');

      if (result.success) {
        socket.join(roomId);
        const participants = Array.from(result.room.users).map(user => ({
          username: user.username,
          socketId: user.socketId
        }));

        socket.emit('room-joined', {
          roomId,
          drawingData: result.room.drawingData,
          userCount: result.room.users.size,
          participants
        });

        socket.to(roomId).emit('user-joined', {
          username: username || 'Anonymous',
          userCount: result.room.users.size,
          participants
        });
      } else {
        socket.emit('room-error', { error: result.error });
      }
    } catch (error) {
      socket.emit('room-error', { error: 'Failed to join room' });
    }
  });

  // Join random room
  socket.on('join-random', (data) => {
    console.log(`Join random room request from ${socket.id}:`, data);
    const roomId = getRandomRoom();
    const result = joinRoom(socket.id, roomId, data.username || 'Anonymous');

    if (result.success) {
      socket.join(roomId);
      const participants = Array.from(result.room.users).map(user => ({
        username: user.username,
        socketId: user.socketId
      }));

      socket.emit('room-joined', {
        roomId,
        drawingData: result.room.drawingData,
        userCount: result.room.users.size,
        participants
      });

      socket.to(roomId).emit('user-joined', {
        username: data.username || 'Anonymous',
        userCount: result.room.users.size,
        participants
      });
    } else {
      socket.emit('room-error', { error: 'Unable to join random room' });
    }
  });

  // Handle drawing events
  socket.on('drawing', (data) => {
    const roomId = userRooms.get(socket.id);
    if (roomId && rooms.has(roomId)) {
      const room = rooms.get(roomId);
      room.drawingData.push(data);
      socket.to(roomId).emit('drawing', data);
    }
  });

  // Handle canvas clear
  socket.on('clear-canvas', () => {
    const roomId = userRooms.get(socket.id);
    if (roomId && rooms.has(roomId)) {
      const room = rooms.get(roomId);
      room.drawingData = [];
      socket.to(roomId).emit('clear-canvas');
    }
  });

  // Handle chat messages
  socket.on('chat-message', (data) => {
    const roomId = userRooms.get(socket.id);
    if (roomId && rooms.has(roomId)) {
      // Validate message data
      if (data && data.message && data.username) {
        const messageData = {
          username: data.username,
          message: data.message.substring(0, MAX_MESSAGE_LENGTH),
          timestamp: data.timestamp || Date.now()
        };

        // Broadcast to all users in the room (including sender for consistency)
        io.to(roomId).emit('chat-message', messageData);


      }
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    try {
      console.log(`Client disconnected: ${socket.id}`);
      const roomId = leaveRoom(socket.id);
      if (roomId) {
        const room = rooms.get(roomId);
        if (room) {
          const participants = Array.from(room.users).map(user => ({
            username: user.username,
            socketId: user.socketId
          }));

          socket.to(roomId).emit('user-left', {
            userCount: room.users.size,
            participants
          });

        }
      }


    } catch (error) {

    }
  });
});

// API endpoints
app.get('/', (req, res) => {
  res.json({ 
    message: 'Whiteboard Server is running!', 
    timestamp: new Date().toISOString(),
    rooms: rooms.size 
  });
});

app.get('/api/rooms', (_, res) => {
  const roomList = [...rooms.values()].map(room => ({
    id: room.id,
    userCount: room.users.size,
    createdAt: room.createdAt
  }));
  res.json(roomList);
});

const PORT = process.env.PORT || 3004;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server accessible at http://localhost:${PORT}`);
  console.log(`CORS origins configured:`, io.engine.opts.cors.origin);
  console.log(`Active rooms: ${rooms.size}`);
});
