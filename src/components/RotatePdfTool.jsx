import { useState, useRef, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument, degrees } from 'pdf-lib';

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

async function renderThumbnail(pdfDoc, pageNum) {
  const page     = await pdfDoc.getPage(pageNum);
  const viewport = page.getViewport({ scale: 0.3 });
  const canvas   = document.createElement('canvas');
  canvas.width   = viewport.width;
  canvas.height  = viewport.height;
  await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
  return canvas.toDataURL();
}

function IconRotateLeft() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 2v6h6"/><path d="M2.66 15.57a10 10 0 1 0 .57-8.38"/>
    </svg>
  );
}

function IconRotateRight() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.5 2v6h-6"/><path d="M21.34 15.57a10 10 0 1 1-.57-8.38"/>
    </svg>
  );
}

export default function RotatePdfTool() {
  const [file, setFile]             = useState(null);
  const [numPages, setNumPages]     = useState(0);
  const [thumbnails, setThumbnails] = useState([]);
  const [rotations, setRotations]   = useState([]); // per-page delta (0, 90, 180, 270)
  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving]     = useState(false);
  const [error, setError]           = useState(null);
  const fileInputRef = useRef(null);

  const loadFile = useCallback(async (f) => {
    if (!f) return;
    if (f.type !== 'application/pdf') { setError('Please upload a PDF file.'); return; }
    setError(null);
    setFile(f);
    setThumbnails([]);

    try {
      const buffer = await f.arrayBuffer();
      const pdf    = await pdfjsLib.getDocument({ data: buffer }).promise;
      const n      = pdf.numPages;
      setNumPages(n);
      setRotations(Array(n).fill(0));

      for (let i = 1; i <= n; i++) {
        const dataUrl = await renderThumbnail(pdf, i);
        setThumbnails(prev => [...prev, dataUrl]);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load PDF. Please try another file.');
      setFile(null);
    }
  }, []);

  const rotate = (index, delta) => {
    setRotations(prev => {
      const next = [...prev];
      next[index] = ((next[index] + delta) + 360) % 360;
      return next;
    });
  };

  const rotateAll = (delta) => {
    setRotations(prev => prev.map(r => ((r + delta) + 360) % 360));
  };

  const resetAll = () => setRotations(Array(numPages).fill(0));

  const hasChanges = rotations.some(r => r !== 0);

  const save = async () => {
    if (!file || isSaving) return;
    setIsSaving(true);
    setError(null);
    try {
      const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
      pdfDoc.getPages().forEach((page, i) => {
        if (rotations[i] !== 0) {
          const existing = page.getRotation().angle;
          page.setRotation(degrees((existing + rotations[i] + 360) % 360));
        }
      });
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `rotated-${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError('Failed to save PDF. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const reset = () => { setFile(null); setThumbnails([]); setNumPages(0); setRotations([]); setError(null); };

  const onDragOver  = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = (e) => { if (!e.currentTarget.contains(e.relatedTarget)) setIsDragging(false); };
  const onDrop      = (e) => { e.preventDefault(); setIsDragging(false); loadFile(e.dataTransfer.files[0]); };

  const isRendering = file && thumbnails.length < numPages;

  // ── Upload zone ──────────────────────────────────────────────────────────────
  if (!file) {
    return (
      <div className="max-w-lg mx-auto w-full px-4 sm:px-6">
        <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" className="hidden"
          onChange={e => { loadFile(e.target.files[0]); e.target.value = ''; }} />
        <>
          <div onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
            className={`rounded-2xl border-2 border-dashed p-12 text-center transition-all ${
              isDragging ? 'border-teal-400 bg-teal-50' : 'border-gray-200 bg-white hover:border-gray-300'
            }`}>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors ${isDragging ? 'bg-teal-100' : 'bg-gray-100'}`}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={isDragging ? '#0d9488' : '#9ca3af'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.5 2v6h-6"/><path d="M21.34 15.57a10 10 0 1 1-.57-8.38"/>
              </svg>
            </div>
            <p className="text-gray-700 font-medium mb-1">
              {isDragging ? 'Drop your PDF here' : 'Drag & drop your PDF here'}
            </p>
            <p className="text-gray-400 text-sm mb-6">or</p>
            <button onClick={() => fileInputRef.current?.click()}
              className="bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all">
              Choose PDF
            </button>
          </div>
          {error && <p className="mt-3 text-sm text-red-600 text-center">{error}</p>}
          <p className="text-center text-xs text-gray-400 mt-4">Only PDF files are supported</p>
        </>
      </div>
    );
  }

  // ── Rotate UI ────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-lg mx-auto w-full px-4 sm:px-6">

      {/* File header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 min-w-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <span className="text-sm font-medium text-gray-700 truncate">{file.name}</span>
          {numPages > 0 && <span className="text-xs text-gray-400 shrink-0">· {numPages} pages</span>}
        </div>
        <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-600 transition-colors shrink-0 ml-2">
          Change file
        </button>
      </div>

      {/* Rotate all controls */}
      {numPages > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm mb-4 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-gray-500 mr-1">Rotate all:</span>
          <button onClick={() => rotateAll(-90)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <IconRotateLeft /> Left
          </button>
          <button onClick={() => rotateAll(90)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <IconRotateRight /> Right
          </button>
          {hasChanges && (
            <button onClick={resetAll}
              className="ml-auto text-xs text-gray-400 hover:text-gray-600 transition-colors">
              Reset all
            </button>
          )}
        </div>
      )}

      {/* Page grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-5">
        {thumbnails.map((dataUrl, i) => {
          const rot     = rotations[i] ?? 0;
          const isOdd   = rot % 180 !== 0;
          const scale   = isOdd ? 0.75 : 1;
          return (
            <div key={i} className="flex flex-col items-center gap-1.5">
              {/* Thumbnail */}
              <div className="w-full aspect-[3/4] rounded-xl border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">
                <img
                  src={dataUrl}
                  alt={`Page ${i + 1}`}
                  className="w-full h-full object-contain transition-transform duration-200"
                  style={{ transform: `rotate(${rot}deg) scale(${scale})` }}
                />
              </div>
              {/* Page number */}
              <span className="text-xs text-gray-400">{i + 1}</span>
              {/* Rotate buttons */}
              <div className="flex gap-1">
                <button onClick={() => rotate(i, -90)} title="Rotate left"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-teal-50 hover:text-teal-600 border border-gray-200 transition-colors">
                  <IconRotateLeft />
                </button>
                <button onClick={() => rotate(i, 90)} title="Rotate right"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-teal-50 hover:text-teal-600 border border-gray-200 transition-colors">
                  <IconRotateRight />
                </button>
              </div>
            </div>
          );
        })}

        {/* Placeholder spinners */}
        {isRendering && Array.from({ length: numPages - thumbnails.length }).map((_, i) => (
          <div key={`ph-${i}`} className="flex flex-col items-center gap-1.5">
            <div className="w-full aspect-[3/4] rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-gray-200 border-t-teal-500 rounded-full animate-spin" />
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">{error}</div>
      )}

      {/* Save button */}
      <button onClick={save}
        disabled={isSaving || isRendering || !hasChanges}
        className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-base transition-all active:scale-95 flex items-center justify-center gap-2">
        {isSaving ? (
          <>
            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Saving…
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Apply &amp; Download
          </>
        )}
      </button>
      {!hasChanges && numPages > 0 && !isRendering && (
        <p className="text-center text-xs text-gray-400 mt-2">Rotate at least one page to enable download</p>
      )}
      {isRendering && (
        <p className="text-center text-xs text-gray-400 mt-2">Loading thumbnails… {thumbnails.length} of {numPages}</p>
      )}
    </div>
  );
}
