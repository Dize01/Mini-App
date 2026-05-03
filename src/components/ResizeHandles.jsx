import { useCallback } from 'react';

const MIN_SIZE = 10;

const CORNERS = [
  { id: 'nw', style: { top: 0,    left:  0   }, transform: 'translate(-50%, -50%)', cursor: 'nw-resize' },
  { id: 'ne', style: { top: 0,    right: 0   }, transform: 'translate(50%, -50%)',  cursor: 'ne-resize' },
  { id: 'se', style: { bottom: 0, right: 0   }, transform: 'translate(50%, 50%)',   cursor: 'se-resize' },
  { id: 'sw', style: { bottom: 0, left:  0   }, transform: 'translate(-50%, 50%)',  cursor: 'sw-resize' },
];

function calcUpdates(corner, start, dx, dy) {
  const { x, y, width, height } = start;
  switch (corner) {
    case 'se': return {
      width:  Math.max(MIN_SIZE, width  + dx),
      height: Math.max(MIN_SIZE, height + dy),
    };
    case 'sw': return {
      x:      x + dx,
      width:  Math.max(MIN_SIZE, width  - dx),
      height: Math.max(MIN_SIZE, height + dy),
    };
    case 'ne': return {
      y:      y + dy,
      width:  Math.max(MIN_SIZE, width  + dx),
      height: Math.max(MIN_SIZE, height - dy),
    };
    case 'nw': return {
      x:      x + dx,
      y:      y + dy,
      width:  Math.max(MIN_SIZE, width  - dx),
      height: Math.max(MIN_SIZE, height - dy),
    };
    default: return {};
  }
}

export default function ResizeHandles({ el, totalScale, onUpdate }) {
  const startDrag = useCallback((corner, clientX, clientY) => {
    const start = { x: el.x, y: el.y, width: el.width, height: el.height };
    const ox = clientX, oy = clientY;

    const move = (cx, cy) => {
      const dx = (cx - ox) / totalScale;
      const dy = (cy - oy) / totalScale;
      onUpdate(el.id, calcUpdates(corner, start, dx, dy));
    };

    const onMove  = e => move(e.clientX, e.clientY);
    const onTouch = e => { e.preventDefault(); move(e.touches[0].clientX, e.touches[0].clientY); };
    const end = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', end);
      document.removeEventListener('touchmove', onTouch);
      document.removeEventListener('touchend', end);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', end);
    document.addEventListener('touchmove', onTouch, { passive: false });
    document.addEventListener('touchend', end);
  }, [el, totalScale, onUpdate]);

  return (
    <>
      {CORNERS.map(({ id, style, transform, cursor }) => (
        <div
          key={id}
          onMouseDown={e => { e.preventDefault(); e.stopPropagation(); startDrag(id, e.clientX, e.clientY); }}
          onTouchStart={e => { e.stopPropagation(); startDrag(id, e.touches[0].clientX, e.touches[0].clientY); }}
          style={{
            position: 'absolute',
            width: 10,
            height: 10,
            background: 'white',
            border: '2px solid #3b82f6',
            borderRadius: 2,
            cursor,
            touchAction: 'none',
            zIndex: 30,
            transform,
            ...style,
          }}
        />
      ))}
    </>
  );
}
