import { useState, useRef, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';

let nextId = 1;

const PAGE_SIZES = {
  A4:     [595, 842],
  Letter: [612, 792],
};

const MARGINS = { None: 0, Small: 20, Medium: 40, Large: 72 };

function isImage(file) {
  return ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type);
}

async function fileToDataUrl(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload  = e => res(e.target.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

async function getEmbedBytes(file) {
  if (file.type === 'image/webp') {
    const dataUrl = await fileToDataUrl(file);
    const img = new window.Image();
    img.src = dataUrl;
    await new Promise(res => { img.onload = res; });
    const canvas = document.createElement('canvas');
    canvas.width  = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.getContext('2d').drawImage(img, 0, 0);
    const pngUrl = canvas.toDataURL('image/png');
    const bin = atob(pngUrl.split(',')[1]);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return { bytes, type: 'image/png' };
  }
  return { bytes: new Uint8Array(await file.arrayBuffer()), type: file.type };
}

// ── Image card ────────────────────────────────────────────────────────────────

function ImageCard({ item, index, total, onMoveUp, onMoveDown, onRemove }) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
      <div className="w-12 h-16 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
        <img src={item.dataUrl} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold text-gray-400 mb-0.5">#{index + 1}</div>
        <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
      </div>
      <div className="flex items-center gap-0.5 shrink-0">
        <button onClick={onMoveUp} disabled={index === 0} title="Move up"
          className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-25 disabled:cursor-not-allowed transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
        </button>
        <button onClick={onMoveDown} disabled={index === total - 1} title="Move down"
          className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-25 disabled:cursor-not-allowed transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <button onClick={onRemove} title="Remove"
          className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </div>
  );
}

// ── Settings row ─────────────────────────────────────────────────────────────

function OptionGroup({ label, options, value, onChange }) {
  return (
    <div>
      <p className="text-xs text-gray-500 font-medium mb-1.5">{label}</p>
      <div className="flex gap-1.5 flex-wrap">
        {options.map(opt => (
          <button key={opt} onClick={() => onChange(opt)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              value === opt
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function JpgToPdfTool() {
  const [images, setImages]           = useState([]);
  const [isDragging, setIsDragging]   = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError]             = useState(null);
  const [pageSize, setPageSize]       = useState('A4');
  const [orientation, setOrientation] = useState('Portrait');
  const [margin, setMargin]           = useState('Medium');
  const fileInputRef = useRef(null);

  const addFiles = useCallback(async (rawFiles) => {
    const valid = Array.from(rawFiles).filter(isImage);
    if (!valid.length) return;
    setError(null);
    const newItems = await Promise.all(valid.map(async file => ({
      id: String(nextId++),
      file,
      name: file.name,
      dataUrl: await fileToDataUrl(file),
    })));
    setImages(prev => [...prev, ...newItems]);
  }, []);

  const moveUp = useCallback((index) => {
    setImages(prev => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  }, []);

  const moveDown = useCallback((index) => {
    setImages(prev => {
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  }, []);

  const removeImage = useCallback((id) => {
    setImages(prev => prev.filter(i => i.id !== id));
  }, []);

  const convert = async () => {
    if (!images.length || isConverting) return;
    setIsConverting(true);
    setError(null);
    try {
      const pdfDoc = await PDFDocument.create();
      const [baseW, baseH] = PAGE_SIZES[pageSize];
      const [pw, ph] = orientation === 'Landscape' ? [baseH, baseW] : [baseW, baseH];
      const m = MARGINS[margin];

      for (const item of images) {
        const { bytes, type } = await getEmbedBytes(item.file);
        const embedded = type === 'image/png'
          ? await pdfDoc.embedPng(bytes)
          : await pdfDoc.embedJpg(bytes);

        const availW = pw - m * 2;
        const availH = ph - m * 2;
        const scale  = Math.min(availW / embedded.width, availH / embedded.height);
        const drawW  = embedded.width  * scale;
        const drawH  = embedded.height * scale;
        const x = m + (availW - drawW) / 2;
        const y = m + (availH - drawH) / 2;

        const page = pdfDoc.addPage([pw, ph]);
        page.drawImage(embedded, { x, y, width: drawW, height: drawH });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = 'converted.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError('Failed to convert images. Please check your files and try again.');
    } finally {
      setIsConverting(false);
    }
  };

  const onDragOver  = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = (e) => { if (!e.currentTarget.contains(e.relatedTarget)) setIsDragging(false); };
  const onDrop      = (e) => { e.preventDefault(); setIsDragging(false); addFiles(e.dataTransfer.files); };

  const isEmpty = images.length === 0;

  return (
    <div className="max-w-lg mx-auto w-full px-4 sm:px-6">
      <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp"
        multiple className="hidden"
        onChange={e => { addFiles(e.target.files); e.target.value = ''; }} />

      {isEmpty ? (
        <>
          <div onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
            className={`rounded-2xl border-2 border-dashed p-12 text-center transition-all ${
              isDragging ? 'border-orange-400 bg-orange-50' : 'border-gray-200 bg-white hover:border-gray-300'
            }`}>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors ${isDragging ? 'bg-orange-100' : 'bg-gray-100'}`}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={isDragging ? '#f97316' : '#9ca3af'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
            <p className="text-gray-700 font-medium mb-1">
              {isDragging ? 'Drop images here' : 'Drag & drop images here'}
            </p>
            <p className="text-gray-400 text-sm mb-6">or</p>
            <button onClick={() => fileInputRef.current?.click()}
              className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all">
              Choose Images
            </button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-4">Supports JPG, PNG, and WebP</p>
        </>
      ) : (
        <div>
          {/* Settings */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm mb-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <OptionGroup label="Page Size"    options={['A4', 'Letter']}                        value={pageSize}     onChange={setPageSize} />
              <OptionGroup label="Orientation"  options={['Portrait', 'Landscape']}               value={orientation}  onChange={setOrientation} />
              <OptionGroup label="Margin"       options={['None', 'Small', 'Medium', 'Large']}    value={margin}       onChange={setMargin} />
            </div>
          </div>

          {/* Header row */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-500">{images.length} image{images.length !== 1 ? 's' : ''} selected</p>
            <button onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 text-sm text-orange-500 hover:text-orange-600 font-semibold transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add more
            </button>
          </div>

          {/* Image list */}
          <div className="space-y-2 mb-5">
            {images.map((item, index) => (
              <ImageCard key={item.id} item={item} index={index} total={images.length}
                onMoveUp={() => moveUp(index)}
                onMoveDown={() => moveDown(index)}
                onRemove={() => removeImage(item.id)} />
            ))}
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">{error}</div>
          )}

          {/* Convert button */}
          <button onClick={convert} disabled={isConverting}
            className="w-full py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-base transition-all active:scale-95 flex items-center justify-center gap-2">
            {isConverting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Converting…
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Convert &amp; Download
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
