import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { CreatorApp } from './components/creator/CreatorApp';
import { HookGalleryRoute } from './routes/HookGalleryRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreatorApp />} />
        <Route path="/hook-gallery" element={<HookGalleryRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
