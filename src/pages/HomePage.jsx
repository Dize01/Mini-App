import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const TOOLS = [
  {
    href: '/add-text-to-pdf',
    color: 'blue',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
    title: 'Add Text, Shapes & Images to PDF',
    keyword: 'Add text, shapes, and images to PDF',
    description: 'Upload a PDF and place text boxes, shapes, or images anywhere on the page. Free and instant.',
  },
  {
    href: '/merge-pdf-online',
    color: 'green',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 6H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3"/>
        <polyline points="15 3 12 6 9 3"/>
        <line x1="12" y1="6" x2="12" y2="14"/>
      </svg>
    ),
    title: 'Merge PDF',
    keyword: 'Combine multiple PDF files into one',
    description: 'Merge multiple PDFs into a single file in seconds. No file size limits, completely free.',
  },
  {
    href: '/sign-pdf-online',
    color: 'purple',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/>
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
    title: 'Sign PDF',
    keyword: 'Add your signature to a PDF online',
    description: 'Draw, type, or upload a signature and place it on any PDF. No account needed.',
  },
];

const TRUST = [
  'No login required',
  'No watermark',
  'Files processed locally in your browser',
  '100% free',
];

const colorMap = {
  blue:   { bg: 'bg-blue-100',   text: 'text-blue-600',   btn: 'bg-blue-600 hover:bg-blue-700' },
  green:  { bg: 'bg-green-100',  text: 'text-green-600',  btn: 'bg-green-600 hover:bg-green-700' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600', btn: 'bg-purple-600 hover:bg-purple-700' },
};

export default function HomePage() {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <Helmet>
        <title>Free PDF Tools – Add Text, Merge & Sign PDFs Online</title>
        <meta name="description" content="Add text, shapes, and images to PDF, merge multiple PDFs, and sign documents online for free. No login, no watermark, works directly in your browser." />
      </Helmet>

      {/* Hero */}
      <section className="text-center py-14 px-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
          Free PDF Tools – Add Text, Merge & Sign PDFs Online
        </h1>
        <p className="text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Add text, shapes, images, merge and sign PDFs online.
          No login, no watermark, works directly in your browser.
        </p>
      </section>

      {/* Tool cards */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TOOLS.map(tool => {
            const c = colorMap[tool.color];
            return (
              <Link
                key={tool.href}
                to={tool.href}
                className="group bg-white rounded-2xl border border-gray-200 p-6 flex flex-col shadow-sm hover:shadow-md hover:border-gray-300 transition-all"
              >
                <div className={`w-12 h-12 rounded-xl ${c.bg} ${c.text} flex items-center justify-center mb-4`}>
                  {tool.icon}
                </div>
                <h2 className="text-base font-semibold text-gray-900 mb-1">{tool.title}</h2>
                <p className={`text-xs font-medium mb-2 ${c.text}`}>{tool.keyword}</p>
                <p className="text-sm text-gray-500 flex-1 mb-5">{tool.description}</p>
                <span className={`w-full text-center py-2.5 rounded-xl text-white text-sm font-semibold transition-colors ${c.btn}`}>
                  Use Tool
                </span>
              </Link>
            );
          })}
        </div>

        {/* Trust badges */}
        <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3">
          {TRUST.map(badge => (
            <span key={badge} className="flex items-center gap-1.5 text-sm text-gray-500">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-green-500 shrink-0">
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
          Simple PDF Tools lets you add text, shapes, and images to PDF files, merge multiple PDFs,
          and sign documents online for free. All tools work directly in your browser with no uploads
          or registration required.
        </p>
      </section>
    </div>
  );
}
