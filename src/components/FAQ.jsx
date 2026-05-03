import { useState } from 'react';

export default function FAQ({ items }) {
  const [open, setOpen] = useState(null);

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-4 py-3.5 text-left text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
          >
            {item.q}
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
              className={`shrink-0 ml-3 text-gray-400 transition-transform ${open === i ? 'rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          {open === i && (
            <div className="px-4 py-3 text-sm text-gray-600 border-t border-gray-100 bg-gray-50">
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
