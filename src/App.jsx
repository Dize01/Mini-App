import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import AddTextPage from './pages/AddTextPage';
import MergePage from './pages/MergePage';
import SignPage from './pages/SignPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import JpgToPdfPage from './pages/JpgToPdfPage';
import SplitPdfPage from './pages/SplitPdfPage';
import RotatePdfPage from './pages/RotatePdfPage';

export default function App() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 min-h-0 flex flex-col">
        <Routes>
          <Route path="/"                  element={<HomePage />} />
          <Route path="/add-text-to-pdf"   element={<AddTextPage />} />
          <Route path="/merge-pdf-online"  element={<MergePage />} />
          <Route path="/sign-pdf-online"   element={<SignPage />} />
          <Route path="/jpg-to-pdf"         element={<JpgToPdfPage />} />
          <Route path="/split-pdf-online"   element={<SplitPdfPage />} />
          <Route path="/rotate-pdf-online"  element={<RotatePdfPage />} />
          <Route path="/privacy-policy"    element={<PrivacyPage />} />
          <Route path="/terms-of-use"      element={<TermsPage />} />
        </Routes>
      </main>
    </div>
  );
}
