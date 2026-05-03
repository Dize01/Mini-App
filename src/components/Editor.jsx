import { useState, useCallback } from 'react';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import PDFWorkspace from './PDFWorkspace';

const RENDER_SCALE = 1.5;
let nextId = 1;

export default function Editor({ file, onReset }) {
  const [textBoxes, setTextBoxes]       = useState([]);
  const [shapes, setShapes]             = useState([]);
  const [images, setImages]             = useState([]);
  const [selectedTool, setSelectedTool] = useState('select');
  const [activeShapeType, setActiveShapeType] = useState('rect');
  const [selectedId, setSelectedId]     = useState(null);
  const [zoom, setZoom]                 = useState(() => window.innerWidth < 768 ? 0.5 : 1.0);
  const [pageInfo, setPageInfo]         = useState(null);

  const totalScale = RENDER_SCALE * zoom;

  const selectedBox   = textBoxes.find(b => b.id === selectedId) ?? null;
  const selectedShape = shapes.find(s => s.id === selectedId) ?? null;
  const selectedImage = images.find(i => i.id === selectedId) ?? null;

  // ── Text ────────────────────────────────────────────────────
  const addTextBox = useCallback((pdfX, pdfY, pageNum = 1) => {
    const id = String(nextId++);
    setTextBoxes(prev => [...prev, {
      id, page: pageNum, x: pdfX, y: pdfY,
      text: 'Enter text', fontSize: 16, color: '#1a1a1a', bold: false, italic: false, fontFamily: 'Arial',
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

  // ── Shapes ──────────────────────────────────────────────────
  const addShape = useCallback((pdfX, pdfY, pageNum = 1, shapeType) => {
    const id = String(nextId++);
    const w = shapeType === 'circle' ? 80 : 120;
    const h = shapeType === 'circle' ? 80 : 60;
    setShapes(prev => [...prev, {
      id, shapeType, page: pageNum,
      x: pdfX - w / 2, y: pdfY - h / 2,
      width: w, height: h,
      fillColor: '#dbeafe', borderColor: '#3b82f6', borderWidth: 2,
    }]);
    setSelectedId(id);
    setSelectedTool('select');
  }, []);

  const updateShape = useCallback((id, u) =>
    setShapes(prev => prev.map(s => s.id === id ? { ...s, ...u } : s)), []);

  const deleteShape = useCallback((id) => {
    setShapes(prev => prev.filter(s => s.id !== id));
    setSelectedId(null);
  }, []);

  // ── Images ──────────────────────────────────────────────────
  const addImage = useCallback(async (file) => {
    if (!file) return;

    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    const dataUrl = await new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload  = e => res(e.target.result);
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });

    const img = new window.Image();
    img.src = dataUrl;
    await new Promise(res => { img.onload = res; });

    const maxW  = 200;
    const scale = Math.min(1, maxW / img.naturalWidth);
    const w = Math.round(img.naturalWidth  * scale);
    const h = Math.round(img.naturalHeight * scale);

    const pageW = pageInfo?.width  ?? 595;
    const pageH = pageInfo?.height ?? 842;

    const id = String(nextId++);
    setImages(prev => [...prev, {
      id, page: 1,
      x: pageW / 2 - w / 2,
      y: pageH / 2 - h / 2,
      width: w, height: h,
      dataUrl, bytes,
      mimeType: file.type,
    }]);
    setSelectedId(id);
  }, [pageInfo]);

  const updateImage = useCallback((id, u) =>
    setImages(prev => prev.map(i => i.id === id ? { ...i, ...u } : i)), []);

  const deleteImage = useCallback((id) => {
    setImages(prev => prev.filter(i => i.id !== id));
    setSelectedId(null);
  }, []);

  const addSignature = useCallback(async ({ dataUrl, bytes, mimeType }) => {
    const img = new window.Image();
    img.src = dataUrl;
    await new Promise(res => { img.onload = res; });
    const maxW  = 200;
    const scale = Math.min(1, maxW / img.naturalWidth);
    const w = Math.round(img.naturalWidth  * scale);
    const h = Math.round(img.naturalHeight * scale);
    const pageW = pageInfo?.width  ?? 595;
    const pageH = pageInfo?.height ?? 842;
    const id = String(nextId++);
    setImages(prev => [...prev, {
      id, page: 1,
      x: pageW / 2 - w / 2,
      y: pageH / 2 - h / 2,
      width: w, height: h,
      dataUrl, bytes, mimeType,
    }]);
    setSelectedId(id);
  }, [pageInfo]);

  // ────────────────────────────────────────────────────────────
  const handleToolChange = useCallback((tool) => {
    setSelectedTool(tool);
    if (tool !== 'select') setSelectedId(null);
  }, []);

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <TopBar
        fileName={file.name}
        zoom={zoom}
        onZoomChange={setZoom}
        file={file}
        textBoxes={textBoxes}
        shapes={shapes}
        images={images}
        onReset={onReset}
      />
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        <Sidebar
          selectedTool={selectedTool}
          onToolChange={handleToolChange}
          activeShapeType={activeShapeType}
          onShapeTypeChange={setActiveShapeType}
          selectedBox={selectedBox}
          selectedShape={selectedShape}
          selectedImage={selectedImage}
          onUpdateBox={updateTextBox}
          onDeleteBox={deleteTextBox}
          onUpdateShape={updateShape}
          onDeleteShape={deleteShape}
          onUpdateImage={updateImage}
          onDeleteImage={deleteImage}
          onAddImage={addImage}
          onAddSignature={addSignature}
        />
        <PDFWorkspace
          file={file}
          textBoxes={textBoxes}
          shapes={shapes}
          images={images}
          selectedId={selectedId}
          onSelectItem={setSelectedId}
          onAddTextBox={addTextBox}
          onAddShape={(x, y, page) => addShape(x, y, page, activeShapeType)}
          onUpdateBox={updateTextBox}
          onUpdateShape={updateShape}
          onUpdateImage={updateImage}
          selectedTool={selectedTool}
          totalScale={totalScale}
          onPageInfoChange={setPageInfo}
          onDeselect={() => setSelectedId(null)}
        />
      </div>
    </div>
  );
}
