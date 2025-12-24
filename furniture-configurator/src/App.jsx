
import React from 'react';
import { Scene } from './components/Scene';
import { Sidebar } from './components/Sidebar';
import { CanvasControls } from './components/CanvasControls';

function App() {
  return (
    <div className="tylko-layout">
      <div className="canvas-area">
        <div className="back-link">
          <span>←</span> Back
        </div>

        <Scene />
        <CanvasControls />

        {/* "Add module" floating button mentioned in screenshot bottom right */}

      </div>

      <Sidebar />
    </div>
  );
}

export default App;
