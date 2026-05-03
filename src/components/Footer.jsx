import { Link } from 'react-router-dom';
import { SITE_NAME } from '../constants';

const TOOLS = [
  { label: 'Add Text to PDF', href: '/add-text-to-pdf'   },
  { label: 'Sign PDF',        href: '/sign-pdf-online'   },
  { label: 'Merge PDF',       href: '/merge-pdf-online'  },
  { label: 'Split PDF',       href: '/split-pdf-online'  },
  { label: 'Rotate PDF',      href: '/rotate-pdf-online' },
  { label: 'JPG to PDF',      href: '/jpg-to-pdf'        },
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
              <span className="text-white font-bold text-sm">{SITE_NAME}</span>
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
              <li><Link to="/privacy-policy" className="text-sm hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-use" className="text-sm hover:text-white transition-colors">Terms of Use</Link></li>
            </ul>
          </div>

        </div>
        <p className="pt-6 text-center text-xs text-gray-600">
          © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
