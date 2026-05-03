import { Helmet } from 'react-helmet-async';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import MergeTool from '../components/MergeTool';

const HOW_TO = [
  { step: '01', title: 'Upload your PDF files', desc: 'Select multiple PDF files from your device to combine.' },
  { step: '02', title: 'Arrange them in order', desc: 'Use the up and down buttons to reorder files however you need.' },
  { step: '03', title: 'Merge and download', desc: 'Click merge and your combined PDF downloads instantly.' },
];

const WHY = [
  'Unlimited merges, completely free',
  'No watermark added',
  'Fast — merges in seconds',
  'No login or account required',
  'Files stay private in your browser',
];

const FAQ_ITEMS = [
  {
    q: 'Can I merge PDF files for free?',
    a: 'Yes, completely free with no limits and no sign-up required.',
  },
  {
    q: 'How many PDFs can I merge at once?',
    a: 'As many as you need — there is no artificial limit, though very large files may be slower depending on your device.',
  },
  {
    q: 'Will my files be uploaded to a server?',
    a: 'No. All merging happens locally in your browser. Your files never leave your device.',
  },
  {
    q: 'Is there a file size limit?',
    a: 'No hard limit — though very large files may be slower depending on your device.',
  },
];

export default function MergePage() {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 flex flex-col">
      <Helmet>
        <title>Merge PDF Online Free – Combine PDF Files Instantly</title>
        <meta name="description" content="Merge multiple PDF files into one in seconds. Free, fast, and no sign-up required." />
      </Helmet>

      {/* Hero */}
      <section className="text-center pt-12 pb-8 px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Merge PDF Files</h1>
        <p className="text-gray-500 max-w-lg mx-auto text-sm">
          Combine multiple PDF files into one document in seconds.
          Free, no sign-up, no watermark.
        </p>
      </section>

      {/* Merge tool */}
      <MergeTool />

      {/* SEO content */}
      <div className="max-w-2xl mx-auto px-6 pb-20 space-y-14">

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6">How to merge PDFs</h2>
          <div className="space-y-4">
            {HOW_TO.map(item => (
              <div key={item.step} className="flex gap-4">
                <div className="w-9 h-9 rounded-full bg-green-100 text-green-600 font-bold text-sm flex items-center justify-center shrink-0">
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
