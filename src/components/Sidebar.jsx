const PRESET_COLORS = ['#1a1a1a','#ef4444','#3b82f6','#22c55e','#f59e0b','#8b5cf6','#ec4899','#ffffff'];

function ColorRow({ label, value, onChange, allowNone }) {
  return (
    <div>
      <label className="text-xs text-gray-500 font-medium block mb-1.5">{label}</label>
      <div className="flex items-center gap-2 flex-wrap">
        {allowNone && (
          <button
            onClick={() => onChange('none')}
            title="No fill"
            className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${
              value === 'none' ? 'border-blue-500 scale-110' : 'border-gray-200 hover:scale-105'
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 14 14">
              <line x1="1" y1="13" x2="13" y2="1" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
              <rect x="1" y="1" width="12" height="12" rx="2" stroke="#d1d5db" strokeWidth="1.5" fill="none"/>
            </svg>
          </button>
        )}
        {PRESET_COLORS.map(c => (
          <button
            key={c}
            onClick={() => onChange(c)}
            title={c}
            className={`w-6 h-6 rounded-md border-2 transition-all ${
              value === c ? 'border-blue-500 scale-110 shadow-sm' : 'border-gray-200 hover:scale-105'
            }`}
            style={{ background: c }}
          />
        ))}
        <input
          type="color"
          value={value === 'none' ? '#ffffff' : value}
          onChange={e => onChange(e.target.value)}
          className="w-7 h-7 rounded-lg cursor-pointer border border-gray-200 p-0.5"
        />
      </div>
    </div>
  );
}

export default function Sidebar({
  selectedTool, onToolChange,
  activeShapeType, onShapeTypeChange,
  selectedBox, selectedShape,
  onUpdateBox, onDeleteBox,
  onUpdateShape, onDeleteShape,
}) {
  const hasPanel = selectedBox || selectedShape;

  return (
    <div className="flex shrink-0">
      {/* Icon toolbar */}
      <div className="w-14 bg-white border-r border-gray-200 flex flex-col items-center py-3 gap-1 shadow-sm">
        {/* Select */}
        <ToolBtn active={selectedTool === 'select'} onClick={() => onToolChange('select')} title="Select">
          <svg width="15" height="15" viewBox="0 0 24 24" fill={selectedTool === 'select' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 3l14 9-7 1-4 7L5 3z"/>
          </svg>
        </ToolBtn>

        {/* Text */}
        <ToolBtn active={selectedTool === 'text'} onClick={() => onToolChange('text')} title="Add Text" className="text-base font-bold">
          T
        </ToolBtn>

        {/* Shapes */}
        <ToolBtn active={selectedTool === 'shape'} onClick={() => onToolChange('shape')} title="Add Shape">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="9"/>
          </svg>
        </ToolBtn>

        {/* Shape type sub-buttons */}
        {selectedTool === 'shape' && (
          <>
            <div className="w-8 h-px bg-gray-100 my-0.5"/>
            <button
              onClick={() => onShapeTypeChange('rect')}
              title="Rectangle"
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                activeShapeType === 'rect' ? 'bg-blue-100 ring-2 ring-blue-400' : 'hover:bg-gray-100'
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <rect x="3" y="6" width="18" height="12" rx="2"/>
              </svg>
            </button>
            <button
              onClick={() => onShapeTypeChange('circle')}
              title="Circle"
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                activeShapeType === 'circle' ? 'bg-blue-100 ring-2 ring-blue-400' : 'hover:bg-gray-100'
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="9"/>
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Settings panel */}
      {hasPanel && (
        <div className="w-56 bg-white border-r border-gray-200 flex flex-col p-4 gap-4 overflow-y-auto shadow-sm">

          {/* ── TEXT SETTINGS ── */}
          {selectedBox && (
            <>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Text</h3>

              {/* Font size */}
              <div>
                <label className="text-xs text-gray-500 font-medium block mb-1.5">Font Size (pt)</label>
                <div className="flex items-center gap-2">
                  <button onClick={() => onUpdateBox(selectedBox.id, { fontSize: Math.max(6, selectedBox.fontSize - 1) })}
                    className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 text-sm font-bold">−</button>
                  <input type="number" min="6" max="144" value={selectedBox.fontSize}
                    onChange={e => onUpdateBox(selectedBox.id, { fontSize: Math.min(144, Math.max(6, Number(e.target.value))) })}
                    className="flex-1 border border-gray-200 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                  <button onClick={() => onUpdateBox(selectedBox.id, { fontSize: Math.min(144, selectedBox.fontSize + 1) })}
                    className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 text-sm font-bold">+</button>
                </div>
              </div>

              {/* Bold */}
              <div>
                <label className="text-xs text-gray-500 font-medium block mb-1.5">Style</label>
                <button
                  onClick={() => onUpdateBox(selectedBox.id, { bold: !selectedBox.bold })}
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-all ${
                    selectedBox.bold ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >B</button>
              </div>

              {/* Color */}
              <ColorRow label="Color" value={selectedBox.color} onChange={v => onUpdateBox(selectedBox.id, { color: v })} />

              <DeleteBtn onClick={() => onDeleteBox(selectedBox.id)} />
            </>
          )}

          {/* ── SHAPE SETTINGS ── */}
          {selectedShape && (
            <>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Shape</h3>

              {/* Shape type toggle */}
              <div>
                <label className="text-xs text-gray-500 font-medium block mb-1.5">Type</label>
                <div className="flex gap-2">
                  {[['rect','▭ Rect'],['circle','○ Circle']].map(([t, label]) => (
                    <button key={t}
                      onClick={() => onUpdateShape(selectedShape.id, { shapeType: t })}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        selectedShape.shapeType === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                      }`}
                    >{label}</button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <label className="text-xs text-gray-500 font-medium block mb-1.5">Size (pt)</label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <div className="text-[10px] text-gray-400 mb-0.5">W</div>
                    <input type="number" min="10" max="800" value={Math.round(selectedShape.width)}
                      onChange={e => onUpdateShape(selectedShape.id, { width: Math.max(10, Number(e.target.value)) })}
                      className="w-full border border-gray-200 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] text-gray-400 mb-0.5">H</div>
                    <input type="number" min="10" max="800" value={Math.round(selectedShape.height)}
                      onChange={e => onUpdateShape(selectedShape.id, { height: Math.max(10, Number(e.target.value)) })}
                      className="w-full border border-gray-200 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                  </div>
                </div>
              </div>

              {/* Fill color */}
              <ColorRow label="Fill Color" value={selectedShape.fillColor}
                onChange={v => onUpdateShape(selectedShape.id, { fillColor: v })} allowNone />

              {/* Border */}
              <ColorRow label="Border Color" value={selectedShape.borderColor}
                onChange={v => onUpdateShape(selectedShape.id, { borderColor: v })} />

              <div>
                <label className="text-xs text-gray-500 font-medium block mb-1.5">
                  Border Size — {selectedShape.borderWidth} pt
                </label>
                <input type="range" min="0" max="20" step="0.5"
                  value={selectedShape.borderWidth}
                  onChange={e => onUpdateShape(selectedShape.id, { borderWidth: Number(e.target.value) })}
                  className="w-full accent-blue-500"/>
              </div>

              <DeleteBtn onClick={() => onDeleteShape(selectedShape.id)} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

function ToolBtn({ active, onClick, title, children, className = '' }) {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${className} ${
          active ? 'bg-blue-100 text-blue-600 shadow-sm' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
        }`}
      >
        {children}
      </button>
      <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 rounded-md bg-gray-800 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
        {title}
      </div>
    </div>
  );
}

function DeleteBtn({ onClick }) {
  return (
    <button onClick={onClick}
      className="flex items-center justify-center gap-2 w-full bg-red-50 text-red-600 px-3 py-2 rounded-xl text-sm hover:bg-red-100 active:scale-95 transition-all font-medium mt-auto">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6l-1 14H6L5 6"/>
        <path d="M10 11v6M14 11v6"/>
        <path d="M9 6V4h6v2"/>
      </svg>
      Delete
    </button>
  );
}
