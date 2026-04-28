import { motion } from 'framer-motion';
import { useState } from 'react';
import { Code, Copy, Check, Key, Terminal, Globe, Shield, Zap, BookOpen } from 'lucide-react';

const endpoints = [
  { method: 'POST', path: '/api/v1/upload/verify', description: 'Upload image for verification', auth: true },
  { method: 'GET', path: '/api/v1/upload/result/{task_id}', description: 'Poll verification result', auth: true },
  { method: 'POST', path: '/api/v1/upload/mint', description: 'Mint Reality Certificate', auth: true },
  { method: 'GET', path: '/api/v1/certificate/{hash}', description: 'Get certificate details', auth: false },
  { method: 'POST', path: '/api/v1/certificate/{id}/authorize', description: 'Grant access to user', auth: true },
  { method: 'GET', path: '/api/v1/analytics/overview', description: 'Analytics overview', auth: true },
  { method: 'POST', path: '/api/v1/admin/takedown', description: 'Initiate takedown', auth: true },
  { method: 'GET', path: '/api/v1/ml/model-stats', description: 'Model accuracy metrics', auth: false },
];

const curlExample = `curl -X POST https://api.deepprovenance.io/v1/upload/verify \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: multipart/form-data" \\
  -F "file=@sports_photo.jpg" \\
  -F "upload_type=suspicious"`;

const pythonExample = `import deepprovenance

client = deepprovenance.Client(api_key="YOUR_API_KEY")

# Verify an image
result = client.verify("sports_photo.jpg")
print(f"Verdict: {result.verdict}")
print(f"AI Score: {result.ai_score}%")
print(f"Registry Match: {result.registry_score}%")

# Mint a certificate
cert = client.mint(
    file="official_photo.jpg",
    device_id="CANON-R5-SN4823",
)
print(f"Token ID: #{cert.token_id}")
print(f"TX: {cert.tx_hash}")`;

const jsExample = `import { DeepProvenance } from '@deepprovenance/sdk';

const dp = new DeepProvenance({ apiKey: 'YOUR_API_KEY' });

// Verify content
const result = await dp.verify({
  file: imageBuffer,
  uploadType: 'suspicious',
});

console.log(\`Verdict: \${result.verdict}\`);
console.log(\`AI Score: \${result.aiScore}%\`);

// Check certificate
const cert = await dp.getCertificate(contentHash);
console.log(\`Owner: \${cert.ownerEmail}\`);`;

const responseExample = `{
  "task_id": "task_a1b2c3d4",
  "status": "complete",
  "verdict": "fake",
  "ai_score": 92.4,
  "registry_score": 12.1,
  "ownership_flag": false,
  "feature_scores": {
    "grass": 45, "jerseys": 28,
    "ball": 30, "crowd": 25,
    "lighting": 18, "hands": 12
  },
  "heatmap_url": "/api/v1/heatmap/task_a1b2c3d4.png",
  "processing_time_ms": 2340
}`;

export default function Developer() {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'curl' | 'python' | 'javascript'>('curl');

  const copy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const codeExamples = { curl: curlExample, python: pythonExample, javascript: jsExample };

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-dp-cyan/20 bg-dp-cyan/5 px-4 py-1.5 mb-4">
            <Code className="h-3 w-3 text-dp-cyan" />
            <span className="text-xs font-semibold text-dp-cyan tracking-wider uppercase">Developer API</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            Integrate in <span className="text-gradient">minutes</span>
          </h1>
          <p className="text-white/40 max-w-lg mx-auto">
            RESTful API with rate-limited API keys. SDKs for Python and JavaScript. Verify content from any platform.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: API Reference */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Start */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Terminal className="h-5 w-5 text-dp-green" />
                Quick Start
              </h3>
              {/* Tab bar */}
              <div className="flex gap-1 rounded-lg bg-white/5 p-1 mb-4">
                {(['curl', 'python', 'javascript'] as const).map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`flex-1 rounded-md px-3 py-2 text-xs font-medium transition-all ${
                      activeTab === tab ? 'bg-dp-green/10 text-dp-green' : 'text-white/40 hover:text-white'
                    }`}>
                    {tab === 'curl' ? 'cURL' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              <div className="relative">
                <pre className="code-block text-xs leading-relaxed overflow-x-auto">{codeExamples[activeTab]}</pre>
                <button onClick={() => copy(codeExamples[activeTab], -1)}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/5 text-white/30 hover:text-dp-green transition-colors">
                  {copiedIdx === -1 ? <Check className="h-3 w-3 text-dp-green" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
            </motion.div>

            {/* Response Example */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-6">
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Example Response</h3>
              <pre className="code-block text-xs leading-relaxed">{responseExample}</pre>
            </motion.div>

            {/* Endpoints Table */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card overflow-hidden">
              <div className="p-6 border-b border-white/[0.06]">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-dp-cyan" />
                  API Endpoints
                </h3>
              </div>
              <table className="dp-table">
                <thead>
                  <tr>
                    <th>Method</th>
                    <th>Endpoint</th>
                    <th>Description</th>
                    <th>Auth</th>
                  </tr>
                </thead>
                <tbody>
                  {endpoints.map((ep, i) => (
                    <tr key={i}>
                      <td>
                        <span className={`font-mono text-xs font-bold ${
                          ep.method === 'POST' ? 'text-dp-amber' : 'text-dp-green'
                        }`}>{ep.method}</span>
                      </td>
                      <td><span className="font-mono text-xs text-dp-cyan">{ep.path}</span></td>
                      <td><span className="text-xs">{ep.description}</span></td>
                      <td>{ep.auth ? <Key className="h-3 w-3 text-dp-amber" /> : <Globe className="h-3 w-3 text-dp-green" />}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>

          {/* Right: API Key + Rate Limits */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Your API Key</h3>
              <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] font-mono text-xs text-dp-green mb-4 flex items-center justify-between">
                <span>dp_live_a1b2c3d4e5f6...</span>
                <button onClick={() => copy('dp_live_a1b2c3d4e5f6g7h8', -2)} className="text-white/30 hover:text-dp-green">
                  {copiedIdx === -2 ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
              <button className="btn-secondary w-full text-sm">
                <Key className="h-4 w-4" /> Regenerate Key
              </button>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Rate Limits</h3>
              <div className="space-y-4">
                {[
                  { plan: 'Free', limit: '100 req/day', color: 'text-white/50' },
                  { plan: 'Pro', limit: '10,000 req/day', color: 'text-dp-cyan' },
                  { plan: 'Enterprise', limit: 'Unlimited', color: 'text-dp-green' },
                ].map((tier) => (
                  <div key={tier.plan} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <span className="text-sm font-medium text-white/70">{tier.plan}</span>
                    <span className={`text-xs font-mono ${tier.color}`}>{tier.limit}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">SDK Downloads</h3>
              <div className="space-y-2">
                {[
                  { name: 'Python SDK', cmd: 'pip install deepprovenance' },
                  { name: 'JavaScript SDK', cmd: 'npm i @deepprovenance/sdk' },
                ].map((sdk, i) => (
                  <div key={i} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <div className="text-xs font-medium text-white/60 mb-1">{sdk.name}</div>
                    <code className="text-xs font-mono text-dp-green">{sdk.cmd}</code>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
