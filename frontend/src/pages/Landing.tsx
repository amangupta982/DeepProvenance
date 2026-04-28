import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Search, Zap, ArrowRight, Fingerprint, Lock, Eye, BarChart3, Globe, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

const stats = [
  { value: 12847, label: 'Certificates Minted', suffix: '' },
  { value: 98.7, label: 'Detection Accuracy', suffix: '%' },
  { value: 3241, label: 'Fakes Caught', suffix: '' },
  { value: 47, label: 'Organizations', suffix: '+' },
];

const features = [
  {
    icon: Eye,
    title: 'AI Forgery Detection',
    description: 'Sports-specific ViT model detects AI-generated fakes that general detectors miss. Grad-CAM heatmaps show exactly which pixels are synthetic.',
    color: 'dp-red',
  },
  {
    icon: Fingerprint,
    title: 'Content DNA Registry',
    description: '768-dimensional visual fingerprints stored in vector DB. Finds matches even after cropping, resizing, or compression.',
    color: 'dp-cyan',
  },
  {
    icon: Lock,
    title: 'Blockchain Provenance',
    description: 'Non-transferable Reality Certificates on Polygon zkEVM. Immutable proof of authenticity at capture time.',
    color: 'dp-green',
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    description: 'Live monitoring dashboard with violation heatmaps, exposure scores, and automated takedown tracking.',
    color: 'dp-amber',
  },
];

const scenarios = [
  {
    verdict: 'ORIGINAL VERIFIED',
    color: '#00FF88',
    bg: 'from-dp-green/10 to-transparent',
    border: 'border-dp-green/20',
    description: 'Official photographer uploads match photo. Certificate minted, blockchain proof generated.',
    icon: Shield,
  },
  {
    verdict: 'VERIFIED REUSE',
    color: '#00D4FF',
    bg: 'from-dp-cyan/10 to-transparent',
    border: 'border-dp-cyan/20',
    description: 'Authorized player reposts same photo. System confirms authorization and authenticity.',
    icon: Search,
  },
  {
    verdict: 'FAKE / AI MANIPULATED',
    color: '#FF3366',
    bg: 'from-dp-red/10 to-transparent',
    border: 'border-dp-red/20',
    description: 'AI-generated fake detected. Grad-CAM reveals synthetic grass texture and ball blur.',
    icon: Zap,
  },
];

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current * 10) / 10);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);

  return <span>{typeof target === 'number' && target % 1 !== 0 ? count.toFixed(1) : Math.floor(count)}{suffix}</span>;
}

export default function Landing() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-glow-green opacity-30" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-dp-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-dp-green/5 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-dp-green/20 bg-dp-green/5 px-4 py-1.5 mb-8">
                <div className="h-2 w-2 rounded-full bg-dp-green animate-pulse" />
                <span className="text-xs font-semibold text-dp-green tracking-wider uppercase">Now protecting 47+ sports organizations</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1] mb-6"
            >
              Every pixel has a past.
              <br />
              <span className="text-gradient">We prove it.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mx-auto max-w-2xl text-lg text-white/50 leading-relaxed mb-10"
            >
              AI-generated fake sports content is indistinguishable from real footage.
              DeepProvenance combines sports-specific AI forgery detection with blockchain-anchored
              Reality Certificates to protect content authenticity.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/verify" className="btn-primary text-base px-8 py-4">
                <Search className="h-5 w-5" />
                Verify Content
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/demo" className="btn-secondary text-base px-8 py-4">
                <Zap className="h-5 w-5" />
                Try Live Demo
              </Link>
            </motion.div>
          </div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {stats.map((stat, i) => (
              <div key={i} className="glass-card p-6 text-center">
                <div className="text-3xl font-bold text-gradient tracking-tight">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-white/40 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Three verdicts. <span className="text-gradient">Zero ambiguity.</span>
            </h2>
            <p className="text-white/40 max-w-xl mx-auto">
              Upload any sports media. Our AI analyzes it against the Content DNA Registry and blockchain records in seconds.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {scenarios.map((scenario, i) => {
              const Icon = scenario.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className={`glass-card-hover p-8 bg-gradient-to-b ${scenario.bg} ${scenario.border}`}
                >
                  <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: `${scenario.color}15` }}>
                    <Icon className="h-6 w-6" style={{ color: scenario.color }} />
                  </div>
                  <div className="text-sm font-bold tracking-wider mb-3" style={{ color: scenario.color }}>
                    {scenario.verdict}
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed">{scenario.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-dp-bg-50" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Built for <span className="text-gradient">sports media</span>
            </h2>
            <p className="text-white/40 max-w-xl mx-auto">
              General deepfake detectors fail on sports content. Our pipeline is trained on sports-specific artifacts.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card-hover p-8 flex gap-5"
                >
                  <div className={`h-12 w-12 shrink-0 rounded-xl bg-${feature.color}/10 flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 text-${feature.color}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-white/40 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-12 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-glow-green opacity-20" />
            <div className="relative">
              <Globe className="h-12 w-12 text-dp-green mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to protect your content?
              </h2>
              <p className="text-white/40 mb-8 max-w-md mx-auto">
                Join 47+ sports organizations already using DeepProvenance to verify and protect their media.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/verify" className="btn-primary px-8 py-3">
                  Start Verifying <ChevronRight className="h-4 w-4" />
                </Link>
                <Link to="/developer" className="btn-secondary px-8 py-3">
                  View API Docs
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
