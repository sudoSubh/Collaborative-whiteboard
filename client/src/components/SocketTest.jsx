import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3004';

const SocketTest = () => {
  const [status, setStatus] = useState('disconnected');
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    addLog(`Attempting to connect to: ${SOCKET_URL}`);
    
    const socket = io(SOCKET_URL);

    socket.on('connect', () => {
      setStatus('connected');
      addLog(`Connected! Socket ID: ${socket.id}`);
    });

    socket.on('disconnect', () => {
      setStatus('disconnected');
      addLog('Disconnected');
    });

    socket.on('connect_error', (error) => {
      setStatus('error');
      addLog(`Connection error: ${error.message}`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const testCreateRoom = () => {
    const socket = io(SOCKET_URL);
    
    socket.on('connect', () => {
      addLog('Testing room creation...');
      socket.emit('create-room', { username: 'TestUser' });
    });

    socket.on('room-created', (data) => {
      addLog(`Room created: ${data.roomId}`);
      socket.disconnect();
    });

    socket.on('room-error', (data) => {
      addLog(`Room error: ${data.error}`);
      socket.disconnect();
    });
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Socket Connection Test</h1>
      
      <div className="mb-4">
        <span className="font-semibold">Status: </span>
        <span className={`px-2 py-1 rounded ${
          status === 'connected' ? 'bg-green-100 text-green-800' :
          status === 'error' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {status}
        </span>
      </div>

      <div className="mb-4">
        <span className="font-semibold">Socket URL: </span>
        <code className="bg-gray-100 px-2 py-1 rounded">{SOCKET_URL}</code>
      </div>

      <button 
        onClick={testCreateRoom}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
      >
        Test Create Room
      </button>

      <div className="border rounded p-4 bg-gray-50">
        <h3 className="font-semibold mb-2">Connection Logs:</h3>
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className="text-sm font-mono">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocketTest;