import { useRef, useCallback } from 'react';
import ResizeHandles from './ResizeHandles';

export default function ImageOverlay({ image, isSelected, onSelect, onUpdate, totalScale }) {
  const dragState = useRef(null);

  const left   = image.x * totalScale;
  const top    = image.y * totalScale;
  const width  = image.width  * totalScale;
  const height = image.height * totalScale;

  const startDrag = useCallback((clientX, clientY) => {
    dragState.current = {
      startX: clientX, startY: clientY,
      startImgX: image.x, startImgY: image.y,
    };

    const move = (cx, cy) => {
      if (!dragState.current) return;
      onUpdate(image.id, {
        x: Math.max(0, dragState.current.startImgX + (cx - dragState.current.startX) / totalScale),
        y: Math.max(0, dragState.current.startImgY + (cy - dragState.current.startY) / totalScale),
      });
    };

    const onMove  = e => move(e.clientX, e.clientY);
    const onTouch = e => { e.preventDefault(); move(e.touches[0].clientX, e.touches[0].clientY); };
    const end = () => {
      dragState.current = null;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', end);
      document.removeEventListener('touchmove', onTouch);
      document.removeEventListener('touchend', end);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', end);
    document.addEventListener('touchmove', onTouch, { passive: false });
    document.addEventListener('touchend', end);
  }, [image.id, image.x, image.y, totalScale, onUpdate]);

  const handleMouseDown = useCallback(e => {
    e.preventDefault(); e.stopPropagation(); onSelect(); startDrag(e.clientX, e.clientY);
  }, [startDrag, onSelect]);

  const handleTouchStart = useCallback(e => {
    e.stopPropagation(); onSelect(); startDrag(e.touches[0].clientX, e.touches[0].clientY);
  }, [startDrag, onSelect]);

  return (
    <div
      style={{ position: 'absolute', left, top, zIndex: isSelected ? 20 : 10 }}
      onClick={e => { e.stopPropagation(); onSelect(); }}
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
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            className="absolute -top-6 left-0 right-0 h-6 bg-blue-500 rounded-t flex items-center gap-1 px-2 cursor-grab active:cursor-grabbing select-none z-10"
            style={{ touchAction: 'none' }}
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
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            style={{ position: 'absolute', inset: 0, zIndex: 10, cursor: 'move', touchAction: 'none' }}
          />
        )}

        <img
          src={image.dataUrl}
          alt=""
          draggable={false}
          style={{ width, height, display: 'block', objectFit: 'fill', pointerEvents: 'none' }}
        />

        {/* Resize handles */}
        {isSelected && <ResizeHandles el={image} totalScale={totalScale} onUpdate={onUpdate} />}
      </div>
    </div>
  );
}
