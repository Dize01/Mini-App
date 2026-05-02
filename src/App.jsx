import { useState } from 'react';
import UploadScreen from './components/UploadScreen';
import Editor from './components/Editor';

export default function App() {
  const [file, setFile] = useState(null);

  return (
    <div className="h-screen w-screen overflow-hidden">
      {file ? (
        <Editor file={file} onReset={() => setFile(null)} />
      ) : (
        <UploadScreen onFileSelect={setFile} />
      )}
    </div>
  );
}
