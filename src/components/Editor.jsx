import { useState, useCallback } from 'react';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import PDFWorkspace from './PDFWorkspace';

// Base rendering scale: 1 PDF point = RENDER_SCALE CSS pixels
const RENDER_SCALE = 1.5;

let nextId = 1;

export default function Editor({ file, onReset }) {
  const [textBoxes, setTextBoxes] = useState([]);
  const [selectedTool, setSelectedTool] = useState('select');
  const [selectedId, setSelectedId] = useState(null);
  const [zoom, setZoom] = useState(1.0);
  const [pageInfo, setPageInfo] = useState(null);

  // Total pixels per PDF point
  const totalScale = RENDER_SCALE * zoom;

  const addTextBox = useCallback((pdfX, pdfY, pageNum = 1) => {
    const id = String(nextId++);
    setTextBoxes(prev => [...prev, {
      id,
      page: pageNum,
      x: pdfX,
      y: pdfY,
      text: 'Enter text',
      fontSize: 16,
      color: '#1a1a1a',
      bold: false,
    }]);
    setSelectedId(id);
    setSelectedTool('select');
  }, []);

  const updateTextBox = useCallback((id, updates) => {
    setTextBoxes(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  }, []);

  const deleteTextBox = useCallback((id) => {
    setTextBoxes(prev => prev.filter(b => b.id !== id));
    setSelectedId(null);
  }, []);

  const selectedBox = textBoxes.find(b => b.id === selectedId) ?? null;

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <TopBar
        fileName={file.name}
        zoom={zoom}
        onZoomChange={setZoom}
        file={file}
        textBoxes={textBoxes}
        pageInfo={pageInfo}
        onReset={onReset}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          selectedTool={selectedTool}
          onToolChange={(tool) => { setSelectedTool(tool); if (tool !== 'select') setSelectedId(null); }}
          selectedBox={selectedBox}
          onUpdateBox={updateTextBox}
          onDeleteBox={deleteTextBox}
        />
        <PDFWorkspace
          file={file}
          textBoxes={textBoxes}
          selectedId={selectedId}
          onSelectBox={setSelectedId}
          onAddTextBox={addTextBox}
          onUpdateBox={updateTextBox}
          selectedTool={selectedTool}
          totalScale={totalScale}
          onPageInfoChange={setPageInfo}
          onDeselect={() => setSelectedId(null)}
        />
      </div>
    </div>
  );
}
