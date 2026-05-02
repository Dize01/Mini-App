import { useRef, useCallback } from 'react';

export default function Shape({ shape, isSelected, onSelect, onUpdate, totalScale }) {
  const dragState = useRef(null);

  const left   = shape.x * totalScale;
  const top    = shape.y * totalScale;
  const width  = shape.width  * totalScale;
  const height = shape.height * totalScale;
  const borderPx = Math.max(0, shape.borderWidth) * totalScale;
  const isCircle = shape.shapeType === 'circle';

  const handleDragMouseDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect();

    dragState.current = {
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startX: shape.x,
      startY: shape.y,
    };

    const onMouseMove = (ev) => {
      if (!dragState.current) return;
      const dx = (ev.clientX - dragState.current.startMouseX) / totalScale;
      const dy = (ev.clientY - dragState.current.startMouseY) / totalScale;
      onUpdate(shape.id, {
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
  }, [shape.id, shape.x, shape.y, totalScale, onSelect, onUpdate]);

  const radius = isCircle ? '50%' : 3;

  return (
    <div
      style={{ position: 'absolute', left, top, zIndex: isSelected ? 20 : 10 }}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
    >
      <div
        className={isSelected
          ? 'ring-2 ring-blue-500 ring-offset-0'
          : 'ring-1 ring-transparent hover:ring-blue-200'}
        style={{ borderRadius: radius, position: 'relative' }}
      >
        {/* Drag handle bar when selected */}
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

        {/* Invisible drag overlay when not selected */}
        {!isSelected && (
          <div
            onMouseDown={handleDragMouseDown}
            style={{ position: 'absolute', inset: 0, zIndex: 10, borderRadius: radius, cursor: 'move' }}
          />
        )}

        {/* The shape itself */}
        <div
          style={{
            width,
            height,
            background: shape.fillColor === 'none' ? 'transparent' : shape.fillColor,
            border: borderPx > 0 ? `${borderPx}px solid ${shape.borderColor}` : 'none',
            borderRadius: radius,
            boxSizing: 'border-box',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
}
