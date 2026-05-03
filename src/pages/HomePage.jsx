import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Footer from '../components/Footer';
import { SITE_NAME } from '../constants';

const TOOLS = [
  {
    href: '/add-text-to-pdf',
    accent: 'bg-blue-500',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    btn: 'bg-blue-600 hover:bg-blue-700',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
    title: 'Add Text, Shapes & Images',
    description: 'Place text boxes, shapes, or images anywhere on your PDF. Free and instant — no account needed.',
  },
  {
    href: '/merge-pdf-online',
    accent: 'bg-emerald-500',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    btn: 'bg-emerald-600 hover:bg-emerald-700',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 6H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3"/>
        <polyline points="15 3 12 6 9 3"/>
        <line x1="12" y1="6" x2="12" y2="14"/>
      </svg>
    ),
    title: 'Merge PDF',
    description: 'Combine multiple PDFs into one file in seconds. No file size limits, completely free.',
  },
  {
    href: '/sign-pdf-online',
    accent: 'bg-purple-500',
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
    btn: 'bg-purple-600 hover:bg-purple-700',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/>
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
    title: 'Sign PDF',
    description: 'Draw, type, or upload a signature and place it on any PDF. No account needed.',
  },
];

const TRUST = [
  'No login required',
  'No watermark',
  'Runs in your browser',
  '100% free',
];

export default function HomePage() {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 flex flex-col">
      <Helmet>
        <title>Free PDF Tools – Add Text, Merge & Sign PDFs Online</title>
        <meta name="description" content="Add text, shapes, and images to PDF, merge multiple PDFs, and sign documents online for free. No login, no watermark, works directly in your browser." />
      </Helmet>

      <div className="flex-1">
        {/* Hero */}
        <section className="relative bg-white border-b border-gray-100 text-center py-16 px-6 overflow-hidden">
          {/* Subtle gradient blob */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-100 rounded-full blur-3xl opacity-40" />
          </div>

          <div className="relative">
            {/* Pill badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold mb-6 border border-blue-100">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
              Free · No login · No watermark
            </span>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-5 leading-tight tracking-tight">
              Free PDF Tools<br className="hidden sm:block" />
              <span className="text-blue-600"> Online</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
              Add text, shapes &amp; images, merge, or sign PDF files —
              all free, directly in your browser.
            </p>
          </div>
        </section>

        {/* Tool cards */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TOOLS.map(tool => (
              <Link
                key={tool.href}
                to={tool.href}
                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-200"
              >
                {/* Colored top accent bar */}
                <div className={`h-1 w-full ${tool.accent}`} />

                <div className="p-6 flex flex-col flex-1">
                  <div className={`w-11 h-11 rounded-xl ${tool.iconBg} ${tool.iconColor} flex items-center justify-center mb-4`}>
                    {tool.icon}
                  </div>
                  <h2 className="text-base font-bold text-gray-900 mb-2 leading-snug">{tool.title}</h2>
                  <p className="text-sm text-gray-500 flex-1 mb-5 leading-relaxed">{tool.description}</p>
                  <span className={`w-full text-center py-2.5 rounded-xl text-white text-sm font-semibold transition-colors ${tool.btn}`}>
                    Use Tool →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Trust badges */}
          <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3">
            {TRUST.map(badge => (
              <span key={badge} className="flex items-center gap-1.5 text-sm text-gray-400">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-emerald-500 shrink-0">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {badge}
              </span>
            ))}
          </div>
        </section>

        {/* SEO content block */}
        <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-16 text-center">
          <p className="text-sm text-gray-400 leading-relaxed">
            {SITE_NAME} lets you add text, shapes, and images to PDF files, merge multiple PDFs,
            and sign documents online for free. All tools work directly in your browser with no uploads
            or registration required.
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
