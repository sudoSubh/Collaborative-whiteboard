# Whiteboard Server

Real-time collaborative whiteboard backend server built with Express.js and Socket.io.

## Development Scripts

### Start Server
```bash
# Production mode
npm start

# Development mode with auto-restart
npm run dev

# Development with verbose logging
npm run dev:verbose

# Development with debugging
npm run dev:debug
```

### Nodemon Features

- **Auto-restart**: Server automatically restarts when files change
- **File watching**: Monitors `.js` and `.json` files
- **Ignore patterns**: Excludes `node_modules` and log files
- **Delay**: 1-second delay before restart to avoid rapid restarts

### Manual Restart
While nodemon is running, you can manually restart by typing `rs` in the terminal.

## Server Features

- Real-time drawing synchronization
- Room management (create, join, random)
- User session tracking
- Participant management
- Drawing data persistence per room
- Automatic cleanup of empty rooms

## Environment Variables

- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment mode (development/production)

## API Endpoints

- `GET /api/rooms`: List all active rooms

## Socket Events

### Client to Server
- `create-room`: Create a new room
- `join-room`: Join specific room
- `join-random`: Join random room
- `drawing`: Send drawing data
- `clear-canvas`: Clear canvas

### Server to Client
- `room-created`: Room creation success
- `room-joined`: Room join success
- `room-error`: Room operation error
- `drawing`: Receive drawing data
- `clear-canvas`: Canvas cleared
- `user-joined`: User joined room
- `user-left`: User left room
