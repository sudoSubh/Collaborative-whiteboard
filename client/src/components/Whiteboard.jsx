import { useEffect, useRef, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { Button } from './ui/button';
import { Copy, Trash2, LogOut, MessageCircle, Minus, X, Send, Palette, Eraser } from 'lucide-react';

// Configuration
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3004';

// Color palette
const COLORS = [
  '#000000', // Black
  '#FF0000', // Red
  '#00FF00', // Green
  '#0000FF', // Blue
  '#FFFF00', // Yellow
  '#FF00FF', // Magenta
  '#00FFFF', // Cyan
  '#FFA500', // Orange
  '#800080', // Purple
  '#FFC0CB', // Pink
  '#A52A2A', // Brown
  '#808080', // Gray
];

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const socketRef = useRef(null);
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [isDrawing, setIsDrawing] = useState(false);
  const [roomCode, setRoomCode] = useState(roomId);
  const [userCount, setUserCount] = useState(1);
  const [messages, setMessages] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMinimized, setChatMinimized] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [currentTool, setCurrentTool] = useState('pen');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);

  const username = location.state?.username || 'Anonymous';
  const action = location.state?.action || 'join';

  console.log('Whiteboard loaded with username:', username, 'action:', action);

  // Socket connection and room management
  useEffect(() => {
    if (!username) {
      navigate('/');
      return;
    }

    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    // Connection handling
    socket.on('connect', () => {
      setConnectionStatus('connected');
      if (action === 'create') {
        socket.emit('create-room', { username });
      } else if (action === 'random') {
        socket.emit('join-random', { username });
      } else {
        socket.emit('join-room', { roomId, username });
      }
    });

    socket.on('disconnect', () => {
      setConnectionStatus('disconnected');
    });

    socket.on('connect_error', () => {
      setConnectionStatus('error');
    });

    // Room events
    socket.on('room-created', (data) => {
      setRoomCode(data.roomId);
      setUserCount(data.userCount);
      window.history.replaceState(null, '', `/room/${data.roomId}`);
      loadDrawings(data.drawingData);
    });

    socket.on('room-joined', (data) => {
      setRoomCode(data.roomId);
      setUserCount(data.userCount);
      window.history.replaceState(null, '', `/room/${data.roomId}`);
      loadDrawings(data.drawingData);
    });

    socket.on('room-error', (data) => {
      alert(data.error);
      navigate('/');
    });

    // Drawing events
    socket.on('drawing', (data) => {
      drawLine(data);
    });

    socket.on('clear-canvas', () => {
      clearCanvas(false);
    });

    // Chat events
    socket.on('chat-message', (data) => {
      console.log('Received chat message:', data);
      setMessages(prev => [...prev, {
        id: Date.now(),
        username: data.username,
        text: data.message,
        timestamp: Date.now()
      }]);
    });

    // User events
    socket.on('user-joined', (data) => setUserCount(data.userCount));
    socket.on('user-left', (data) => setUserCount(data.userCount));

    return () => socket.disconnect();
  }, [username, action, roomId, navigate]);

  // Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const rect = canvas.parentElement.getBoundingClientRect();

      canvas.width = rect.width;
      canvas.height = rect.height;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';

      const ctx = canvas.getContext('2d');
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, rect.width, rect.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // Load existing drawings
  const loadDrawings = (drawingData) => {
    if (!drawingData?.length) return;
    setTimeout(() => {
      drawingData.forEach(data => drawLine(data));
    }, 100);
  };

  // Drawing functions
  const drawLine = (data) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (data.tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = data.color || '#000000';
    }

    ctx.lineWidth = data.size || 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(data.x0, data.y0);
    ctx.lineTo(data.x1, data.y1);
    ctx.stroke();
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    canvas.lastX = e.clientX - rect.left;
    canvas.lastY = e.clientY - rect.top;
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const data = {
      x0: canvas.lastX,
      y0: canvas.lastY,
      x1: x,
      y1: y,
      color: currentColor,
      size: brushSize,
      tool: currentTool
    };

    drawLine(data);

    if (socketRef.current?.connected) {
      console.log('Emitting drawing data:', data);
      socketRef.current.emit('drawing', data);
    } else {
      console.log('Socket not connected, cannot emit drawing');
    }

    canvas.lastX = x;
    canvas.lastY = y;
  };

  const stopDrawing = () => setIsDrawing(false);

  // Utility functions
  const clearCanvas = (emit = true) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (emit && socketRef.current?.connected) {
      socketRef.current.emit('clear-canvas');
    }
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode).then(() => {
      alert('Room code copied!');
    }).catch(() => {
      alert(`Room code: ${roomCode}`);
    });
  };

  const sendMessage = () => {
    if (newMessage.trim() && socketRef.current?.connected) {
      console.log('Sending message with username:', username);
      socketRef.current.emit('chat-message', {
        username,
        message: newMessage.trim()
      });
      setNewMessage('');
    }
  };



  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Whiteboard</h1>
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-600">
              Room: <span className="font-mono bg-yellow-100 px-2 py-1 rounded text-lg font-bold">{roomCode}</span> |
              Users: <span className="font-bold text-blue-600">{userCount}</span>
            </p>
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500' :
              connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
            }`} title={`Connection: ${connectionStatus}`} />
          </div>
        </div>

        {/* Drawing Tools */}
        <div className="flex items-center gap-4">
          {/* Tool Selection */}
          <div className="flex items-center gap-2 border-r pr-4">
            <Button
              variant={currentTool === 'pen' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentTool('pen')}
              className="flex items-center gap-1"
            >
              <Palette className="h-4 w-4" />
              Pen
            </Button>
            <Button
              variant={currentTool === 'eraser' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentTool('eraser')}
              className="flex items-center gap-1"
            >
              <Eraser className="h-4 w-4" />
              Eraser
            </Button>
          </div>

          {/* Color Palette */}
          <div className="flex items-center gap-2 border-r pr-4">
            <span className="text-sm font-medium">Colors:</span>
            <div className="flex gap-1">
              {COLORS.slice(0, 8).map((color) => (
                <button
                  key={color}
                  onClick={() => setCurrentColor(color)}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    currentColor === color ? 'border-gray-800 scale-110' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Brush Size */}
          <div className="flex items-center gap-2 border-r pr-4">
            <span className="text-sm font-medium">Size:</span>
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-16"
            />
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">{brushSize}px</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={copyRoomCode} size="sm">
              <Copy className="h-4 w-4 mr-1" />
              Copy Code
            </Button>
            <Button onClick={() => clearCanvas()} variant="outline" size="sm">
              <Trash2 className="h-4 w-4 mr-1" />
              Clear
            </Button>
            <Button onClick={() => navigate('/')} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-1" />
              Leave
            </Button>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative bg-white">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className={`absolute inset-0 w-full h-full ${
            currentTool === 'eraser' ? 'cursor-grab' : 'cursor-crosshair'
          }`}
          style={{ touchAction: 'none' }}
        />
      </div>

      {/* Floating Chat Toggle Button */}
      {!chatOpen && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            onClick={() => setChatOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-full p-3"
          >
            <MessageCircle className="h-5 w-5" />
            {messages.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                {messages.length > 99 ? '99+' : messages.length}
              </span>
            )}
          </Button>
        </div>
      )}

      {/* Floating Chat */}
      {chatOpen && (
        <div className={`fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-xl border transition-all duration-300 ${
          chatMinimized ? 'w-72 h-12' : 'w-80 h-96'
        }`}>
          {/* Chat Header */}
          <div className="flex items-center justify-between p-3 border-b bg-blue-50 rounded-t-lg">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-sm">Chat</span>
              {messages.length > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  {messages.length}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setChatMinimized(!chatMinimized)}
                className="h-6 w-6 p-0"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setChatOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Chat Content */}
          {!chatMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-3 h-72 space-y-2">
                {messages.map((msg, i) => (
                  <div key={i} className="text-sm">
                    <span className="font-medium text-blue-600">{msg.username}:</span>{' '}
                    <span className="text-gray-800">{msg.text}</span>
                  </div>
                ))}
              </div>
              <div className="border-t p-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border rounded text-sm"
                  />
                  <Button onClick={sendMessage} size="sm" className="px-3">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Whiteboard;
