import { Helmet } from 'react-helmet-async';
import Footer from '../components/Footer';
import { SITE_NAME } from '../constants';

const SECTIONS = [
  {
    title: '1. Use of the Service',
    body: (
      <>
        <p>{SITE_NAME} provides free, browser-based tools for editing PDF files, including adding text, shapes, images, merging, and signing documents.</p>
        <p>You agree to use the service only for lawful purposes and in accordance with these terms.</p>
        <p className="font-medium text-gray-800">You must not:</p>
        <ul>
          <li>Use the service for illegal, fraudulent, or harmful activities</li>
          <li>Upload or process content that violates laws or third-party rights</li>
          <li>Attempt to disrupt or interfere with the website's functionality</li>
        </ul>
      </>
    ),
  },
  {
    title: '2. No Storage of Files',
    body: (
      <>
        <p>All processing is performed locally in your browser.</p>
        <ul>
          <li><strong>Files are not uploaded or stored on our servers</strong></li>
          <li>We do <strong>not access or retain your documents</strong></li>
          <li>You are responsible for your own files and backups</li>
        </ul>
      </>
    ),
  },
  {
    title: '3. No Warranties',
    body: (
      <>
        <p>The service is provided <strong>"as is"</strong> and <strong>"as available"</strong> without warranties of any kind.</p>
        <p className="font-medium text-gray-800">We do not guarantee that:</p>
        <ul>
          <li>The service will be uninterrupted or error-free</li>
          <li>The results will always be accurate or suitable for your needs</li>
        </ul>
      </>
    ),
  },
  {
    title: '4. Limitation of Liability',
    body: (
      <>
        <p>To the fullest extent permitted by law, {SITE_NAME} shall not be liable for any damages resulting from:</p>
        <ul>
          <li>Use or inability to use the service</li>
          <li>Loss, corruption, or damage to files</li>
          <li>Errors in processing PDF documents</li>
        </ul>
        <p>Use the service at your own risk.</p>
      </>
    ),
  },
  {
    title: '5. Intellectual Property',
    body: (
      <>
        <p>All website content, design, and branding belong to {SITE_NAME}.</p>
        <p className="font-medium text-gray-800">You may not:</p>
        <ul>
          <li>Copy, reproduce, or redistribute the website content</li>
          <li>Reverse engineer or exploit the service for commercial use without permission</li>
        </ul>
      </>
    ),
  },
  {
    title: '6. Third-Party Services',
    body: (
      <>
        <p>We may use third-party services such as hosting or analytics providers. These services may collect limited technical data as described in our Privacy Policy.</p>
      </>
    ),
  },
  {
    title: '7. Changes to the Service',
    body: (
      <>
        <p className="font-medium text-gray-800">We reserve the right to:</p>
        <ul>
          <li>Modify or discontinue features at any time</li>
          <li>Update these Terms of Use without prior notice</li>
        </ul>
        <p>Continued use of the service means you accept any updated terms.</p>
      </>
    ),
  },
  {
    title: '8. Termination',
    body: (
      <>
        <p>We may restrict or terminate access to the service if users violate these terms or misuse the platform.</p>
      </>
    ),
  },
  {
    title: '9. Governing Law',
    body: (
      <>
        <p>These Terms of Use are governed by the laws of Australia.</p>
      </>
    ),
  },
  {
    title: '10. Contact',
    body: (
      <>
        <p>If you have any questions about these Terms, please contact:</p>
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
  'Use the tools responsibly',
  'Your files stay on your device',
  'The service comes with no guarantees',
  'You use it at your own risk',
];

export default function TermsPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 flex flex-col">
      <Helmet>
        <title>Terms of Use – {SITE_NAME}</title>
        <meta name="description" content="Terms of Use for {SITE_NAME}." />
      </Helmet>

      <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-14">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Terms of Use</h1>
          <p className="text-sm text-gray-400">Effective Date: 3 May 2026</p>
          <p className="text-gray-600 text-sm mt-4 leading-relaxed">
            Welcome to <strong className="text-gray-800">{SITE_NAME}</strong>. By accessing or using this website,
            you agree to the following Terms of Use. If you do not agree, please do not use the service.
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
