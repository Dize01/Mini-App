import { Link, NavLink } from 'react-router-dom';
import { SITE_NAME } from '../constants';

const TOOLS = [
  { label: 'Add Text',   href: '/add-text-to-pdf' },
  { label: 'Merge PDF',  href: '/merge-pdf-online' },
  { label: 'Sign PDF',   href: '/sign-pdf-online'  },
  { label: 'JPG to PDF', href: '/jpg-to-pdf'       },
  { label: 'Split PDF',  href: '/split-pdf-online' },
];

export default function Header() {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 shrink-0 shadow-sm z-20">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 font-bold text-gray-900 mr-8 shrink-0">
        <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
        </div>
        <span className="text-sm font-bold text-gray-900">{SITE_NAME}</span>
      </Link>

      {/* Nav links */}
      <nav className="flex items-center gap-1">
        {TOOLS.map(t => (
          <NavLink
            key={t.href}
            to={t.href}
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg text-sm transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            {t.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
