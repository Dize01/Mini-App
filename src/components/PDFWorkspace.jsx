import { useRef, useEffect, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import TextBox from './TextBox';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

export default function PDFWorkspace({
  file,
  textBoxes,
  selectedId,
  onSelectBox,
  onAddTextBox,
  onUpdateBox,
  selectedTool,
  totalScale,
  onPageInfoChange,
  onDeselect,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [pdfDoc, setPdfDoc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const renderTaskRef = useRef(null);

  // Load PDF document once when file changes
  useEffect(() => {
    if (!file) return;
    let cancelled = false;
    setIsLoading(true);

    const load = async () => {
      const url = URL.createObjectURL(file);
      try {
        const doc = await pdfjsLib.getDocument({ url }).promise;
        if (!cancelled) setPdfDoc(doc);
      } catch (err) {
        if (!cancelled) console.error('PDF load error:', err);
      } finally {
        URL.revokeObjectURL(url);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [file]);

  // Render current page whenever doc or scale changes
  useEffect(() => {
    if (!pdfDoc) return;
    let cancelled = false;

    const render = async () => {
      const page = await pdfDoc.getPage(1);
      if (cancelled) return;

      const viewport = page.getViewport({ scale: totalScale });
      const canvas = canvasRef.current;
      if (!canvas || cancelled) return;

      // Cancel any in-progress render
      if (renderTaskRef.current) {
        try { renderTaskRef.current.cancel(); } catch (_) {}
      }

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      setCanvasSize({ width: viewport.width, height: viewport.height });

      // Expose page dimensions in PDF points for coordinate conversion
      const baseViewport = page.getViewport({ scale: 1 });
      onPageInfoChange({ width: baseViewport.width, height: baseViewport.height });

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const task = page.render({ canvasContext: ctx, viewport });
      renderTaskRef.current = task;

      try {
        await task.promise;
        if (!cancelled) setIsLoading(false);
      } catch (err) {
        if (err?.name !== 'RenderingCancelledException' && !cancelled) {
          console.error('Render error:', err);
        }
      }
    };

    render();
    return () => { cancelled = true; };
  }, [pdfDoc, totalScale]);

  const handleCanvasClick = useCallback((e) => {
    if (selectedTool !== 'text') return;
    const rect = containerRef.current.getBoundingClientRect();
    const pdfX = (e.clientX - rect.left) / totalScale;
    const pdfY = (e.clientY - rect.top) / totalScale;
    onAddTextBox(pdfX, pdfY);
  }, [selectedTool, totalScale, onAddTextBox]);

  const handleWorkspaceClick = useCallback((e) => {
    // Only deselect if clicking directly on the workspace background
    if (e.target === e.currentTarget || e.target === canvasRef.current) {
      if (selectedTool === 'select') onDeselect();
      handleCanvasClick(e);
    }
  }, [handleCanvasClick, selectedTool, onDeselect]);

  return (
    <div className="flex-1 overflow-auto bg-gray-200">
      <div
        className="flex items-start justify-center p-10 min-h-full min-w-full"
        style={{ cursor: selectedTool === 'text' ? 'crosshair' : 'default' }}
        onClick={handleWorkspaceClick}
      >
        {/* PDF canvas + overlays container */}
        <div
          ref={containerRef}
          style={{
            position: 'relative',
            width: canvasSize.width || 'auto',
            height: canvasSize.height || 'auto',
            flexShrink: 0,
          }}
          className="shadow-2xl"
        >
          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white flex items-center justify-center z-30 rounded-sm" style={{ minWidth: 400, minHeight: 500 }}>
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-gray-500">Loading PDF…</span>
              </div>
            </div>
          )}

          <canvas ref={canvasRef} style={{ display: 'block' }} />

          {/* Text overlays */}
          {textBoxes.map(box => (
            <TextBox
              key={box.id}
              box={box}
              isSelected={box.id === selectedId}
              onSelect={() => onSelectBox(box.id)}
              onUpdate={onUpdateBox}
              totalScale={totalScale}
              containerRef={containerRef}
            />
          ))}

          {/* Text tool hint */}
          {selectedTool === 'text' && !isLoading && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none">
              <span className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-full shadow-lg font-medium">
                Click anywhere to add text
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
