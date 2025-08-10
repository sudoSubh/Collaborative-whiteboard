import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Whiteboard from './components/Whiteboard';

function App() {
  return (
    <Router>
      <div className="h-screen overflow-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:roomId" element={<Whiteboard />} />
          <Route path="/room/create" element={<Whiteboard />} />
          <Route path="/room/random" element={<Whiteboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
