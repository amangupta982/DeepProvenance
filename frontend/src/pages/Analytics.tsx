import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  BarChart3, TrendingUp, AlertTriangle, Shield, Activity, Eye, Clock, Zap
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Treemap
} from 'recharts';
import { generateMockAlerts } from '@/lib/constants';
import type { LiveAlert } from '@/types';

const detectionData = Array.from({ length: 30 }, (_, i) => ({
  day: `Apr ${i + 1}`,
  fakes: Math.floor(20 + Math.random() * 40),
  verified: Math.floor(80 + Math.random() * 60),
  violations: Math.floor(5 + Math.random() * 15),
}));

const platformData = [
  { name: 'Twitter/X', violations: 245, color: '#00D4FF' },
  { name: 'Instagram', violations: 189, color: '#8B5CF6' },
  { name: 'Facebook', violations: 134, color: '#FFB800' },
  { name: 'TikTok', violations: 98, color: '#FF3366' },
  { name: 'YouTube', violations: 67, color: '#00FF88' },
  { name: 'Reddit', violations: 45, color: '#FF6B35' },
];

const verdictBreakdown = [
  { name: 'Original', value: 45, color: '#00FF88' },
  { name: 'Verified Reuse', value: 25, color: '#00D4FF' },
  { name: 'Unverified Copy', value: 18, color: '#FFB800' },
  { name: 'AI Fake', value: 12, color: '#FF3366' },
];

const severityColors: Record<LiveAlert['severity'], string> = {
  critical: 'text-dp-red border-dp-red/20 bg-dp-red/5',
  warning: 'text-dp-amber border-dp-amber/20 bg-dp-amber/5',
  info: 'text-dp-cyan border-dp-cyan/20 bg-dp-cyan/5',
  success: 'text-dp-green border-dp-green/20 bg-dp-green/5',
};

export default function Analytics() {
  const [alerts, setAlerts] = useState<LiveAlert[]>([]);

  useEffect(() => {
    setAlerts(generateMockAlerts());
    const interval = setInterval(() => {
      const types: LiveAlert['type'][] = ['fake_detected', 'violation', 'certificate_minted', 'verification_complete'];
      const type = types[Math.floor(Math.random() * types.length)];
      const titles: Record<string, string> = {
        fake_detected: 'AI Deepfake Detected — Sports Clip',
        violation: 'Unauthorized Repost Flagged',
        certificate_minted: 'New Reality Certificate Issued',
        verification_complete: 'Content Verified as Authentic',
      };
      const sevs: Record<string, LiveAlert['severity']> = {
        fake_detected: 'critical', violation: 'warning', certificate_minted: 'success', verification_complete: 'info',
      };
      const newAlert: LiveAlert = {
        id: `alert-${Date.now()}`, type, severity: sevs[type],
        title: titles[type], description: `Auto-detected at ${new Date().toLocaleTimeString()}`,
        timestamp: new Date().toISOString(),
      };
      setAlerts((prev) => [newAlert, ...prev].slice(0, 50));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white">Real-time <span className="text-gradient">Analytics</span></h1>
          <p className="text-white/40 mt-1">Live monitoring of content authenticity across platforms</p>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Detection Rate', value: '98.7%', delta: '+2.1%', icon: TrendingUp, color: 'text-dp-green' },
            { label: 'Fakes Caught', value: '3,241', delta: '+127 today', icon: AlertTriangle, color: 'text-dp-red' },
            { label: 'Certificates', value: '12,847', delta: '+89 today', icon: Shield, color: 'text-dp-cyan' },
            { label: 'Avg Response', value: '2.3s', delta: '-0.4s', icon: Clock, color: 'text-dp-amber' },
          ].map((kpi, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                <span className="text-xs text-dp-green">{kpi.delta}</span>
              </div>
              <div className="stat-value text-white">{kpi.value}</div>
              <div className="stat-label">{kpi.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Detection Trend Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 glass-card p-6">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-6">Detection Trend (30 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={detectionData}>
                <defs>
                  <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00FF88" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00FF88" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradRed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF3366" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FF3366" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 10 }} interval={4} />
                <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#12121C', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="verified" stroke="#00FF88" fill="url(#gradGreen)" strokeWidth={2} />
                <Area type="monotone" dataKey="fakes" stroke="#FF3366" fill="url(#gradRed)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Verdict Breakdown */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-6">Verdict Breakdown</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={verdictBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                  {verdictBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#12121C', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {verdictBreakdown.map((v) => (
                <div key={v.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: v.color }} />
                    <span className="text-white/50">{v.name}</span>
                  </div>
                  <span className="font-semibold text-white/70">{v.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Platform Violations */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2 glass-card p-6">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-6">Violations by Platform</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={platformData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis type="number" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 11 }} width={80} />
                <Tooltip contentStyle={{ background: '#12121C', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="violations" radius={[0, 6, 6, 0]}>
                  {platformData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Live Alert Feed */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Live Feed</h3>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-dp-green animate-pulse" />
                <span className="text-xs text-dp-green">Live</span>
              </div>
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {alerts.slice(0, 15).map((alert, i) => (
                <motion.div
                  key={alert.id}
                  initial={i === 0 ? { opacity: 0, x: -10 } : {}}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-3 rounded-lg border text-xs ${severityColors[alert.severity]}`}
                >
                  <div className="font-semibold mb-0.5">{alert.title}</div>
                  <div className="opacity-60">{alert.description}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
