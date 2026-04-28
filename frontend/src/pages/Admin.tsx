import { motion } from 'framer-motion';
import { useState } from 'react';
import { Shield, AlertTriangle, XOctagon, Eye, CheckCircle, Clock, Filter, Download, MoreHorizontal, Search } from 'lucide-react';

const mockQueue = [
  { id: 'upl_001', file: 'suspicious_match_highlight.jpg', uploader: 'user_392@gmail.com', aiScore: 87, verdict: 'fake' as const, time: '3 min ago', status: 'pending' as const },
  { id: 'upl_002', file: 'ipl_celebration_photo.png', uploader: 'fan_account@twitter.com', aiScore: 4, verdict: 'unverified_copy' as const, time: '8 min ago', status: 'pending' as const },
  { id: 'upl_003', file: 'world_cup_trophy.jpg', uploader: 'news@agency.com', aiScore: 92, verdict: 'fake' as const, time: '15 min ago', status: 'reviewing' as const },
  { id: 'upl_004', file: 'cricket_action_shot.png', uploader: 'unknown_user@mail.com', aiScore: 6, verdict: 'unverified_copy' as const, time: '22 min ago', status: 'pending' as const },
  { id: 'upl_005', file: 'football_goal_replay.mp4', uploader: 'deepfake_bot@suspicious.com', aiScore: 95, verdict: 'fake' as const, time: '31 min ago', status: 'takedown' as const },
  { id: 'upl_006', file: 'tennis_serve_frame.jpg', uploader: 'editor@sports.com', aiScore: 78, verdict: 'fake' as const, time: '45 min ago', status: 'reviewing' as const },
];

const statusStyles = {
  pending: 'badge-amber',
  reviewing: 'badge-cyan',
  takedown: 'badge-red',
  resolved: 'badge-green',
};

const verdictIcons = {
  fake: XOctagon,
  unverified_copy: AlertTriangle,
  original: Shield,
  verified_reuse: CheckCircle,
};

export default function Admin() {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin <span className="text-gradient">Panel</span></h1>
            <p className="text-white/40 mt-1">Review flagged uploads and manage takedowns</p>
          </div>
          <button className="btn-danger text-sm">
            <Download className="h-4 w-4" /> Export Report
          </button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Pending Review', value: '14', icon: Clock, color: 'text-dp-amber', urgent: true },
            { label: 'Active Takedowns', value: '7', icon: XOctagon, color: 'text-dp-red' },
            { label: 'Resolved Today', value: '23', icon: CheckCircle, color: 'text-dp-green' },
            { label: 'Avg Review Time', value: '4.2m', icon: Eye, color: 'text-dp-cyan' },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`stat-card ${stat.urgent ? 'border-dp-amber/20' : ''}`}>
              <stat.icon className={`h-5 w-5 ${stat.color} mb-2`} />
              <div className="stat-value text-white">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Filters + Search */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-card p-4 mb-6 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <input type="text" placeholder="Search uploads..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} className="input-field pl-10" />
          </div>
          <div className="flex gap-2">
            {['all', 'pending', 'reviewing', 'takedown'].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                  filter === f ? 'bg-dp-green/10 text-dp-green border border-dp-green/20' : 'text-white/40 hover:text-white bg-white/5'
                }`}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Queue Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card overflow-hidden">
          <table className="dp-table">
            <thead>
              <tr>
                <th>File</th>
                <th>Uploader</th>
                <th>AI Score</th>
                <th>Verdict</th>
                <th>Status</th>
                <th>Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockQueue
                .filter((item) => filter === 'all' || item.status === filter)
                .map((item) => {
                  const VIcon = verdictIcons[item.verdict];
                  return (
                    <tr key={item.id}>
                      <td><span className="text-sm font-medium text-white/80">{item.file}</span></td>
                      <td><span className="text-xs font-mono">{item.uploader}</span></td>
                      <td>
                        <span className={`font-mono font-semibold ${item.aiScore > 70 ? 'text-dp-red' : item.aiScore > 40 ? 'text-dp-amber' : 'text-dp-green'}`}>
                          {item.aiScore}%
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <VIcon className={`h-3 w-3 ${item.verdict === 'fake' ? 'text-dp-red' : 'text-dp-amber'}`} />
                          <span className="text-xs capitalize">{item.verdict.replace('_', ' ')}</span>
                        </div>
                      </td>
                      <td><span className={statusStyles[item.status]}>{item.status}</span></td>
                      <td><span className="text-xs">{item.time}</span></td>
                      <td>
                        <div className="flex gap-1">
                          <button className="p-1.5 rounded-lg bg-dp-red/10 text-dp-red hover:bg-dp-red/20 transition-colors" title="Takedown">
                            <XOctagon className="h-3 w-3" />
                          </button>
                          <button className="p-1.5 rounded-lg bg-white/5 text-white/40 hover:bg-white/10 transition-colors" title="Review">
                            <Eye className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </motion.div>
      </div>
    </div>
  );
}
