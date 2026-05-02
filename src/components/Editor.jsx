import { useState, useCallback } from 'react';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import PDFWorkspace from './PDFWorkspace';

const RENDER_SCALE = 1.5;
let nextId = 1;

export default function Editor({ file, onReset }) {
  const [textBoxes, setTextBoxes]       = useState([]);
  const [shapes, setShapes]             = useState([]);
  const [selectedTool, setSelectedTool] = useState('select');
  const [activeShapeType, setActiveShapeType] = useState('rect');
  const [selectedId, setSelectedId]     = useState(null);
  const [zoom, setZoom]                 = useState(1.0);
  const [pageInfo, setPageInfo]         = useState(null);

  const totalScale = RENDER_SCALE * zoom;

  // Look up selected item across both arrays (IDs are globally unique)
  const selectedBox   = textBoxes.find(b => b.id === selectedId) ?? null;
  const selectedShape = shapes.find(s => s.id === selectedId) ?? null;

  const addTextBox = useCallback((pdfX, pdfY, pageNum = 1) => {
    const id = String(nextId++);
    setTextBoxes(prev => [...prev, {
      id, page: pageNum, x: pdfX, y: pdfY,
      text: 'Enter text', fontSize: 16, color: '#1a1a1a', bold: false,
    }]);
    setSelectedId(id);
    setSelectedTool('select');
  }, []);

  const addShape = useCallback((pdfX, pdfY, pageNum = 1, shapeType) => {
    const id = String(nextId++);
    const w = shapeType === 'circle' ? 80 : 120;
    const h = shapeType === 'circle' ? 80 : 60;
    setShapes(prev => [...prev, {
      id, shapeType, page: pageNum,
      x: pdfX - w / 2, y: pdfY - h / 2,
      width: w, height: h,
      fillColor: '#dbeafe',
      borderColor: '#3b82f6',
      borderWidth: 2,
    }]);
    setSelectedId(id);
    setSelectedTool('select');
  }, []);

  const updateTextBox = useCallback((id, u) =>
    setTextBoxes(prev => prev.map(b => b.id === id ? { ...b, ...u } : b)), []);

  const deleteTextBox = useCallback((id) => {
    setTextBoxes(prev => prev.filter(b => b.id !== id));
    setSelectedId(null);
  }, []);

  const updateShape = useCallback((id, u) =>
    setShapes(prev => prev.map(s => s.id === id ? { ...s, ...u } : s)), []);

  const deleteShape = useCallback((id) => {
    setShapes(prev => prev.filter(s => s.id !== id));
    setSelectedId(null);
  }, []);

  const handleToolChange = useCallback((tool) => {
    setSelectedTool(tool);
    if (tool !== 'select') setSelectedId(null);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <TopBar
        fileName={file.name}
        zoom={zoom}
        onZoomChange={setZoom}
        file={file}
        textBoxes={textBoxes}
        shapes={shapes}
        onReset={onReset}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          selectedTool={selectedTool}
          onToolChange={handleToolChange}
          activeShapeType={activeShapeType}
          onShapeTypeChange={setActiveShapeType}
          selectedBox={selectedBox}
          selectedShape={selectedShape}
          onUpdateBox={updateTextBox}
          onDeleteBox={deleteTextBox}
          onUpdateShape={updateShape}
          onDeleteShape={deleteShape}
        />
        <PDFWorkspace
          file={file}
          textBoxes={textBoxes}
          shapes={shapes}
          selectedId={selectedId}
          onSelectItem={setSelectedId}
          onAddTextBox={addTextBox}
          onAddShape={(x, y, page) => addShape(x, y, page, activeShapeType)}
          onUpdateBox={updateTextBox}
          onUpdateShape={updateShape}
          selectedTool={selectedTool}
          totalScale={totalScale}
          onPageInfoChange={setPageInfo}
          onDeselect={() => setSelectedId(null)}
        />
      </div>
    </div>
  );
}
