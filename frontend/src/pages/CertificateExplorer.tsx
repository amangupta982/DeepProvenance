import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import {
  Shield, ExternalLink, Clock, Camera, User, Hash, Link2, Copy, Check, FileText
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';

const mockCert = {
  contentHash: '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
  tokenId: 1247,
  txHash: '0x3a2c8e9f1b4d7c6a5e2f8d9c0b3a4e5f6d7c8b9a0e1f2d3c4b5a6f7e8d9c0b',
  owner: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD38',
  ownerEmail: 'photographer@bcci.tv',
  deviceId: 'CANON-EOS-R5-SN4823',
  timestampCaptured: '2026-04-27T14:32:07Z',
  blockNumber: 4821537,
  chainId: 2442,
  metadata: { event: 'IPL 2026 Final', venue: 'Narendra Modi Stadium', camera: 'Canon EOS R5', lens: 'RF 70-200mm f/2.8', iso: 3200 },
};

const auditTrail = [
  { event: 'Certificate Minted', actor: 'photographer@bcci.tv', time: '14:32:07 UTC', type: 'mint' },
  { event: 'Content Registered in DNA Registry', actor: 'System', time: '14:32:08 UTC', type: 'registry' },
  { event: 'Authorized User Added', actor: 'photographer@bcci.tv', time: '14:35:22 UTC', type: 'authorize' },
  { event: 'Verified Reuse Detected', actor: 'player@bcci.tv', time: '15:10:45 UTC', type: 'reuse' },
  { event: 'Unauthorized Copy Flagged', actor: 'System', time: '16:22:11 UTC', type: 'violation' },
];

export default function CertificateExplorer() {
  const { hash } = useParams();
  const [copied, setCopied] = useState(false);

  const copyHash = () => {
    navigator.clipboard.writeText(mockCert.contentHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-dp-green/20 bg-dp-green/5 px-4 py-1.5 mb-4">
            <Shield className="h-3 w-3 text-dp-green" />
            <span className="text-xs font-semibold text-dp-green tracking-wider uppercase">Reality Certificate</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Certificate <span className="text-gradient">#{mockCert.tokenId}</span></h1>
          <div className="flex items-center justify-center gap-2">
            <span className="font-mono text-sm text-white/40">{mockCert.contentHash.slice(0, 20)}...{mockCert.contentHash.slice(-8)}</span>
            <button onClick={copyHash} className="p-1 text-white/30 hover:text-dp-green transition-colors">
              {copied ? <Check className="h-3 w-3 text-dp-green" /> : <Copy className="h-3 w-3" />}
            </button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Certificate Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Verification Badge */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 verdict-original">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-dp-green/10 flex items-center justify-center">
                  <Shield className="h-7 w-7 text-dp-green" />
                </div>
                <div>
                  <div className="text-lg font-bold text-dp-green">ORIGINAL VERIFIED</div>
                  <div className="text-sm text-white/40">This content has been verified as authentic and has a valid Reality Certificate on Polygon zkEVM.</div>
                </div>
              </div>
            </motion.div>

            {/* Details Grid */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-6">Certificate Details</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: Hash, label: 'Token ID', value: `#${mockCert.tokenId}` },
                  { icon: Camera, label: 'Device', value: mockCert.deviceId },
                  { icon: Clock, label: 'Captured', value: new Date(mockCert.timestampCaptured).toLocaleString() },
                  { icon: User, label: 'Owner', value: mockCert.ownerEmail },
                  { icon: Link2, label: 'Block', value: `#${mockCert.blockNumber.toLocaleString()}` },
                  { icon: FileText, label: 'Chain', value: 'Polygon zkEVM Testnet' },
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <div className="flex items-center gap-2 text-white/30 mb-1">
                      <item.icon className="h-3 w-3" />
                      <span className="text-xs uppercase tracking-wider">{item.label}</span>
                    </div>
                    <div className="text-sm font-medium text-white/80">{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Metadata */}
              <div className="mt-6">
                <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Capture Metadata</div>
                <div className="code-block">
                  <pre>{JSON.stringify(mockCert.metadata, null, 2)}</pre>
                </div>
              </div>

              {/* Blockchain Link */}
              <div className="mt-6 flex gap-3">
                <a href={`https://cardona-zkevm.polygonscan.com/tx/${mockCert.txHash}`} target="_blank" rel="noopener"
                  className="btn-secondary text-sm">
                  <ExternalLink className="h-4 w-4" /> View on Polygon Explorer
                </a>
              </div>
            </motion.div>

            {/* Audit Trail */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-6">Chain of Custody</h3>
              <div className="space-y-0">
                {auditTrail.map((entry, i) => (
                  <div key={i} className="flex gap-4 pb-6 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div className={`h-3 w-3 rounded-full ${
                        entry.type === 'violation' ? 'bg-dp-amber' :
                        entry.type === 'mint' ? 'bg-dp-green' : 'bg-dp-cyan'
                      }`} />
                      {i < auditTrail.length - 1 && <div className="w-px flex-1 bg-white/10 mt-1" />}
                    </div>
                    <div className="pb-2">
                      <div className="text-sm font-medium text-white/80">{entry.event}</div>
                      <div className="text-xs text-white/30">{entry.actor} • {entry.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: QR + Embed */}
          <div className="space-y-6">
            {/* QR Code */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 text-center">
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-6">Verification QR</h3>
              <div className="relative inline-block">
                <div className="absolute -inset-3 rounded-2xl bg-gradient-to-r from-dp-green via-dp-cyan to-dp-green opacity-20 blur-lg animate-pulse" />
                <div className="relative p-4 rounded-2xl bg-white">
                  <QRCodeSVG value={`https://deepprovenance.io/certificate/${mockCert.contentHash}`} size={180} level="H" includeMargin={false} />
                </div>
              </div>
              <p className="text-xs text-white/30 mt-4">Scan to verify authenticity</p>
            </motion.div>

            {/* Embeddable Badge */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Embeddable Badge</h3>
              {/* Preview */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-dp-green/10 border border-dp-green/20 px-3 py-1.5">
                  <Shield className="h-3.5 w-3.5 text-dp-green" />
                  <span className="text-xs font-semibold text-dp-green">Verified by DeepProvenance</span>
                </div>
              </div>
              {/* Code */}
              <div className="code-block text-xs">
                {`<script src="https://cdn.deepprovenance.io/badge.js"
  data-hash="${mockCert.contentHash.slice(0, 16)}..."
  data-theme="dark">
</script>`}
              </div>
            </motion.div>

            {/* Exposure Score */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6 text-center">
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Exposure Score</h3>
              <div className="relative inline-flex items-center justify-center">
                <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#00FF88" strokeWidth="8"
                    strokeDasharray={`${23 * 2.64} ${264 - 23 * 2.64}`} strokeLinecap="round" />
                </svg>
                <div className="absolute text-2xl font-bold text-dp-green">23</div>
              </div>
              <p className="text-xs text-white/30 mt-3">Low exposure risk</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
