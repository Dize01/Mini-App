import { useRef, useCallback } from 'react';

export default function ImageOverlay({ image, isSelected, onSelect, onUpdate, totalScale }) {
  const dragState = useRef(null);

  const left   = image.x * totalScale;
  const top    = image.y * totalScale;
  const width  = image.width  * totalScale;
  const height = image.height * totalScale;

  const handleDragMouseDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect();

    dragState.current = {
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startX: image.x,
      startY: image.y,
    };

    const onMouseMove = (ev) => {
      if (!dragState.current) return;
      const dx = (ev.clientX - dragState.current.startMouseX) / totalScale;
      const dy = (ev.clientY - dragState.current.startMouseY) / totalScale;
      onUpdate(image.id, {
        x: Math.max(0, dragState.current.startX + dx),
        y: Math.max(0, dragState.current.startY + dy),
      });
    };

    const onMouseUp = () => {
      dragState.current = null;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [image.id, image.x, image.y, totalScale, onSelect, onUpdate]);

  return (
    <div
      style={{ position: 'absolute', left, top, zIndex: isSelected ? 20 : 10 }}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
    >
      <div
        className={isSelected
          ? 'ring-2 ring-blue-500'
          : 'ring-1 ring-transparent hover:ring-blue-200'}
        style={{ position: 'relative' }}
      >
        {/* Drag handle when selected */}
        {isSelected && (
          <div
            onMouseDown={handleDragMouseDown}
            className="absolute -top-6 left-0 right-0 h-6 bg-blue-500 rounded-t flex items-center gap-1 px-2 cursor-grab active:cursor-grabbing select-none z-10"
          >
            <svg width="8" height="12" viewBox="0 0 8 12" fill="rgba(255,255,255,0.8)">
              <circle cx="2" cy="2" r="1.5"/><circle cx="6" cy="2" r="1.5"/>
              <circle cx="2" cy="6" r="1.5"/><circle cx="6" cy="6" r="1.5"/>
              <circle cx="2" cy="10" r="1.5"/><circle cx="6" cy="10" r="1.5"/>
            </svg>
            <span className="text-white text-[9px] font-medium opacity-80 select-none">Move</span>
          </div>
        )}

        {/* Drag overlay when not selected */}
        {!isSelected && (
          <div
            onMouseDown={handleDragMouseDown}
            style={{ position: 'absolute', inset: 0, zIndex: 10, cursor: 'move' }}
          />
        )}

        <img
          src={image.dataUrl}
          alt=""
          draggable={false}
          style={{ width, height, display: 'block', objectFit: 'fill', pointerEvents: 'none' }}
        />
      </div>
    </div>
  );
}
