import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Shield, Upload, Users, Clock, ExternalLink, Plus, Trash2, MoreHorizontal
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const mockCertificates = [
  { id: 'cert_001', hash: '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069', tokenId: 1247, device: 'CANON-EOS-R5-SN4823', timestamp: '2026-04-27T14:32:07Z', authorized: 3 },
  { id: 'cert_002', hash: '0xa9f5c28e7d3b1847ec52af6d8e9104fb3c62d9a7e851f2c043b6d9e7a134c8b2', tokenId: 1248, device: 'SONY-A7IV-SN7291', timestamp: '2026-04-27T15:10:22Z', authorized: 1 },
  { id: 'cert_003', hash: '0xc3d2e7f18a4b6952d7e84c1f39a2b5068ed74f1c2a893e6d0b54f7c81e263a90', tokenId: 1249, device: 'NIKON-Z9-SN1834', timestamp: '2026-04-26T09:45:33Z', authorized: 5 },
  { id: 'cert_004', hash: '0xd4e3f80a9b5c7063e8f95d2g40b3c6179fe85g2d3b904f7e1c65g8d92f374b01', tokenId: 1250, device: 'CANON-EOS-R3-SN6142', timestamp: '2026-04-25T18:22:11Z', authorized: 0 },
];

const recentUploads = [
  { name: 'IPL_Final_Frame_001.jpg', size: '4.2 MB', status: 'verified', time: '2 min ago' },
  { name: 'T20_WorldCup_Highlights.mp4', size: '128 MB', status: 'processing', time: '5 min ago' },
  { name: 'WC_Trophy_Ceremony.png', size: '8.1 MB', status: 'verified', time: '12 min ago' },
];

export default function Dashboard() {
  const [selectedCert, setSelectedCert] = useState<string | null>(null);

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Creator <span className="text-gradient">Dashboard</span></h1>
            <p className="text-white/40 mt-1">Manage your certificates and authorized users</p>
          </div>
          <button className="btn-primary">
            <Plus className="h-4 w-4" /> Mint Certificate
          </button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Certificates', value: '24', icon: Shield, color: 'text-dp-green' },
            { label: 'Total Uploads', value: '156', icon: Upload, color: 'text-dp-cyan' },
            { label: 'Authorized Users', value: '12', icon: Users, color: 'text-dp-amber' },
            { label: 'Last Mint', value: '2h ago', icon: Clock, color: 'text-dp-purple-400' },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="stat-card">
              <div className="flex items-center justify-between mb-3">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="stat-value text-white">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Certificates Table */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card">
              <div className="p-6 border-b border-white/[0.06]">
                <h2 className="text-lg font-semibold text-white">My Certificates</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="dp-table">
                  <thead>
                    <tr>
                      <th>Token</th>
                      <th>Content Hash</th>
                      <th>Device</th>
                      <th>Authorized</th>
                      <th>Created</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockCertificates.map((cert) => (
                      <tr key={cert.id} className="cursor-pointer" onClick={() => setSelectedCert(selectedCert === cert.id ? null : cert.id)}>
                        <td><span className="font-mono text-dp-green font-semibold">#{cert.tokenId}</span></td>
                        <td><span className="font-mono text-xs">{cert.hash.slice(0, 10)}...{cert.hash.slice(-6)}</span></td>
                        <td><span className="text-xs">{cert.device}</span></td>
                        <td><span className="badge-cyan">{cert.authorized} users</span></td>
                        <td><span className="text-xs">{new Date(cert.timestamp).toLocaleDateString()}</span></td>
                        <td>
                          <button className="p-1 text-white/30 hover:text-white">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            {/* Quick Upload */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Quick Upload</h3>
              <div className="upload-zone py-8">
                <Upload className="h-8 w-8 text-white/20 mb-3" />
                <p className="text-sm text-white/40">Drop to mint certificate</p>
              </div>
            </motion.div>

            {/* Recent Uploads */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Recent Uploads</h3>
              <div className="space-y-3">
                {recentUploads.map((upload, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <div className={`h-2 w-2 rounded-full ${upload.status === 'verified' ? 'bg-dp-green' : 'bg-dp-amber animate-pulse'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white/70 truncate">{upload.name}</div>
                      <div className="text-xs text-white/30">{upload.size} • {upload.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Selected Certificate QR */}
            {selectedCert && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6 text-center verdict-original">
                <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Certificate QR</div>
                <div className="inline-block p-3 rounded-xl bg-white mb-3">
                  <QRCodeSVG value={`https://deepprovenance.io/certificate/${selectedCert}`} size={120} level="M" />
                </div>
                <a href="#" className="inline-flex items-center gap-1 text-xs text-dp-cyan hover:underline">
                  View on chain <ExternalLink className="h-3 w-3" />
                </a>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
