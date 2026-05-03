import { useState, useRef, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

async function renderThumbnail(pdfDoc, pageNum) {
  const page = await pdfDoc.getPage(pageNum);
  const viewport = page.getViewport({ scale: 0.3 });
  const canvas = document.createElement('canvas');
  canvas.width  = viewport.width;
  canvas.height = viewport.height;
  await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
  return canvas.toDataURL();
}

function clamp(val, min, max) {
  return Math.min(max, Math.max(min, val));
}

export default function SplitPdfTool() {
  const [file, setFile]           = useState(null);
  const [numPages, setNumPages]   = useState(0);
  const [thumbnails, setThumbnails] = useState([]); // grows as pages render
  const [fromPage, setFromPage]   = useState(1);
  const [toPage, setToPage]       = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError]         = useState(null);
  const fileInputRef = useRef(null);

  const loadFile = useCallback(async (f) => {
    if (!f) return;
    if (f.type !== 'application/pdf') { setError('Please upload a PDF file.'); return; }
    setError(null);
    setFile(f);
    setThumbnails([]);

    try {
      const buffer = await f.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      const n = pdf.numPages;
      setNumPages(n);
      setFromPage(1);
      setToPage(n);

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

  const handleFromChange = (val) => {
    const v = clamp(Number(val), 1, numPages);
    setFromPage(v);
    if (v > toPage) setToPage(v);
  };

  const handleToChange = (val) => {
    const v = clamp(Number(val), 1, numPages);
    setToPage(v);
    if (v < fromPage) setFromPage(v);
  };

  const extract = async () => {
    if (!file || isExtracting) return;
    setIsExtracting(true);
    setError(null);
    try {
      const bytes  = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(bytes);
      const newDoc = await PDFDocument.create();
      const indices = Array.from({ length: toPage - fromPage + 1 }, (_, i) => fromPage - 1 + i);
      const pages  = await newDoc.copyPages(srcDoc, indices);
      pages.forEach(p => newDoc.addPage(p));
      const pdfBytes = await newDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `pages-${fromPage}-to-${toPage}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError('Failed to extract pages. Please try again.');
    } finally {
      setIsExtracting(false);
    }
  };

  const reset = () => { setFile(null); setThumbnails([]); setNumPages(0); setError(null); };

  const onDragOver  = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = (e) => { if (!e.currentTarget.contains(e.relatedTarget)) setIsDragging(false); };
  const onDrop      = (e) => { e.preventDefault(); setIsDragging(false); loadFile(e.dataTransfer.files[0]); };

  const selectedCount = toPage - fromPage + 1;
  const isRendering   = file && thumbnails.length < numPages;

  // ── Upload zone ─────────────────────────────────────────────────────────────
  if (!file) {
    return (
      <div className="max-w-lg mx-auto w-full px-4 sm:px-6">
        <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" className="hidden"
          onChange={e => { loadFile(e.target.files[0]); e.target.value = ''; }} />
        <>
          <div onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
            className={`rounded-2xl border-2 border-dashed p-12 text-center transition-all ${
              isDragging ? 'border-rose-400 bg-rose-50' : 'border-gray-200 bg-white hover:border-gray-300'
            }`}>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors ${isDragging ? 'bg-rose-100' : 'bg-gray-100'}`}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={isDragging ? '#f43f5e' : '#9ca3af'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="9" y1="13" x2="15" y2="13"/>
              </svg>
            </div>
            <p className="text-gray-700 font-medium mb-1">
              {isDragging ? 'Drop your PDF here' : 'Drag & drop your PDF here'}
            </p>
            <p className="text-gray-400 text-sm mb-6">or</p>
            <button onClick={() => fileInputRef.current?.click()}
              className="bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all">
              Choose PDF
            </button>
          </div>
          {error && <p className="mt-3 text-sm text-red-600 text-center">{error}</p>}
          <p className="text-center text-xs text-gray-400 mt-4">Only PDF files are supported</p>
        </>
      </div>
    );
  }

  // ── Split UI ─────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-lg mx-auto w-full px-4 sm:px-6">

      {/* File header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 min-w-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
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

      {/* Range selector */}
      {numPages > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm mb-4">
          <div className="flex items-end gap-3 flex-wrap">
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1.5">From page</label>
              <input type="number" min={1} max={numPages} value={fromPage}
                onChange={e => handleFromChange(e.target.value)}
                className="w-20 border border-gray-200 rounded-xl px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-rose-400" />
            </div>
            <div className="pb-2 text-gray-400 text-sm">to</div>
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1.5">To page</label>
              <input type="number" min={1} max={numPages} value={toPage}
                onChange={e => handleToChange(e.target.value)}
                className="w-20 border border-gray-200 rounded-xl px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-rose-400" />
            </div>
            <p className="text-sm text-gray-500 pb-2">
              <span className="font-semibold text-rose-500">{selectedCount}</span> of {numPages} pages selected
            </p>
          </div>
        </div>
      )}

      {/* Thumbnail grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-5">
        {/* Rendered thumbnails */}
        {thumbnails.map((dataUrl, i) => {
          const pageNum    = i + 1;
          const isSelected = pageNum >= fromPage && pageNum <= toPage;
          return (
            <div key={i}
              onClick={() => {
                if (pageNum < fromPage || (pageNum > fromPage && pageNum <= toPage)) {
                  handleToChange(pageNum);
                } else {
                  handleFromChange(pageNum);
                  if (pageNum > toPage) handleToChange(pageNum);
                }
              }}
              className={`rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                isSelected ? 'border-rose-400 shadow-sm' : 'border-gray-200 hover:border-gray-300'
              }`}>
              <img src={dataUrl} alt={`Page ${pageNum}`} className="w-full block" />
              <div className={`text-center py-1 text-xs font-semibold ${isSelected ? 'text-rose-500 bg-rose-50' : 'text-gray-400 bg-white'}`}>
                {pageNum}
              </div>
            </div>
          );
        })}
        {/* Placeholder spinners for pages not yet rendered */}
        {isRendering && Array.from({ length: numPages - thumbnails.length }).map((_, i) => (
          <div key={`ph-${i}`} className="rounded-xl border-2 border-gray-100 bg-gray-50 aspect-[3/4] flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-gray-200 border-t-rose-400 rounded-full animate-spin" />
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">{error}</div>
      )}

      {/* Extract button */}
      <button onClick={extract}
        disabled={isExtracting || isRendering || numPages === 0}
        className="w-full py-3.5 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-base transition-all active:scale-95 flex items-center justify-center gap-2">
        {isExtracting ? (
          <>
            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Extracting…
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Extract {selectedCount} page{selectedCount !== 1 ? 's' : ''}
          </>
        )}
      </button>
      {isRendering && (
        <p className="text-center text-xs text-gray-400 mt-2">Loading thumbnails… {thumbnails.length} of {numPages}</p>
      )}
    </div>
  );
}
