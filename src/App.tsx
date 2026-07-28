import { useState, useEffect, useRef } from 'react';
import type { LogoConfig, Preset } from './types';
import { DEFAULT_CONFIG } from './presets';
import { Navbar } from './components/Navbar';
import { ControlPanel } from './components/ControlPanel';
import { LogoCanvas } from './components/LogoCanvas';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Eye, 
  EyeOff 
} from 'lucide-react';
import './App.css';

function App() {
  const [config, setConfig] = useState<LogoConfig>(DEFAULT_CONFIG);
  const [activePresetId, setActivePresetId] = useState<string | null>('reezma-original');
  const [showGrid, setShowGrid] = useState(false);
  const [zoom, setZoom] = useState(1);
  
  // History state for Undo/Redo
  const [history, setHistory] = useState<LogoConfig[]>([DEFAULT_CONFIG]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const isHistoryActionRef = useRef(false);

  const svgRef = useRef<SVGSVGElement | null>(null);

  // Synchronize history checkpoints when config changes (debounced to group rapid slider drags)
  useEffect(() => {
    // If the change came from an undo/redo button click, do not create a new history entry
    if (isHistoryActionRef.current) {
      isHistoryActionRef.current = false;
      return;
    }

    const lastSaved = history[historyIndex];
    if (JSON.stringify(lastSaved) === JSON.stringify(config)) {
      return;
    }

    const timer = setTimeout(() => {
      const nextHistory = history.slice(0, historyIndex + 1);
      setHistory([...nextHistory, config]);
      setHistoryIndex(nextHistory.length);
    }, 450); // debounce slider drags / text inputs

    return () => clearTimeout(timer);
  }, [config, history, historyIndex]);

  const handleConfigChange = (updates: Partial<LogoConfig>) => {
    setActivePresetId(null); // Clear preset selection if customized
    setConfig(prev => ({
      ...prev,
      ...updates
    }));
  };

  const handleSelectPreset = (preset: Preset) => {
    setActivePresetId(preset.id);
    // Directly push to history and update config
    isHistoryActionRef.current = true;
    
    setConfig(preset.config);
    
    const nextHistory = history.slice(0, historyIndex + 1);
    setHistory([...nextHistory, preset.config]);
    setHistoryIndex(nextHistory.length);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      isHistoryActionRef.current = true;
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setConfig(history[prevIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      isHistoryActionRef.current = true;
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setConfig(history[nextIndex]);
    }
  };

  const handleReset = () => {
    isHistoryActionRef.current = true;
    setConfig(DEFAULT_CONFIG);
    setActivePresetId('reezma-original');
    
    const nextHistory = history.slice(0, historyIndex + 1);
    setHistory([...nextHistory, DEFAULT_CONFIG]);
    setHistoryIndex(nextHistory.length);
  };

  // Zoom functions
  const handleZoomIn = () => setZoom(prev => Math.min(2.0, prev + 0.1));
  const handleZoomOut = () => setZoom(prev => Math.max(0.5, prev - 0.1));
  const handleZoomReset = () => setZoom(1);

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <Navbar
        config={config}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onReset={handleReset}
        svgRef={svgRef}
      />

      {/* Main Workspace Dashboard */}
      <div className="dashboard">
        {/* Left Side Editing Controls */}
        <ControlPanel
          config={config}
          onChange={handleConfigChange}
          activePresetId={activePresetId}
          onSelectPreset={handleSelectPreset}
        />

        {/* Central Logo Canvas Viewport */}
        <main className="canvas-area">
          {/* Zoom & Grid Toolbar */}
          <div className="canvas-toolbar">
            <button 
              className="btn-icon" 
              onClick={() => setShowGrid(prev => !prev)} 
              title={showGrid ? "Hide Grid Guides" : "Show Grid Guides"}
              style={{ color: showGrid ? 'var(--accent-blue)' : 'inherit', borderColor: showGrid ? 'var(--accent-blue)' : 'var(--border-light)' }}
            >
              {showGrid ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
            
            <div className="toolbar-divider"></div>
            
            <button className="btn-icon" onClick={handleZoomOut} disabled={zoom <= 0.5} title="Zoom Out">
              <ZoomOut size={16} />
            </button>
            <span className="zoom-value">{Math.round(zoom * 100)}%</span>
            <button className="btn-icon" onClick={handleZoomIn} disabled={zoom >= 2.0} title="Zoom In">
              <ZoomIn size={16} />
            </button>
            
            <div className="toolbar-divider"></div>
            
            <button className="btn-icon" onClick={handleZoomReset} disabled={zoom === 1} title="Reset Zoom">
              <Maximize2 size={16} />
            </button>
          </div>

          {/* Scalable Logo Render */}
          <LogoCanvas
            config={config}
            showGrid={showGrid}
            zoom={zoom}
            svgRef={svgRef}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
