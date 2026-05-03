import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import AddTextPage from './pages/AddTextPage';
import MergePage from './pages/MergePage';
import SignPage from './pages/SignPage';

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
        </Routes>
      </main>
    </div>
  );
}
