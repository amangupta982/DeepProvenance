import { Fingerprint, Github, Twitter, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-dp-bg-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-dp-green to-dp-cyan flex items-center justify-center">
                <Fingerprint className="h-4 w-4 text-dp-bg" />
              </div>
              <span className="font-bold text-white">Deep<span className="text-gradient">Provenance</span></span>
            </Link>
            <p className="text-sm text-white/40 leading-relaxed">
              Every pixel has a past. We prove it. AI forgery detection & blockchain provenance for sports media.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2">
              {['Verify Content', 'Creator Dashboard', 'Analytics', 'Demo Mode'].map(item => (
                <li key={item}><a href="#" className="text-sm text-white/40 hover:text-dp-green transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Developers</h4>
            <ul className="space-y-2">
              {['API Documentation', 'SDK Downloads', 'Webhooks', 'Status Page'].map(item => (
                <li key={item}><a href="#" className="text-sm text-white/40 hover:text-dp-green transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Connect</h4>
            <div className="flex gap-3">
              <a href="#" className="h-9 w-9 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-white/40 hover:text-dp-green hover:border-dp-green/30 transition-all">
                <Github className="h-4 w-4" />
              </a>
              <a href="#" className="h-9 w-9 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-white/40 hover:text-dp-green hover:border-dp-green/30 transition-all">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="h-9 w-9 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-white/40 hover:text-dp-green hover:border-dp-green/30 transition-all">
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30">&copy; 2026 DeepProvenance. All rights reserved.</p>
          <p className="text-xs text-white/30">Powered by ViT + Polygon zkEVM</p>
        </div>
      </div>
    </footer>
  );
}
