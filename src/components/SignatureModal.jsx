import { useState, useRef } from 'react';

function dataUrlToBytes(dataUrl) {
  const bin = atob(dataUrl.split(',')[1]);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

// ── Draw tab ─────────────────────────────────────────────────────────────────

function DrawTab({ onConfirm }) {
  const canvasRef  = useRef(null);
  const isDrawing  = useRef(false);
  const lastPt     = useRef(null);
  const [hasDrawn, setHasDrawn] = useState(false);

  const getPoint = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const sx = canvasRef.current.width  / rect.width;
    const sy = canvasRef.current.height / rect.height;
    return { x: (e.clientX - rect.left) * sx, y: (e.clientY - rect.top) * sy };
  };

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    isDrawing.current = true;
    lastPt.current = getPoint(e);
    setHasDrawn(true);
    const ctx = canvasRef.current.getContext('2d');
    const { x, y } = lastPt.current;
    ctx.beginPath();
    ctx.arc(x, y, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = '#1a1a1a';
    ctx.fill();
  };

  const onPointerMove = (e) => {
    if (!isDrawing.current) return;
    const ctx = canvasRef.current.getContext('2d');
    const pt  = getPoint(e);
    ctx.beginPath();
    ctx.moveTo(lastPt.current.x, lastPt.current.y);
    ctx.lineTo(pt.x, pt.y);
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth   = 2.5;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
    ctx.stroke();
    lastPt.current = pt;
  };

  const onPointerUp = () => { isDrawing.current = false; };

  const clear = () => {
    const c = canvasRef.current;
    c.getContext('2d').clearRect(0, 0, c.width, c.height);
    setHasDrawn(false);
  };

  const confirm = () => {
    const dataUrl = canvasRef.current.toDataURL('image/png');
    onConfirm({ dataUrl, bytes: dataUrlToBytes(dataUrl), mimeType: 'image/png' });
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={500}
        height={160}
        style={{ touchAction: 'none' }}
        className="w-full bg-white rounded-xl border border-gray-200 cursor-crosshair"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      />
      <p className="text-xs text-gray-400 text-center mt-2 mb-4">Draw your signature above</p>
      <div className="flex gap-2">
        <button
          onClick={clear}
          className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Clear
        </button>
        <button
          onClick={confirm}
          disabled={!hasDrawn}
          className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
        >
          Use Signature
        </button>
      </div>
    </div>
  );
}

// ── Type tab ─────────────────────────────────────────────────────────────────

function TypeTab({ onConfirm }) {
  const [text, setText] = useState('');

  const confirm = async () => {
    if (!text.trim()) return;
    await document.fonts.load('56px "Dancing Script"');
    const canvas = document.createElement('canvas');
    const ctx    = canvas.getContext('2d');
    ctx.font     = '56px "Dancing Script"';
    const metrics = ctx.measureText(text.trim());
    const pad = 24;
    canvas.width  = Math.ceil(metrics.width) + pad * 2;
    canvas.height = 80;
    ctx.font          = '56px "Dancing Script"';
    ctx.fillStyle     = '#1a1a1a';
    ctx.textBaseline  = 'middle';
    ctx.fillText(text.trim(), pad, canvas.height / 2);
    const dataUrl = canvas.toDataURL('image/png');
    onConfirm({ dataUrl, bytes: dataUrlToBytes(dataUrl), mimeType: 'image/png' });
  };

  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type your name"
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
      />
      {/* Live preview */}
      <div
        className="w-full h-24 bg-white rounded-xl border border-gray-200 flex items-center px-5 overflow-hidden mb-4"
        style={{ fontFamily: '"Dancing Script", cursive', fontSize: '3rem', color: '#1a1a1a', lineHeight: 1 }}
      >
        {text.trim()
          ? text
          : <span style={{ fontFamily: 'sans-serif', fontSize: '0.8rem', color: '#d1d5db' }}>Preview appears here</span>
        }
      </div>
      <button
        onClick={confirm}
        disabled={!text.trim()}
        className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
      >
        Use Signature
      </button>
    </div>
  );
}

// ── Upload tab ────────────────────────────────────────────────────────────────

function UploadTab({ onConfirm }) {
  const [preview, setPreview] = useState(null);
  const [sigData, setSigData] = useState(null);
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    const dataUrl = await new Promise((res, rej) => {
      const r = new FileReader();
      r.onload  = e => res(e.target.result);
      r.onerror = rej;
      r.readAsDataURL(file);
    });
    const bytes = new Uint8Array(await file.arrayBuffer());
    setPreview(dataUrl);
    setSigData({ dataUrl, bytes, mimeType: file.type });
  };

  const reset = () => {
    setPreview(null);
    setSigData(null);
    inputRef.current?.click();
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="hidden"
        onChange={e => { if (e.target.files[0]) handleFile(e.target.files[0]); e.target.value = ''; }}
      />
      {preview ? (
        <div className="w-full h-32 bg-white rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden mb-3">
          <img src={preview} alt="Signature preview" className="max-h-full max-w-full object-contain" />
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full h-32 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 hover:border-gray-300 flex flex-col items-center justify-center gap-2 transition-colors mb-3"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <span className="text-sm text-gray-500">Upload signature image</span>
          <span className="text-xs text-gray-400">PNG, JPEG, or WebP</span>
        </button>
      )}
      <div className="flex gap-2">
        {preview && (
          <button onClick={reset} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            Change
          </button>
        )}
        <button
          onClick={() => sigData && onConfirm(sigData)}
          disabled={!sigData}
          className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
        >
          Use Signature
        </button>
      </div>
    </div>
  );
}

// ── Modal shell ───────────────────────────────────────────────────────────────

const TABS = [
  { id: 'draw',   label: 'Draw'   },
  { id: 'type',   label: 'Type'   },
  { id: 'upload', label: 'Upload' },
];

export default function SignatureModal({ onClose, onConfirm }) {
  const [tab, setTab] = useState('draw');

  const handleConfirm = (sig) => {
    onConfirm(sig);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Add Signature</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-gray-100">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                tab === t.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-5">
          {tab === 'draw'   && <DrawTab   onConfirm={handleConfirm} />}
          {tab === 'type'   && <TypeTab   onConfirm={handleConfirm} />}
          {tab === 'upload' && <UploadTab onConfirm={handleConfirm} />}
        </div>

      </div>
    </div>
  );
}
