import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import UploadScreen from '../components/UploadScreen';
import Editor from '../components/Editor';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

const HOW_TO = [
  { step: '01', title: 'Upload your PDF', desc: 'Select the PDF document you need to sign.' },
  { step: '02', title: 'Add your signature', desc: 'Click the signature tool, then draw, type, or upload your signature and place it on the page.' },
  { step: '03', title: 'Download your signed PDF', desc: 'Download the signed document instantly, ready to send.' },
];

const WHY = [
  'No login or account required',
  'No watermark on your signed PDF',
  'Simple and fast — done in seconds',
  'Draw, type, or upload your signature',
  'Your files never leave your browser',
];

const FAQ_ITEMS = [
  {
    q: 'Can I sign a PDF for free?',
    a: 'Yes, completely free with no account or payment needed.',
  },
  {
    q: 'Can I draw my signature?',
    a: 'Yes — use the signature tool to draw, type, or upload an image of your signature.',
  },
  {
    q: 'Is a digitally signed PDF legally valid?',
    a: 'For most informal uses, yes. For legally binding contracts, you may need a certified e-signature service.',
  },
  {
    q: 'Are my documents stored anywhere?',
    a: 'No. Everything happens in your browser. Your files are never sent to any server.',
  },
];

const META = {
  title: 'Sign PDF Online Free – Add Signature to PDF',
  desc:  'Add your signature to a PDF online. Free, fast, and no sign-up required.',
};

export default function SignPage() {
  const [file, setFile] = useState(null);

  if (file) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <Helmet>
          <title>{META.title}</title>
          <meta name="description" content={META.desc} />
        </Helmet>
        <Editor file={file} onReset={() => setFile(null)} />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 flex flex-col">
      <Helmet>
        <title>{META.title}</title>
        <meta name="description" content={META.desc} />
      </Helmet>

      {/* Hero */}
      <section className="text-center pt-12 pb-8 px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Sign PDF Online</h1>
        <p className="text-gray-500 max-w-lg mx-auto text-sm">
          Add your signature to any PDF document online.
          Free, no account needed, works directly in your browser.
        </p>
      </section>

      {/* Upload */}
      <section className="max-w-lg mx-auto w-full px-4 sm:px-6">
        <UploadScreen onFileSelect={setFile} color="purple" />
      </section>

      {/* SEO content */}
      <div className="max-w-2xl mx-auto px-6 pb-20 space-y-14 mt-8">

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6">How to sign a PDF</h2>
          <div className="space-y-4">
            {HOW_TO.map(item => (
              <div key={item.step} className="flex gap-4">
                <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-600 font-bold text-sm flex items-center justify-center shrink-0">
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
