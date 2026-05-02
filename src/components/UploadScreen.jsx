import { useCallback, useState } from 'react';

export default function UploadScreen({ onFileSelect }) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  const handleFile = useCallback((file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file.');
      return;
    }
    setError('');
    onFileSelect(file);
  }, [onFileSelect]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50">
      <div className="w-full max-w-md px-6">
        {/* Logo + title */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">PDF Text Editor</h1>
        </div>
        <p className="text-gray-500 text-center mb-8 text-sm">
          Upload a PDF and add text anywhere.
        </p>

        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-50 scale-[1.01]'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors ${isDragging ? 'bg-blue-100' : 'bg-gray-100'}`}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={isDragging ? '#3b82f6' : '#9ca3af'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <p className="text-gray-700 font-medium mb-1">
            {isDragging ? 'Drop your PDF here' : 'Drag & drop your PDF here'}
          </p>
          <p className="text-gray-400 text-sm mb-6">or</p>
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />
            <span className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm font-semibold inline-block">
              Choose PDF
            </span>
          </label>
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-600 text-center">{error}</p>
        )}

        <p className="text-center text-xs text-gray-400 mt-4">Only PDF files are supported</p>
      </div>
    </div>
  );
}
