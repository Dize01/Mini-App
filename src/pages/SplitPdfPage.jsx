import { Helmet } from 'react-helmet-async';
import SplitPdfTool from '../components/SplitPdfTool';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

const HOW_TO = [
  { step: '01', title: 'Upload your PDF',      desc: 'Select the PDF you want to extract pages from.' },
  { step: '02', title: 'Select a page range',  desc: 'Set the from and to page numbers. Thumbnails highlight your selection.' },
  { step: '03', title: 'Extract and download', desc: 'Click Extract and your selected pages download as a new PDF instantly.' },
];

const WHY = [
  'Free, no account required',
  'No files uploaded to any server',
  'Preview every page before extracting',
  'Download only the pages you need',
  'Works on any PDF, any size',
];

const FAQ_ITEMS = [
  {
    q: 'Can I extract just one page?',
    a: 'Yes — set both the From and To inputs to the same page number.',
  },
  {
    q: 'Does this modify my original file?',
    a: 'No. A new PDF is created with only the selected pages. Your original file is untouched.',
  },
  {
    q: 'Are my files uploaded to a server?',
    a: 'No. Everything runs locally in your browser. Your files never leave your device.',
  },
  {
    q: 'Can I extract non-consecutive pages?',
    a: 'This tool extracts a continuous page range. For non-consecutive pages, run the tool multiple times.',
  },
  {
    q: 'Is there a page limit?',
    a: 'No hard limit — though very large PDFs may take a moment to load thumbnails.',
  },
];

export default function SplitPdfPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 flex flex-col">
      <Helmet>
        <title>Split PDF Online Free – Extract Pages from PDF</title>
        <meta name="description" content="Extract specific pages from a PDF online for free. Select a page range, preview thumbnails, and download instantly. No upload, no login required." />
      </Helmet>

      {/* Hero */}
      <section className="text-center pt-12 pb-8 px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Split PDF Online</h1>
        <p className="text-gray-500 max-w-lg mx-auto text-sm">
          Extract any range of pages from a PDF into a new document.
          Free, no sign-up, works directly in your browser.
        </p>
      </section>

      {/* Tool */}
      <SplitPdfTool />

      {/* SEO content */}
      <div className="max-w-2xl mx-auto px-6 pb-20 space-y-14 mt-8">

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6">How to split a PDF</h2>
          <div className="space-y-4">
            {HOW_TO.map(item => (
              <div key={item.step} className="flex gap-4">
                <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-500 font-bold text-sm flex items-center justify-center shrink-0">
                  {item.step}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                  <p className="text-gray-500 text-sm mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Why use this tool</h2>
          <ul className="space-y-2">
            {WHY.map(item => (
              <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-green-500 shrink-0">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently asked questions</h2>
          <FAQ items={FAQ_ITEMS} />
        </section>

      </div>

      <Footer />
    </div>
  );
}
