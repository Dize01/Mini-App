import { useRef, useEffect, useCallback } from 'react';

export default function TextBox({ box, isSelected, onSelect, onUpdate, totalScale }) {
  const editorRef = useRef(null);
  const isEditingRef = useRef(false);
  const dragState = useRef(null);

  const left = box.x * totalScale;
  const top = box.y * totalScale;
  const fontSize = box.fontSize * totalScale;

  // Sync DOM content from state (only when not actively editing)
  useEffect(() => {
    const el = editorRef.current;
    if (!el || isEditingRef.current) return;
    if (el.innerText !== box.text) {
      el.innerText = box.text;
    }
  }, [box.text]);

  // Auto-focus and select-all when box is first selected
  useEffect(() => {
    if (!isSelected || !editorRef.current) return;
    const el = editorRef.current;
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }, [isSelected]);

  const handleInput = useCallback(() => {
    onUpdate(box.id, { text: editorRef.current?.innerText ?? '' });
  }, [box.id, onUpdate]);

  const handleDragMouseDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect();

    dragState.current = {
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startBoxX: box.x,
      startBoxY: box.y,
    };

    const onMouseMove = (e) => {
      if (!dragState.current) return;
      const dx = (e.clientX - dragState.current.startMouseX) / totalScale;
      const dy = (e.clientY - dragState.current.startMouseY) / totalScale;
      onUpdate(box.id, {
        x: Math.max(0, dragState.current.startBoxX + dx),
        y: Math.max(0, dragState.current.startBoxY + dy),
      });
    };

    const onMouseUp = () => {
      dragState.current = null;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [box.id, box.x, box.y, totalScale, onSelect, onUpdate]);

  return (
    <div
      style={{ position: 'absolute', left, top, zIndex: isSelected ? 20 : 10 }}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
    >
      {/* Selection ring */}
      <div
        className={`relative transition-shadow ${
          isSelected ? 'ring-2 ring-blue-500' : 'ring-1 ring-transparent hover:ring-blue-200'
        }`}
        style={{ borderRadius: 3 }}
      >
        {/* Drag handle — top bar when selected */}
        {isSelected && (
          <div
            onMouseDown={handleDragMouseDown}
            className="absolute -top-6 left-0 right-0 h-6 bg-blue-500 rounded-t-md flex items-center gap-1 px-2 cursor-grab active:cursor-grabbing select-none z-10"
          >
            <svg width="8" height="12" viewBox="0 0 8 12" fill="rgba(255,255,255,0.8)">
              <circle cx="2" cy="2" r="1.5"/><circle cx="6" cy="2" r="1.5"/>
              <circle cx="2" cy="6" r="1.5"/><circle cx="6" cy="6" r="1.5"/>
              <circle cx="2" cy="10" r="1.5"/><circle cx="6" cy="10" r="1.5"/>
            </svg>
            <span className="text-white text-[9px] font-medium select-none opacity-80">Move</span>
          </div>
        )}

        {/* Invisible drag overlay for unselected boxes */}
        {!isSelected && (
          <div
            onMouseDown={handleDragMouseDown}
            className="absolute inset-0 z-10 cursor-move"
          />
        )}

        {/* Editable content */}
        <div
          ref={editorRef}
          contentEditable={isSelected}
          suppressContentEditableWarning
          onInput={handleInput}
          onFocus={() => { isEditingRef.current = true; }}
          onBlur={() => { isEditingRef.current = false; }}
          onMouseDown={(e) => { if (isSelected) e.stopPropagation(); }}
          onKeyDown={(e) => e.stopPropagation()}
          style={{
            fontSize: `${fontSize}px`,
            color: box.color,
            fontWeight: box.bold ? 'bold' : 'normal',
            fontFamily: 'Arial, Helvetica, sans-serif',
            lineHeight: 1.25,
            minWidth: '3ch',
            display: 'inline-block',
            background: isSelected ? 'rgba(239,246,255,0.55)' : 'transparent',
            outline: 'none',
            padding: '2px 4px',
            cursor: isSelected ? 'text' : 'move',
            userSelect: isSelected ? 'text' : 'none',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            textShadow: !isSelected ? '0 0 3px rgba(255,255,255,0.7)' : 'none',
          }}
        />
      </div>
    </div>
  );
}
