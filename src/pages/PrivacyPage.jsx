import { Helmet } from 'react-helmet-async';
import Footer from '../components/Footer';
import { SITE_NAME } from '../constants';

const SECTIONS = [
  {
    title: '1. Information We Do Not Collect',
    body: (
      <>
        <p>We are committed to keeping your data private. <strong>We do not require you to create an account or provide personal information</strong> to use our tools.</p>
        <p className="font-medium text-gray-800">We do not collect:</p>
        <ul>
          <li>Names, emails, or contact details</li>
          <li>Uploaded PDF files or their contents</li>
          <li>Any personal data from documents you process</li>
        </ul>
      </>
    ),
  },
  {
    title: '2. How Your Files Are Handled',
    body: (
      <>
        <p>All file processing happens <strong>locally in your browser</strong>.</p>
        <p className="font-medium text-gray-800">This means:</p>
        <ul>
          <li>Your files are <strong>not uploaded to our servers</strong></li>
          <li>Your files are <strong>not stored, saved, or shared</strong></li>
          <li>All edits (text, shapes, images, merging, signing) are done on your device</li>
        </ul>
        <p>Once you leave the site or refresh the page, your data is no longer accessible.</p>
      </>
    ),
  },
  {
    title: '3. Cookies and Analytics',
    body: (
      <>
        <p className="font-medium text-gray-800">We may use basic cookies or analytics tools to:</p>
        <ul>
          <li>Understand how users interact with the website</li>
          <li>Improve performance and user experience</li>
        </ul>
        <p>This data is <strong>anonymous</strong> and does not identify you personally.</p>
      </>
    ),
  },
  {
    title: '4. Third-Party Services',
    body: (
      <>
        <p className="font-medium text-gray-800">We may use third-party services such as:</p>
        <ul>
          <li>Hosting providers</li>
          <li>Analytics tools (e.g., Google Analytics)</li>
        </ul>
        <p className="font-medium text-gray-800">These services may collect limited technical information such as:</p>
        <ul>
          <li>Browser type</li>
          <li>Device type</li>
          <li>Pages visited</li>
        </ul>
        <p>This information is used only for improving the service.</p>
      </>
    ),
  },
  {
    title: '5. Data Security',
    body: (
      <>
        <p className="font-medium text-gray-800">Because files are processed locally in your browser:</p>
        <ul>
          <li>Your data remains under your control</li>
          <li>We do not store or transmit your files</li>
        </ul>
        <p>However, you are responsible for ensuring your own device security.</p>
      </>
    ),
  },
  {
    title: "6. Children's Privacy",
    body: (
      <>
        <p>Our services are intended for general use and are not directed at children under 13. We do not knowingly collect personal information from children.</p>
      </>
    ),
  },
  {
    title: '7. Changes to This Policy',
    body: (
      <>
        <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date.</p>
      </>
    ),
  },
  {
    title: '8. Contact',
    body: (
      <>
        <p>If you have any questions about this Privacy Policy, you can contact us at:</p>
        <p><strong>Email:</strong>{' '}
          <a href="mailto:emc.ai.studio@gmail.com" className="text-blue-600 hover:underline">
            emc.ai.studio@gmail.com
          </a>
        </p>
      </>
    ),
  },
];

const SUMMARY = [
  'No login required',
  'No files are uploaded',
  'Everything runs in your browser',
  "We don't store your documents",
];

export default function PrivacyPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 flex flex-col">
      <Helmet>
        <title>Privacy Policy – {SITE_NAME} | Free Online PDF Tools</title>
        <meta name="description" content={`Privacy Policy for ${SITE_NAME}. Learn how we protect your data — no files are uploaded, no personal information is collected.`} />
      </Helmet>

      <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-14">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Privacy Policy</h1>
          <p className="text-sm text-gray-400">Effective Date: 3 May 2026</p>
          <p className="text-gray-600 text-sm mt-4 leading-relaxed">
            Welcome to <strong className="text-gray-800">{SITE_NAME}</strong>. Your privacy is important to us.
            This Privacy Policy explains how we handle your information when you use our website and tools.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {SECTIONS.map(section => (
            <section key={section.title} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-base font-bold text-gray-900 mb-4">{section.title}</h2>
              <div className="text-sm text-gray-600 leading-relaxed space-y-3 [&_ul]:space-y-2 [&_ul]:mt-2 [&_ul]:ml-4 [&_ul]:list-disc [&_ul]:text-gray-600">
                {section.body}
              </div>
            </section>
          ))}
        </div>

        {/* Summary box */}
        <div className="mt-10 bg-blue-50 border border-blue-100 rounded-2xl p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4">Summary (Plain English)</h2>
          <ul className="space-y-2">
            {SUMMARY.map(item => (
              <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-blue-500 shrink-0">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-center text-sm text-gray-500 mt-10">
          Thank you for using <strong className="text-gray-700">{SITE_NAME}</strong>.
        </p>

      </div>

      <Footer />
    </div>
  );
}
