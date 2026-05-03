import { Helmet } from 'react-helmet-async';
import Footer from '../components/Footer';

export default function PrivacyPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 flex flex-col">
      <Helmet>
        <title>Privacy Policy – Simple PDF Tools</title>
        <meta name="description" content="Privacy Policy for Simple PDF Tools." />
      </Helmet>

      <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-gray-400 text-sm">Coming soon.</p>
      </div>

      <Footer />
    </div>
  );
}
