import { Helmet } from 'react-helmet-async';
import RotatePdfTool from '../components/RotatePdfTool';
import Footer from '../components/Footer';
import { SITE_NAME } from '../constants';

export default function RotatePdfPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 flex flex-col">
      <Helmet>
        <title>Rotate PDF Online – Free | {SITE_NAME}</title>
        <meta name="description" content="Rotate individual pages or all pages in a PDF. Free, instant, no login required. Works directly in your browser." />
      </Helmet>

      <div className="flex-1">
        {/* Hero */}
        <section className="bg-white border-b border-gray-100 text-center py-10 pb-8 px-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Rotate PDF</h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
            Rotate individual pages or all pages at once. Free, no login required.
          </p>
        </section>

        {/* Tool */}
        <section className="py-10">
          <RotatePdfTool />
        </section>
      </div>

      {/* SEO content */}
      <section className="max-w-2xl mx-auto px-6 pb-20 space-y-14 mt-8">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-bold text-gray-900">How to Rotate a PDF</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Upload your PDF, then rotate individual pages left or right using the buttons beneath each thumbnail.
            Use "Rotate All" to apply the same rotation to every page at once.
            When you're happy with the result, click "Apply &amp; Download" to save your rotated PDF.
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-400 leading-relaxed">
            {SITE_NAME}'s rotate PDF tool works entirely in your browser — your files are never uploaded to any server.
            Supports any PDF size, completely free with no watermarks.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
