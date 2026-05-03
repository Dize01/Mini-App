import { Helmet } from 'react-helmet-async';
import JpgToPdfTool from '../components/JpgToPdfTool';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

const HOW_TO = [
  { step: '01', title: 'Upload your images',    desc: 'Select one or more JPG, PNG, or WebP images from your device.' },
  { step: '02', title: 'Adjust settings',        desc: 'Choose page size, orientation, and margin to control how images appear on each page.' },
  { step: '03', title: 'Convert and download',   desc: 'Click Convert to PDF and your file downloads instantly.' },
];

const WHY = [
  'Free, no account required',
  'No files uploaded to any server',
  'Supports JPG, PNG, and WebP',
  'Custom page size, orientation, and margins',
  'Multiple images converted into one PDF',
];

const FAQ_ITEMS = [
  {
    q: 'Can I convert multiple images into one PDF?',
    a: 'Yes. Upload as many images as you need and they will each become a page in the output PDF, in the order you choose.',
  },
  {
    q: 'What image formats are supported?',
    a: 'JPG, PNG, and WebP. All are converted at full quality.',
  },
  {
    q: 'Will the image quality be reduced?',
    a: 'No. Images are embedded directly into the PDF at their original resolution.',
  },
  {
    q: 'Are my files uploaded to a server?',
    a: 'No. Everything runs locally in your browser. Your files never leave your device.',
  },
  {
    q: 'Is there a file size limit?',
    a: 'There is no hard limit, though very large images may be slower to process depending on your device.',
  },
];

export default function JpgToPdfPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 flex flex-col">
      <Helmet>
        <title>JPG to PDF – Convert Images to PDF Free Online</title>
        <meta name="description" content="Convert JPG, PNG, and WebP images to PDF online for free. Set page size, orientation, and margins. No upload, no login required." />
      </Helmet>

      {/* Hero */}
      <section className="text-center pt-12 pb-8 px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">JPG to PDF</h1>
        <p className="text-gray-500 max-w-lg mx-auto text-sm">
          Convert JPG, PNG, or WebP images into a PDF.
          Adjust page size, orientation, and margins. Free, no sign-up required.
        </p>
      </section>

      {/* Tool */}
      <JpgToPdfTool />

      {/* SEO content */}
      <div className="max-w-2xl mx-auto px-6 pb-20 space-y-14 mt-8">

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6">How to convert images to PDF</h2>
          <div className="space-y-4">
            {HOW_TO.map(item => (
              <div key={item.step} className="flex gap-4">
                <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-500 font-bold text-sm flex items-center justify-center shrink-0">
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
