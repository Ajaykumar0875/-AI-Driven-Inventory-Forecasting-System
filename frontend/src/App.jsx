import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import MainLayout from './layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Forecast from './pages/Forecast';

function App() {
  return (
    <Router>
      <Toaster position="bottom-right" theme="dark" richColors />
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/forecast" element={<Forecast />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
