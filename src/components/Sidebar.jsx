const PRESET_COLORS = ['#1a1a1a', '#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#ffffff'];

export default function Sidebar({ selectedTool, onToolChange, selectedBox, onUpdateBox, onDeleteBox }) {
  return (
    <div className="flex shrink-0">
      {/* Icon toolbar */}
      <div className="w-14 bg-white border-r border-gray-200 flex flex-col items-center py-3 gap-1 shadow-sm">
        {/* Select tool */}
        <button
          onClick={() => onToolChange('select')}
          title="Select (V)"
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
            selectedTool === 'select'
              ? 'bg-blue-100 text-blue-600 shadow-sm'
              : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={selectedTool === 'select' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 3l14 9-7 1-4 7L5 3z"/>
          </svg>
        </button>

        {/* Text tool */}
        <button
          onClick={() => onToolChange('text')}
          title="Add Text (T)"
          className={`w-9 h-9 rounded-xl flex items-center justify-center text-base font-bold transition-all ${
            selectedTool === 'text'
              ? 'bg-blue-100 text-blue-600 shadow-sm'
              : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
          }`}
        >
          T
        </button>

        {selectedTool === 'text' && (
          <div className="mt-1 w-8 h-0.5 bg-blue-400 rounded-full" />
        )}
      </div>

      {/* Settings panel — visible when a text box is selected */}
      {selectedBox && (
        <div className="w-52 bg-white border-r border-gray-200 flex flex-col p-4 gap-4 overflow-y-auto shadow-sm">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Text Settings</h3>

          {/* Font size */}
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1.5">Font Size (pt)</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdateBox(selectedBox.id, { fontSize: Math.max(6, selectedBox.fontSize - 1) })}
                className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 active:scale-95 transition-all text-sm font-bold"
              >−</button>
              <input
                type="number"
                min="6"
                max="144"
                value={selectedBox.fontSize}
                onChange={e => {
                  const v = Math.min(144, Math.max(6, Number(e.target.value)));
                  onUpdateBox(selectedBox.id, { fontSize: v });
                }}
                className="flex-1 border border-gray-200 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
              <button
                onClick={() => onUpdateBox(selectedBox.id, { fontSize: Math.min(144, selectedBox.fontSize + 1) })}
                className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 active:scale-95 transition-all text-sm font-bold"
              >+</button>
            </div>
          </div>

          {/* Style: Bold */}
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1.5">Style</label>
            <button
              onClick={() => onUpdateBox(selectedBox.id, { bold: !selectedBox.bold })}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-all ${
                selectedBox.bold
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              B
            </button>
          </div>

          {/* Color presets */}
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1.5">Color</label>
            <div className="grid grid-cols-4 gap-1.5 mb-2">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => onUpdateBox(selectedBox.id, { color: c })}
                  title={c}
                  className={`w-8 h-8 rounded-lg border-2 transition-all ${
                    selectedBox.color === c ? 'border-blue-500 scale-110 shadow-sm' : 'border-gray-200 hover:scale-105'
                  }`}
                  style={{ background: c }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={selectedBox.color}
                onChange={e => onUpdateBox(selectedBox.id, { color: e.target.value })}
                className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200 p-0.5"
              />
              <span className="text-xs text-gray-500 font-mono">{selectedBox.color}</span>
            </div>
          </div>

          {/* Delete */}
          <button
            onClick={() => onDeleteBox(selectedBox.id)}
            className="flex items-center justify-center gap-2 w-full bg-red-50 text-red-600 px-3 py-2 rounded-xl text-sm hover:bg-red-100 active:scale-95 transition-all font-medium mt-auto"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14H6L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4h6v2"/>
            </svg>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
