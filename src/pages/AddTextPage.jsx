import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import UploadScreen from '../components/UploadScreen';
import Editor from '../components/Editor';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

const HOW_TO = [
  { step: '01', title: 'Upload your PDF', desc: 'Click "Choose PDF" or drag and drop your file onto the upload area.' },
  { step: '02', title: 'Add text, shapes, or images', desc: 'Use the toolbar to add text boxes, shapes, or images anywhere on the page.' },
  { step: '03', title: 'Download your edited PDF', desc: 'Click the Download button to save your edited PDF to your device.' },
];

const WHY = [
  'No login or account required',
  'No watermark added to your PDF',
  'Fast and simple — works in seconds',
  'All processing happens in your browser',
  'Your files are never uploaded to a server',
];

const FAQ_ITEMS = [
  {
    q: 'Can I add text to a PDF for free?',
    a: 'Yes, completely free. No sign-up, no payment, no limits.',
  },
  {
    q: 'Can I add images or signatures to a PDF?',
    a: 'Yes. Use the image tool to upload a PNG or JPEG and place it anywhere on the page — including signature images.',
  },
  {
    q: 'Does this tool store my files?',
    a: 'No. Your PDF is processed entirely in your browser using JavaScript. Nothing is ever sent to a server.',
  },
  {
    q: 'Is it safe to use?',
    a: 'Yes. Because everything runs locally in your browser, your documents stay private and on your device at all times.',
  },
  {
    q: 'What file types are supported?',
    a: 'PDF files for documents, and PNG, JPEG, or WebP for images you want to insert.',
  },
];

export default function AddTextPage() {
  const [file, setFile] = useState(null);

  // Full-screen editor mode when a file is loaded
  if (file) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <Helmet>
          <title>Add Text, Shapes & Images to PDF Online Free – No Login</title>
          <meta name="description" content="Upload a PDF and add text, shapes, or images instantly. Free, no sign-up required." />
        </Helmet>
        <Editor file={file} onReset={() => setFile(null)} />
      </div>
    );
  }

  // Landing + upload mode
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 flex flex-col">
      <Helmet>
        <title>Add Text, Shapes & Images to PDF Online Free – No Login</title>
        <meta name="description" content="Upload a PDF and add text, shapes, or images instantly. Free, no sign-up required." />
      </Helmet>

      {/* Hero */}
      <section className="text-center pt-12 pb-8 px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Add Text, Shapes & Images to PDF
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto text-sm">
          Upload your PDF and easily add text, shapes, or images anywhere on the page.
          Free, instant, no sign-up required.
        </p>
      </section>

      {/* Upload tool */}
      <section className="max-w-lg mx-auto px-6">
        <UploadScreen onFileSelect={setFile} />
      </section>

      {/* SEO content */}
      <div className="max-w-2xl mx-auto px-6 pb-20 space-y-14 mt-8">

        {/* How to */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6">How to edit a PDF</h2>
          <div className="space-y-4">
            {HOW_TO.map(item => (
              <div key={item.step} className="flex gap-4">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 font-bold text-sm flex items-center justify-center shrink-0">
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

        {/* Why */}
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

        {/* FAQ */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently asked questions</h2>
          <FAQ items={FAQ_ITEMS} />
        </section>

      </div>

      <Footer />
    </div>
  );
}
