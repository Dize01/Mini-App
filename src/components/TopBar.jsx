import { downloadPDF } from '../utils/pdfUtils';

const ZOOM_LEVELS = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

export default function TopBar({ fileName, zoom, onZoomChange, file, textBoxes, pageInfo, onReset }) {
  const zoomIdx = ZOOM_LEVELS.indexOf(zoom);

  const handleDownload = async () => {
    if (!pageInfo) return;
    try {
      await downloadPDF(file, textBoxes, pageInfo);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-between px-4 h-12 bg-white border-b border-gray-200 shrink-0 shadow-sm z-10">
      {/* Left: back + file name */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onReset}
          title="Upload new file"
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
        <span className="text-sm font-medium text-gray-700 truncate max-w-[240px]">{fileName}</span>
      </div>

      {/* Center: zoom controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onZoomChange(ZOOM_LEVELS[Math.max(0, zoomIdx - 1)])}
          disabled={zoomIdx === 0}
          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
        <span className="text-xs text-gray-600 w-10 text-center font-medium tabular-nums">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => onZoomChange(ZOOM_LEVELS[Math.min(ZOOM_LEVELS.length - 1, zoomIdx + 1)])}
          disabled={zoomIdx === ZOOM_LEVELS.length - 1}
          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      </div>

      {/* Right: download */}
      <button
        onClick={handleDownload}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 active:scale-95 transition-all text-sm font-semibold"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Download PDF
      </button>
    </div>
  );
}
