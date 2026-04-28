import { Routes, Route } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Landing from '@/pages/Landing';
import Verify from '@/pages/Verify';
import Demo from '@/pages/Demo';
import Dashboard from '@/pages/Dashboard';
import Analytics from '@/pages/Analytics';
import CertificateExplorer from '@/pages/CertificateExplorer';
import Admin from '@/pages/Admin';
import Developer from '@/pages/Developer';

export default function App() {
  return (
    <div className="min-h-screen bg-dp-bg bg-grid-pattern">
      <Navbar />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/certificate/:hash" element={<CertificateExplorer />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/developer" element={<Developer />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
