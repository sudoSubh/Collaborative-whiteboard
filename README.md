# [Collaborative Whiteboard](https://your-whiteboard-demo.vercel.app/) 🎨✨

The project **"Real-Time Collaborative Whiteboard"** is an innovative digital canvas platform designed to bring teams together through seamless drawing and instant communication, similar to popular tools like Scribbl.io but focused on professional collaboration.

This project demonstrates modern web development practices with **real-time synchronization** and has been built with performance and user experience in mind.

## 🚀 Live Demo - https://collaborative-whiteboard-liart.vercel.app/

## 🌟 Features

- � **Real-Time Collaborative Drawing**: Experience **zero-latency drawing** where every stroke appears instantly across all connected users. The platform provides a seamless collaborative environment using advanced WebSocket technology.

- 🏠 **Smart Room Management**: The system offers **flexible room creation and joining** options. Users can create private rooms with unique 6-character codes, join existing rooms, or find random available rooms for spontaneous collaboration.

- 💬 **Integrated Chat System**: Features a **floating chat interface** positioned in the lower-right corner that doesn't interfere with drawing. The chat system includes user identification, message notifications with unread badges, and minimizable design.

- 🎯 **Professional Drawing Tools**: Comprehensive toolkit including **8 vibrant colors** (Black, Red, Green, Blue, Yellow, Magenta, Cyan, Orange), pen and eraser tools, variable brush sizes (1px to 20px), and high-DPI support for crisp drawing on all screen types.

- 🚀 **Production-Ready Architecture**: Built with **optimized performance** featuring clean server code, automatic memory management, comprehensive error handling, and mobile-responsive design that works perfectly across all devices.

## �️ Tech Stack

- **Frontend**: React 19 ⚛️, Vite 7 ⚡, Tailwind CSS 🎨, Lucide React 🎭
- **Backend**: Node.js 🟢, Express 🚂, Socket.io 🔌
- **Real-time Communication**: WebSocket 💬, Socket.io Client/Server 🔄
- **Development Tools**: ESLint 📝, Nodemon 🔄, PostCSS 🎨
- **Build Optimization**: Terser 📦, Code Splitting 🧩
- **Deployment**: Vercel & Railway 🚀

## � Getting Started Locally

### Project Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/collaborative-whiteboard.git
   cd collaborative-whiteboard
   ```

### Frontend Setup

1. Install frontend dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file in the **root directory** and add your required environment variables:

   ```bash
   VITE_SOCKET_URL=http://localhost:3001
   VITE_APP_NAME=Collaborative Whiteboard
   ```

3. Start the development frontend server:
   ```bash
   npm run dev
   ```
   Frontend will be available at `http://localhost:5173`

### Backend Setup

1. Navigate to backend (**In Another Terminal**):

   ```bash
   cd server
   ```

2. Install backend dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the **server directory** and add your required environment variables:

   ```bash
   PORT=3001
   NODE_ENV=development
   ```

4. Start the server:
   ```bash
   npm run dev
   ```
   Backend will be available at `http://localhost:3001`

## 🌐 Socket Events & API

### Socket Events (Client ↔ Server)

- **Room Management**:
  - `create-room`: Create a new collaboration room
  - `join-room`: Join specific room with room ID
  - `join-random`: Find and join available random room
  - `room-created`, `room-joined`: Room connection confirmations

- **Drawing Synchronization**:
  - `drawing`: Real-time drawing data transmission
  - `clear-canvas`: Clear whiteboard for all users

- **Communication**:
  - `chat-message`: Send and receive chat messages
  - `user-joined`, `user-left`: User presence notifications

### REST API Endpoints

- `GET /api/rooms`: List all active collaboration rooms
- `GET /health`: Server health check endpoint

## 🎨 Drawing System Architecture

The whiteboard uses HTML5 Canvas with optimized drawing algorithms:

```javascript
// Real-time drawing data structure
const drawingData = {
  x0: startX, y0: startY,    // Starting coordinates
  x1: endX, y1: endY,        // Ending coordinates
  color: '#FF0000',          // Stroke color
  size: 5,                   // Brush size
  tool: 'pen'                // Tool type (pen/eraser)
};

```

## 🎯 Use Cases & Applications

### 👥 **Team Collaboration**
- **Remote Brainstorming** - Visual ideation sessions with distributed teams
- **Design Reviews** - Annotate and discuss designs in real-time
- **Teaching & Training** - Interactive learning sessions and workshops
- **Agile Planning** - Visual sprint planning and retrospectives

### 🎨 **Creative Projects**
- **Digital Art** - Collaborative drawing and sketching sessions
- **Storyboarding** - Visual story development for media projects
- **Mind Mapping** - Organize ideas and concepts visually
- **Concept Development** - Iterate on creative concepts together

### 🏢 **Business Applications**
- **Client Presentations** - Interactive presentation annotations
- **Project Planning** - Visual project roadmaps and timelines
- **Architecture Design** - Collaborative system design sessions
- **Problem Solving** - Visual problem-solving workshops

## 📊 Performance & Optimization

### **Technical Specifications**
- **Bundle Size**: < 500KB (optimized production build)
- **Drawing Latency**: < 50ms (real-time collaboration)
- **Memory Usage**: < 50MB (efficient resource management)
- **Concurrent Users**: 50+ users per room (scalable architecture)
- **Room Persistence**: 5 minutes after last user leaves

### **Build Optimizations**
- **Code Splitting**: Vendor, router, socket, and UI chunks
- **Minification**: Terser for production builds
- **Tree Shaking**: Unused code elimination
- **Chunk Size Optimization**: 1000KB warning limit

## 🔧 Advanced Configuration

### **Production Deployment**

**Frontend (Vercel/Netlify)**:
```bash
# Build for production
npm run build:prod

# Preview production build
npm run preview:prod

# Deploy to Vercel
vercel --prod
```

**Backend (Railway/Heroku)**:
```bash
cd server

# Production start
npm start

# Deploy to Railway
railway up
```

### **Environment Configuration**

**Frontend (.env)**:
```env
# Development
VITE_SOCKET_URL=http://localhost:3001
VITE_APP_NAME=Collaborative Whiteboard

# Production
VITE_SOCKET_URL=wss://your-backend-domain.com
VITE_APP_NAME=Collaborative Whiteboard
```

**Backend (server/.env)**:
```env
# Server Configuration
PORT=3001
NODE_ENV=production

# Optional: Custom settings
ROOM_CLEANUP_INTERVAL=300000  # 5 minutes
MAX_USERS_PER_ROOM=50
MAX_MESSAGE_LENGTH=500
```

## 🧪 Testing & Development

### **Development Commands**
```bash
# Frontend development
npm run dev              # Start dev server
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
npm run preview         # Preview production build

# Backend development
cd server
npm run dev             # Start with nodemon
npm run dev:verbose     # Verbose logging
npm run dev:debug       # Debug mode
npm run restart         # Force restart
```

### **Code Quality**
- **ESLint Configuration**: Modern JavaScript standards
- **React Hooks Rules**: Enforced best practices
- **Code Formatting**: Consistent style across codebase
- **Error Boundaries**: Comprehensive error handling

## 🤝 Contributing

We welcome contributions to make this whiteboard even better! Here's how you can help:

### **🐛 Bug Reports**
Found a bug? [Open an issue](https://github.com/yourusername/collaborative-whiteboard/issues) with:
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Screenshots or screen recordings** if applicable
- **Browser and device information**

### **✨ Feature Requests**
Have an idea? [Start a discussion](https://github.com/yourusername/collaborative-whiteboard/discussions) about:
- **Use case description** and user stories
- **Proposed implementation** approach
- **Benefits to users** and potential impact

### **🔧 Development Workflow**
```bash
# 1. Fork the repository on GitHub
# 2. Clone your fork locally
git clone https://github.com/yourusername/collaborative-whiteboard.git

# 3. Create a feature branch
git checkout -b feature/amazing-feature

# 4. Make your changes and test thoroughly
npm run dev  # Test frontend
cd server && npm run dev  # Test backend

# 5. Commit with conventional commits
git commit -m "feat: add amazing new feature"

# 6. Push and create a Pull Request
git push origin feature/amazing-feature

```
## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

[🐛 Report Bug](https://github.com/yourusername/collaborative-whiteboard/issues) • [✨ Request Feature](https://github.com/yourusername/collaborative-whiteboard/issues) • [💬 Discussions](https://github.com/yourusername/collaborative-whiteboard/discussions)


</div>
