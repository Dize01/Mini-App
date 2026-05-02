import { useRef, useEffect, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import TextBox from './TextBox';
import Shape from './Shape';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

export default function PDFWorkspace({
  file,
  textBoxes,
  shapes,
  selectedId,
  onSelectItem,
  onAddTextBox,
  onAddShape,
  onUpdateBox,
  onUpdateShape,
  selectedTool,
  totalScale,
  onPageInfoChange,
  onDeselect,
}) {
  const [pdfDoc, setPdfDoc]   = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const canvasRefs = useRef([]);
  const pageRefs   = useRef([]);

  // Load PDF doc once per file
  useEffect(() => {
    if (!file) return;
    let cancelled = false;
    setIsLoading(true);
    setPdfDoc(null);
    setNumPages(0);

    const url = URL.createObjectURL(file);
    pdfjsLib.getDocument({ url }).promise
      .then(doc => {
        URL.revokeObjectURL(url);
        if (!cancelled) { setPdfDoc(doc); setNumPages(doc.numPages); }
      })
      .catch(err => { URL.revokeObjectURL(url); if (!cancelled) console.error(err); });

    return () => { cancelled = true; };
  }, [file]);

  // Render all pages when doc or scale changes
  useEffect(() => {
    if (!pdfDoc || numPages === 0) return;
    let cancelled = false;
    setIsLoading(true);

    const renderAll = async () => {
      for (let p = 1; p <= numPages; p++) {
        if (cancelled) break;
        const page = await pdfDoc.getPage(p);
        if (cancelled) break;
        const viewport = page.getViewport({ scale: totalScale });
        const canvas = canvasRefs.current[p - 1];
        if (!canvas || cancelled) break;
        canvas.width  = viewport.width;
        canvas.height = viewport.height;
        if (p === 1) {
          const base = page.getViewport({ scale: 1 });
          onPageInfoChange({ width: base.width, height: base.height });
        }
        const task = page.render({ canvasContext: canvas.getContext('2d'), viewport });
        try { await task.promise; }
        catch (e) { if (e?.name !== 'RenderingCancelledException') console.error(e); break; }
      }
      if (!cancelled) setIsLoading(false);
    };

    renderAll();
    return () => { cancelled = true; };
  }, [pdfDoc, numPages, totalScale]);

  const handlePageClick = useCallback((e, pageNum) => {
    e.stopPropagation();
    const container = pageRefs.current[pageNum - 1];
    if (!container) return;

    if (selectedTool === 'text' || selectedTool === 'shape') {
      const rect = container.getBoundingClientRect();
      const pdfX = (e.clientX - rect.left) / totalScale;
      const pdfY = (e.clientY - rect.top)  / totalScale;
      selectedTool === 'text' ? onAddTextBox(pdfX, pdfY, pageNum) : onAddShape(pdfX, pdfY, pageNum);
    } else {
      onDeselect();
    }
  }, [selectedTool, totalScale, onAddTextBox, onAddShape, onDeselect]);

  const cursor = selectedTool === 'text' || selectedTool === 'shape' ? 'crosshair' : 'default';

  return (
    <div
      className="flex-1 overflow-auto bg-gray-200"
      style={{ cursor }}
      onClick={() => { if (selectedTool === 'select') onDeselect(); }}
    >
      <div className="flex flex-col items-center py-10 gap-5">

        {/* Loading placeholder */}
        {isLoading && numPages === 0 && (
          <div className="bg-white shadow-2xl flex items-center justify-center" style={{ width: 612, height: 792 }}>
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"/>
              <span className="text-sm text-gray-500">Loading PDF…</span>
            </div>
          </div>
        )}

        {Array.from({ length: numPages }, (_, i) => i + 1).map(pageNum => (
          <div key={pageNum} className="flex flex-col items-center">
            {numPages > 1 && (
              <div className="self-start mb-1.5 text-xs text-gray-400 font-medium select-none">
                Page {pageNum} of {numPages}
              </div>
            )}

            <div
              ref={el => { pageRefs.current[pageNum - 1] = el; }}
              className="relative shadow-2xl"
              onClick={e => handlePageClick(e, pageNum)}
            >
              <canvas ref={el => { canvasRefs.current[pageNum - 1] = el; }} style={{ display: 'block' }}/>

              {/* Shapes for this page */}
              {shapes.filter(s => (s.page ?? 1) === pageNum).map(shape => (
                <Shape
                  key={shape.id}
                  shape={shape}
                  isSelected={shape.id === selectedId}
                  onSelect={() => onSelectItem(shape.id)}
                  onUpdate={onUpdateShape}
                  totalScale={totalScale}
                />
              ))}

              {/* Text boxes for this page */}
              {textBoxes.filter(b => (b.page ?? 1) === pageNum).map(box => (
                <TextBox
                  key={box.id}
                  box={box}
                  isSelected={box.id === selectedId}
                  onSelect={() => onSelectItem(box.id)}
                  onUpdate={onUpdateBox}
                  totalScale={totalScale}
                />
              ))}

              {/* Tool hint */}
              {(selectedTool === 'text' || selectedTool === 'shape') && !isLoading && pageNum === 1 && (
                <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none">
                  <span className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-full shadow-lg font-medium">
                    Click to add {selectedTool === 'text' ? 'text' : 'shape'}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}

        {numPages > 0 && <div className="h-10"/>}
      </div>
    </div>
  );
}
