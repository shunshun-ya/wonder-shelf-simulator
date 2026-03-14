import React, { useState, useMemo } from 'react'
import { WONDER_SHELF_DATA as data } from './data'
import ShelfPreview from './Shelf'
import {
  Plus,
  Trash2,
  Maximize2,
  Box,
  Layers,
  Info,
  Download,
  Ruler,
  ChevronRight,
  ChevronDown
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

function App() {
  const [boardSizeIndex, setBoardSizeIndex] = useState(0);
  const [layers, setLayers] = useState([
    { poleModel: "PP-250" },
    { poleModel: "PP-250" }
  ]);
  const [activeTab, setActiveTab] = useState('config');

  const selectedBoard = data.parts.shelf_boards[boardSizeIndex];

  const totalHeight = useMemo(() => {
    return layers.reduce((acc, layer) => {
      const pole = data.parts.poles.find(p => p.model === layer.poleModel);
      return acc + (pole?.effective_height || 0);
    }, 0);
  }, [layers]);

  const partsList = useMemo(() => {
    const list = {};

    // Boards
    const boardName = `${selectedBoard.width}x${selectedBoard.depth}`;
    list[boardName] = (list[boardName] || 0) + layers.length;

    // Poles
    layers.forEach(layer => {
      list[layer.poleModel] = (list[layer.poleModel] || 0) + 4;
    });

    // Hardware
    list["アジャスター (4個入)"] = 1;
    list["連結ボルト"] = (layers.length - 1) * 4;
    list["六角ビス (4個入)"] = 1;

    return Object.entries(list);
  }, [selectedBoard, layers]);

  const addLayer = () => {
    if (layers.length < 10) {
      setLayers([...layers, { poleModel: "PP-200" }]);
    }
  };

  const removeLayer = (index) => {
    if (layers.length > 1) {
      const newLayers = [...layers];
      newLayers.splice(index, 1);
      setLayers(newLayers);
    }
  };

  const updateLayer = (index, model) => {
    const newLayers = [...layers];
    newLayers[index].poleModel = model;
    setLayers(newLayers);
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar glass">
        <header className="brand">
          <Box className="brand-icon" />
          <div className="brand-text">
            <h1>Wonder Shelf</h1>
            <span>DIY Simulator</span>
          </div>
        </header>

        <nav className="tabs">
          <button
            className={activeTab === 'config' ? 'active' : ''}
            onClick={() => setActiveTab('config')}
          >
            <Layers size={18} /> Configure
          </button>
          <button
            className={activeTab === 'parts' ? 'active' : ''}
            onClick={() => setActiveTab('parts')}
          >
            <Info size={18} /> Parts List
          </button>
        </nav>

        <div className="sidebar-content">
          {activeTab === 'config' ? (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="config-section"
            >
              <h3>Shelf Board Size</h3>
              <div className="board-grid">
                {data.parts.shelf_boards.map((b, i) => (
                  <button
                    key={i}
                    className={`board-btn ${boardSizeIndex === i ? 'selected' : ''}`}
                    onClick={() => setBoardSizeIndex(i)}
                  >
                    <div className="board-dims">{b.width} × {b.depth}</div>
                    <div className="board-unit">mm</div>
                  </button>
                ))}
              </div>

              <div className="layers-header">
                <h3>Shelf Levels</h3>
                <span className="badge">{layers.length} Layers</span>
              </div>

              <div className="layers-list">
                <AnimatePresence>
                  {layers.map((layer, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="layer-item"
                    >
                      <div className="layer-info">
                        <span className="layer-badge">{index + 1}F</span>
                        <select
                          value={layer.poleModel}
                          onChange={(e) => updateLayer(index, e.target.value)}
                        >
                          {data.parts.poles.map(p => (
                            <option key={p.model} value={p.model}>
                              {p.model} (Height: {p.effective_height}mm)
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        className="delete-btn"
                        onClick={() => removeLayer(index)}
                        disabled={layers.length <= 1}
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  )).reverse()}
                </AnimatePresence>
              </div>

              <button className="add-layer-btn" onClick={addLayer}>
                <Plus size={18} /> Add New Level
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="parts-section"
            >
              <h3>Part Summary</h3>
              <div className="parts-card">
                {partsList.map(([name, count]) => (
                  <div key={name} className="part-line">
                    <span className="part-name">{name}</span>
                    <span className="part-count">× {count}</span>
                  </div>
                ))}
              </div>

              <div className="total-specs">
                <div className="spec-item">
                  <Ruler size={16} />
                  <span>Total Height: <strong>{totalHeight} mm</strong></span>
                </div>
                <div className="spec-item">
                  <Maximize2 size={16} />
                  <span>Width: <strong>{selectedBoard.width} mm</strong></span>
                </div>
              </div>

              <button className="export-btn">
                <Download size={18} /> Export List (CSV)
              </button>
            </motion.div>
          )}
        </div>
      </aside>

      {/* Main Viewport */}
      <main className="viewport">
        <div className="viewport-overlay">
          <div className="dimension-badge glass">
            <Ruler size={16} />
            {totalHeight} mm
          </div>
          <div className="hint glass">
            Drag to rotate • Scroll to zoom
          </div>
        </div>

        <ShelfPreview
          config={{ board: selectedBoard, layers, footer: 'adjuster' }}
          data={data}
        />
      </main>
    </div>
  )
}

export default App
