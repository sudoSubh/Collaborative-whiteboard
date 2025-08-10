import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';


import { Palette, Users, Zap } from 'lucide-react';

const Home = () => {
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    if (!username.trim()) {
      alert('Please enter your username');
      return;
    }

    setIsConnecting(true);
    // Navigate with just the username, socket will be created in Whiteboard component
    navigate(`/room/create`, {
      state: { username: username.trim(), action: 'create' }
    });
  };

  const handleJoinRoom = () => {
    if (!username.trim()) {
      alert('Please enter your username');
      return;
    }
    if (!roomCode.trim()) {
      alert('Please enter room code');
      return;
    }

    setIsConnecting(true);
    navigate(`/room/${roomCode.trim().toUpperCase()}`, {
      state: { username: username.trim(), action: 'join' }
    });
  };

  const handleJoinRandom = () => {
    if (!username.trim()) {
      alert('Please enter your username');
      return;
    }

    setIsConnecting(true);
    navigate(`/room/random`, {
      state: { username: username.trim(), action: 'random' }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between h-14">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-7 h-7 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center rotate-12">
                  <Palette className="w-4 h-4 text-white" />
                </div>
                <span className="ml-3 text-lg font-bold text-slate-800">Whiteboard</span>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-xs text-slate-500 font-medium">✨ Draw with friends</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8 pt-16 pb-12">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-5xl lg:text-6xl font-black text-slate-800 mb-6 leading-tight">
              Sketch, share &
              <span className="block text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text">
                collaborate
              </span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
              Jump into a shared drawing space with your team. No hassle, no signup - just pure creativity flowing together.
            </p>
          </div>

          <div className="flex-shrink-0 w-full max-w-sm">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 p-8">
              <div className="space-y-5">
                <div>
                  <label htmlFor="username" className="block text-sm font-semibold text-slate-700 mb-2">
                    What should we call you?
                  </label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Your name here..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    maxLength={20}
                    className="w-full border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-semibold shadow-lg transition-all duration-200 transform hover:scale-105"
                    onClick={handleCreateRoom}
                    disabled={isConnecting}
                  >
                    {isConnecting ? 'Creating magic...' : '🎨 Start New Board'}
                  </Button>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-slate-300" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-white px-3 text-slate-500 font-medium">or hop into existing</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="ABC123"
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                      maxLength={6}
                      className="flex-1 border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 text-center font-mono"
                    />
                    <Button
                      variant="outline"
                      onClick={handleJoinRoom}
                      disabled={isConnecting}
                      className="px-4 border-slate-300 hover:border-indigo-500 hover:bg-indigo-50"
                    >
                      {isConnecting ? '...' : 'Jump In'}
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full border-slate-300 hover:border-indigo-500 hover:bg-indigo-50 text-slate-700"
                    onClick={handleJoinRandom}
                    disabled={isConnecting}
                  >
                    {isConnecting ? 'Searching...' : '🎲 Join Random Room'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white/50 backdrop-blur-sm py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Why our whiteboard rocks</h2>
            <p className="text-lg text-slate-600">Built for real people doing real work</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <Palette className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Draw Together</h3>
              <p className="text-slate-600 leading-relaxed">
                Watch your ideas come to life as everyone draws at the same time. No lag, no waiting.
              </p>
            </div>

            <div className="text-center group">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Easy Sharing</h3>
              <p className="text-slate-600 leading-relaxed">
                Just share your room code and boom - your team is in. Works on any device, anywhere.
              </p>
            </div>

            <div className="text-center group">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <Zap className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Zero Setup</h3>
              <p className="text-slate-600 leading-relaxed">
                No accounts, no downloads, no nonsense. Just open and start creating together.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
