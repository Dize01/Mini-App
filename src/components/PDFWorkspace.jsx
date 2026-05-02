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
  const [pdfDoc, setPdfDoc] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const canvasRefs = useRef([]);
  const pageRefs = useRef([]);

  // Load PDF document once per file
  useEffect(() => {
    if (!file) return;
    let cancelled = false;
    setIsLoading(true);
    setPdfDoc(null);
    setNumPages(0);

    const url = URL.createObjectURL(file);
    pdfjsLib.getDocument({ url }).promise
      .then((doc) => {
        URL.revokeObjectURL(url);
        if (!cancelled) {
          setPdfDoc(doc);
          setNumPages(doc.numPages);
        }
      })
      .catch((err) => {
        URL.revokeObjectURL(url);
        if (!cancelled) console.error('PDF load error:', err);
      });

    return () => { cancelled = true; };
  }, [file]);

  // Render all pages whenever doc or scale changes
  useEffect(() => {
    if (!pdfDoc || numPages === 0) return;

    let cancelled = false;
    setIsLoading(true);

    const renderAll = async () => {
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        if (cancelled) break;

        const page = await pdfDoc.getPage(pageNum);
        if (cancelled) break;

        const viewport = page.getViewport({ scale: totalScale });
        const canvas = canvasRefs.current[pageNum - 1];
        if (!canvas || cancelled) break;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Expose first-page info for coordinate reference
        if (pageNum === 1) {
          const base = page.getViewport({ scale: 1 });
          onPageInfoChange({ width: base.width, height: base.height });
        }

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const task = page.render({ canvasContext: ctx, viewport });
        try {
          await task.promise;
        } catch (err) {
          if (err?.name !== 'RenderingCancelledException') console.error(err);
          break;
        }
      }
      if (!cancelled) setIsLoading(false);
    };

    renderAll();
    return () => { cancelled = true; };
  }, [pdfDoc, numPages, totalScale]);

  const handlePageClick = useCallback((e, pageNum) => {
    // Don't bubble to workspace background handler
    e.stopPropagation();

    if (selectedTool === 'text') {
      const container = pageRefs.current[pageNum - 1];
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const pdfX = (e.clientX - rect.left) / totalScale;
      const pdfY = (e.clientY - rect.top) / totalScale;
      onAddTextBox(pdfX, pdfY, pageNum);
    } else {
      onDeselect();
    }
  }, [selectedTool, totalScale, onAddTextBox, onDeselect]);

  const handleWorkspaceClick = useCallback(() => {
    if (selectedTool === 'select') onDeselect();
  }, [selectedTool, onDeselect]);

  return (
    <div
      className="flex-1 overflow-auto bg-gray-200"
      style={{ cursor: selectedTool === 'text' ? 'crosshair' : 'default' }}
      onClick={handleWorkspaceClick}
    >
      <div className="flex flex-col items-center py-10 gap-5">

        {/* Initial loading placeholder */}
        {isLoading && numPages === 0 && (
          <div
            className="bg-white shadow-2xl flex items-center justify-center"
            style={{ width: 612, height: 792 }}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-500">Loading PDF…</span>
            </div>
          </div>
        )}

        {/* One container per page */}
        {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
          <div key={pageNum} className="flex flex-col items-center">
            {/* Page label */}
            {numPages > 1 && (
              <div className="self-start mb-1.5 text-xs text-gray-400 font-medium select-none">
                Page {pageNum} of {numPages}
              </div>
            )}

            {/* Page canvas + overlays */}
            <div
              ref={(el) => { pageRefs.current[pageNum - 1] = el; }}
              className="relative shadow-2xl"
              onClick={(e) => handlePageClick(e, pageNum)}
            >
              <canvas
                ref={(el) => { canvasRefs.current[pageNum - 1] = el; }}
                style={{ display: 'block' }}
              />

              {/* Text overlays for this page */}
              {textBoxes
                .filter((b) => (b.page ?? 1) === pageNum)
                .map((box) => (
                  <TextBox
                    key={box.id}
                    box={box}
                    isSelected={box.id === selectedId}
                    onSelect={() => onSelectBox(box.id)}
                    onUpdate={onUpdateBox}
                    totalScale={totalScale}
                  />
                ))}

              {/* "Click to add text" hint */}
              {selectedTool === 'text' && !isLoading && pageNum === 1 && (
                <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none">
                  <span className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-full shadow-lg font-medium">
                    Click anywhere to add text
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Bottom padding so last page doesn't touch the edge */}
        {numPages > 0 && <div className="h-10" />}
      </div>
    </div>
  );
}
