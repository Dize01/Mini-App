import { Link } from 'react-router-dom';

const TOOLS = [
  { label: 'Add Text to PDF', href: '/add-text-to-pdf' },
  { label: 'Merge PDF',       href: '/merge-pdf-online' },
  { label: 'Sign PDF',        href: '/sign-pdf-online'  },
];

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 shrink-0">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pb-8 border-b border-gray-800">

          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <span className="text-white font-bold text-sm">Simple PDF Tools</span>
            </Link>
            <p className="text-sm leading-relaxed">
              Free online PDF tools.<br/>
              No login. No watermark.<br/>
              Works in your browser.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Tools</h3>
            <ul className="space-y-2.5">
              {TOOLS.map(t => (
                <li key={t.href}>
                  <Link to={t.href} className="text-sm hover:text-white transition-colors">
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Legal</h3>
            <ul className="space-y-2.5">
              <li><span className="text-sm text-gray-600 cursor-default">Privacy Policy <span className="text-xs">(coming soon)</span></span></li>
              <li><span className="text-sm text-gray-600 cursor-default">Terms of Use <span className="text-xs">(coming soon)</span></span></li>
            </ul>
          </div>

        </div>
        <p className="pt-6 text-center text-xs text-gray-600">
          © {new Date().getFullYear()} Simple PDF Tools. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
