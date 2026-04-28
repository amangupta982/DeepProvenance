import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield, Search, LayoutDashboard, BarChart3,
  FileCode2, Menu, X, Fingerprint, Zap
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { path: '/verify', label: 'Verify', icon: Search },
  { path: '/demo', label: 'Demo', icon: Zap },
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/developer', label: 'API', icon: FileCode2 },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-dp-bg/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-dp-green to-dp-cyan">
              <Fingerprint className="h-5 w-5 text-dp-bg" />
              <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-br from-dp-green to-dp-cyan opacity-0 blur-md transition-opacity group-hover:opacity-40" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white">
                Deep<span className="text-gradient">Provenance</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive ? 'text-dp-green' : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-dp-green"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-dp-green/20 bg-dp-green/5 px-3 py-1.5">
              <div className="h-2 w-2 rounded-full bg-dp-green animate-pulse" />
              <span className="text-xs font-medium text-dp-green">Live</span>
            </div>
            <Link to="/verify" className="btn-primary text-sm !px-4 !py-2">
              <Shield className="h-4 w-4" />
              Verify Now
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-white/60 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t border-white/[0.06] bg-dp-bg/95 backdrop-blur-xl px-4 pb-4"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium ${
                  isActive ? 'text-dp-green bg-dp-green/5' : 'text-white/60'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          <Link to="/verify" onClick={() => setMobileOpen(false)} className="btn-primary w-full mt-3 text-sm">
            <Shield className="h-4 w-4" /> Verify Now
          </Link>
        </motion.div>
      )}
    </nav>
  );
}
