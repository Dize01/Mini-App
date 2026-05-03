import { useState, useRef, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

let nextId = 1;

function isPDF(file) {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
}

async function generateThumbnail(file) {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 0.4 });
  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
  return canvas.toDataURL();
}

// ── File card ────────────────────────────────────────────────────────────────

function FileCard({ item, index, total, onMoveUp, onMoveDown, onRemove }) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
      {/* Thumbnail */}
      <div className="w-12 h-16 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
        {item.thumbLoading ? (
          <div className="w-5 h-5 border-2 border-gray-200 border-t-green-500 rounded-full animate-spin" />
        ) : item.thumbnailUrl ? (
          <img src={item.thumbnailUrl} alt="" className="w-full h-full object-contain" />
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
        )}
      </div>

      {/* Name + order */}
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold text-gray-400 mb-0.5">#{index + 1}</div>
        <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-0.5 shrink-0">
        <button
          onClick={onMoveUp}
          disabled={index === 0}
          title="Move up"
          className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15"/>
          </svg>
        </button>
        <button
          onClick={onMoveDown}
          disabled={index === total - 1}
          title="Move down"
          className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
        <button
          onClick={onRemove}
          title="Remove"
          className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function MergeTool() {
  const [files, setFiles]         = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isMerging, setIsMerging] = useState(false);
  const [error, setError]         = useState(null);
  const fileInputRef = useRef(null);

  const addFiles = useCallback(async (rawFiles) => {
    const valid = Array.from(rawFiles).filter(isPDF);
    if (!valid.length) return;

    const newItems = valid.map(file => ({
      id: String(nextId++),
      file,
      name: file.name,
      thumbnailUrl: null,
      thumbLoading: true,
    }));

    setFiles(prev => [...prev, ...newItems]);
    setError(null);

    for (const item of newItems) {
      try {
        const url = await generateThumbnail(item.file);
        setFiles(prev => prev.map(f => f.id === item.id ? { ...f, thumbnailUrl: url, thumbLoading: false } : f));
      } catch {
        setFiles(prev => prev.map(f => f.id === item.id ? { ...f, thumbLoading: false } : f));
      }
    }
  }, []);

  const moveUp = useCallback((index) => {
    setFiles(prev => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  }, []);

  const moveDown = useCallback((index) => {
    setFiles(prev => {
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  }, []);

  const removeFile = useCallback((id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const mergePDFs = async () => {
    if (files.length < 2 || isMerging) return;
    setIsMerging(true);
    setError(null);
    try {
      const merged = await PDFDocument.create();
      for (const item of files) {
        const bytes = await item.file.arrayBuffer();
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach(p => merged.addPage(p));
      }
      const pdfBytes = await merged.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError('Failed to merge PDFs. Make sure all files are valid, unencrypted PDFs and try again.');
    } finally {
      setIsMerging(false);
    }
  };

  const onDragOver  = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = (e) => { if (!e.currentTarget.contains(e.relatedTarget)) setIsDragging(false); };
  const onDrop      = (e) => { e.preventDefault(); setIsDragging(false); addFiles(e.dataTransfer.files); };

  const isEmpty = files.length === 0;

  return (
    <div className="max-w-lg mx-auto w-full px-4 sm:px-6">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        multiple
        className="hidden"
        onChange={e => { addFiles(e.target.files); e.target.value = ''; }}
      />

      {isEmpty ? (
        <>
        {/* ── Drop zone ── */}
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`rounded-2xl border-2 border-dashed p-12 text-center transition-colors ${
            isDragging ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 6H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3"/>
              <polyline points="15 3 12 6 9 3"/>
              <line x1="12" y1="6" x2="12" y2="14"/>
            </svg>
          </div>
          <p className="text-gray-600 font-medium mb-1">Drag &amp; drop PDF files here</p>
          <p className="text-gray-400 text-sm mb-6">or</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-green-600 hover:bg-green-700 active:scale-95 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all"
          >
            Choose PDF Files
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">Only PDF files are supported</p>
        </>
      ) : (
        /* ── File list ── */
        <div>
          {/* Header row */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-500">
              {files.length} file{files.length !== 1 ? 's' : ''} selected
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 text-sm text-green-600 hover:text-green-700 font-semibold transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add more
            </button>
          </div>

          {/* Cards */}
          <div className="space-y-2 mb-5">
            {files.map((item, index) => (
              <FileCard
                key={item.id}
                item={item}
                index={index}
                total={files.length}
                onMoveUp={() => moveUp(index)}
                onMoveDown={() => moveDown(index)}
                onRemove={() => removeFile(item.id)}
              />
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
              {error}
            </div>
          )}

          {/* Merge button */}
          <button
            onClick={mergePDFs}
            disabled={files.length < 2 || isMerging}
            className="w-full py-3.5 rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-base transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {isMerging ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Merging…
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Merge &amp; Download
              </>
            )}
          </button>

          {files.length < 2 && (
            <p className="text-center text-xs text-gray-400 mt-2">Add at least 2 PDF files to merge</p>
          )}
          <p className="text-center text-xs text-gray-400 mt-3 leading-relaxed">
            Note: Merged files may be larger than the originals due to how PDFs are processed.
          </p>
        </div>
      )}
    </div>
  );
}
