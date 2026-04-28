import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, CheckCircle, AlertTriangle, XOctagon, Play, RotateCcw,
  Loader2, Eye, EyeOff, ExternalLink, ChevronRight, Zap, Upload, Cpu, Database, Link2
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { DEMO_SCENARIOS, VERDICT_CONFIG, PROCESSING_STEPS, MOCK_FEATURE_SCORES } from '@/lib/constants';
import type { VerdictType, DemoScenario } from '@/types';

const verdictIcons: Record<VerdictType, typeof Shield> = {
  original: Shield,
  verified_reuse: CheckCircle,
  unverified_copy: AlertTriangle,
  fake: XOctagon,
};

// Demo images - colored placeholder gradients
const demoImages: Record<number, string> = {
  1: 'linear-gradient(135deg, #1a472a 0%, #2d6a4f 50%, #40916c 100%)',
  2: 'linear-gradient(135deg, #1a472a 0%, #2d6a4f 50%, #52b788 100%)',
  3: 'linear-gradient(135deg, #1a472a 0%, #2d6a4f 50%, #74c69d 100%)',
  4: 'linear-gradient(135deg, #6b1d1d 0%, #9b2226 50%, #ae2012 100%)',
};

export default function Demo() {
  const [activeScenario, setActiveScenario] = useState<DemoScenario | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [showResult, setShowResult] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [heatmapOpacity, setHeatmapOpacity] = useState(0.6);

  const runScenario = async (scenario: DemoScenario) => {
    setActiveScenario(scenario);
    setIsRunning(true);
    setShowResult(false);
    setShowHeatmap(false);
    setCurrentStep(-1);

    for (let i = 0; i < PROCESSING_STEPS.length; i++) {
      setCurrentStep(i);
      await new Promise((r) => setTimeout(r, 700 + Math.random() * 500));
    }

    setShowResult(true);
    setIsRunning(false);
  };

  const reset = () => {
    setActiveScenario(null);
    setIsRunning(false);
    setCurrentStep(-1);
    setShowResult(false);
    setShowHeatmap(false);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-dp-amber/20 bg-dp-amber/5 px-4 py-1.5 mb-4">
            <Zap className="h-3 w-3 text-dp-amber" />
            <span className="text-xs font-semibold text-dp-amber tracking-wider uppercase">Interactive Demo</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            See it in <span className="text-gradient">action</span>
          </h1>
          <p className="text-white/40 max-w-lg mx-auto">
            Walk through 4 real-world scenarios showing how DeepProvenance detects fakes and verifies authentic content.
          </p>
        </motion.div>

        {!activeScenario ? (
          /* Scenario Selection */
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {DEMO_SCENARIOS.map((scenario, i) => {
              const config = VERDICT_CONFIG[scenario.expectedVerdict];
              const Icon = verdictIcons[scenario.expectedVerdict];
              return (
                <motion.button
                  key={scenario.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => runScenario(scenario)}
                  className={`glass-card-hover p-6 text-left group ${config.bgClass}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${config.color}15` }}>
                        <Icon className="h-5 w-5" style={{ color: config.color }} />
                      </div>
                      <div>
                        <div className="text-xs font-bold tracking-wider" style={{ color: config.color }}>
                          SCENARIO {scenario.id}
                        </div>
                        <div className="text-sm font-semibold text-white">{scenario.title}</div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-white/20 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-sm text-white/40 mb-4">{scenario.description}</p>
                  {/* Preview bar */}
                  <div className="h-32 rounded-lg overflow-hidden" style={{ background: demoImages[scenario.id] }}>
                    <div className="h-full w-full flex items-center justify-center">
                      <div className="flex items-center gap-2 rounded-full bg-black/40 backdrop-blur-sm px-4 py-2">
                        <Play className="h-4 w-4 text-white" />
                        <span className="text-xs font-medium text-white">Run Scenario</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="badge text-xs" style={{ backgroundColor: `${config.color}10`, color: config.color, borderColor: `${config.color}30` }}>
                      Expected: {config.label}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        ) : (
          /* Active Scenario */
          <div className="max-w-5xl mx-auto">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={reset}
              className="flex items-center gap-2 text-sm text-white/40 hover:text-white mb-6 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Back to scenarios
            </motion.button>

            <div className="grid lg:grid-cols-5 gap-8">
              {/* Left: Image */}
              <div className="lg:col-span-3">
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass-card overflow-hidden">
                  {/* Scenario header */}
                  <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
                    <div>
                      <div className="text-xs text-white/40 mb-0.5">Scenario {activeScenario.id}</div>
                      <div className="text-sm font-semibold text-white">{activeScenario.title}</div>
                    </div>
                    {showResult && (
                      <div className="badge text-xs" style={{
                        backgroundColor: `${VERDICT_CONFIG[activeScenario.expectedVerdict].color}10`,
                        color: VERDICT_CONFIG[activeScenario.expectedVerdict].color,
                        borderColor: `${VERDICT_CONFIG[activeScenario.expectedVerdict].color}30`,
                      }}>
                        {VERDICT_CONFIG[activeScenario.expectedVerdict].label}
                      </div>
                    )}
                  </div>

                  {/* Image area */}
                  <div className="relative aspect-[16/10]" style={{ background: demoImages[activeScenario.id] }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-2">{activeScenario.id === 4 ? '🤖' : '📸'}</div>
                        <div className="text-sm font-medium text-white/80">{activeScenario.id === 4 ? 'AI-Generated Image' : 'Authentic Photo'}</div>
                        <div className="text-xs text-white/40 mt-1">Cricket Match — IPL 2026</div>
                      </div>
                    </div>

                    {/* Heatmap overlay for fake */}
                    {showHeatmap && activeScenario.expectedVerdict === 'fake' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: heatmapOpacity }}
                        className="absolute inset-0 heatmap-overlay"
                        style={{
                          background: `
                            radial-gradient(ellipse at 30% 75%, rgba(255,0,0,0.8) 0%, transparent 35%),
                            radial-gradient(ellipse at 55% 35%, rgba(255,165,0,0.6) 0%, transparent 30%),
                            radial-gradient(ellipse at 75% 65%, rgba(255,255,0,0.5) 0%, transparent 25%),
                            radial-gradient(ellipse at 15% 25%, rgba(255,80,0,0.4) 0%, transparent 20%),
                            radial-gradient(ellipse at 85% 20%, rgba(255,200,0,0.3) 0%, transparent 20%)
                          `,
                        }}
                      />
                    )}

                    {/* Scan line during processing */}
                    {isRunning && <div className="absolute inset-0 scan-overlay overflow-hidden" />}
                  </div>

                  {/* Image controls */}
                  {showResult && activeScenario.expectedVerdict === 'fake' && (
                    <div className="px-6 py-3 border-t border-white/[0.06] flex items-center justify-between">
                      <button
                        onClick={() => setShowHeatmap(!showHeatmap)}
                        className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition-all ${
                          showHeatmap ? 'bg-dp-red/10 text-dp-red border border-dp-red/20' : 'bg-white/5 text-white/50 border border-white/10'
                        }`}
                      >
                        {showHeatmap ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        Toggle Grad-CAM Heatmap
                      </button>
                      {showHeatmap && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-white/30">Opacity</span>
                          <input type="range" min="0" max="1" step="0.05" value={heatmapOpacity}
                            onChange={(e) => setHeatmapOpacity(parseFloat(e.target.value))}
                            className="w-24 accent-dp-red"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Right: Processing + Result */}
              <div className="lg:col-span-2 space-y-6">
                {/* Processing steps */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6">
                  <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4">Analysis Pipeline</h3>
                  <div className="space-y-2">
                    {PROCESSING_STEPS.map((step, i) => {
                      const isActive = i === currentStep;
                      const isComplete = i < currentStep || showResult;
                      const icons = [Upload, Cpu, Database, Eye, Link2, Shield];
                      const StepIcon = icons[i];
                      return (
                        <motion.div
                          key={step.id}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-500 ${
                            isActive ? 'bg-dp-green/5 border border-dp-green/20 text-dp-green' :
                            isComplete ? 'text-dp-green/60' : 'text-white/20'
                          }`}
                        >
                          {isActive ? <Loader2 className="h-4 w-4 animate-spin" /> :
                           isComplete ? <CheckCircle className="h-4 w-4" /> : <StepIcon className="h-4 w-4" />}
                          <span className="text-xs">{step.label}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Verdict */}
                <AnimatePresence>
                  {showResult && activeScenario && (() => {
                    const config = VERDICT_CONFIG[activeScenario.expectedVerdict];
                    const VIcon = verdictIcons[activeScenario.expectedVerdict];
                    const isFake = activeScenario.expectedVerdict === 'fake';
                    return (
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className={`glass-card p-6 ${config.bgClass}`}
                      >
                        <div className="flex items-center gap-3 mb-5">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', delay: 0.2 }}
                            className="h-12 w-12 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: `${config.color}15` }}
                          >
                            <VIcon className="h-6 w-6" style={{ color: config.color }} />
                          </motion.div>
                          <div>
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 }}
                              className="text-sm font-bold tracking-wider"
                              style={{ color: config.color }}
                            >
                              {config.label}
                            </motion.div>
                            <div className="text-xs text-white/40 mt-0.5">{config.description}</div>
                          </div>
                        </div>

                        {/* Scores */}
                        <div className="space-y-3 mb-4">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-white/40">AI Forgery Score</span>
                              <span style={{ color: isFake ? '#FF3366' : '#00FF88' }}>{activeScenario.expectedAiScore}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${activeScenario.expectedAiScore}%` }}
                                transition={{ duration: 1, delay: 0.4 }}
                                className={`h-full rounded-full ${isFake ? 'bg-dp-red' : 'bg-dp-green'}`}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-white/40">Registry Match</span>
                              <span style={{ color: activeScenario.expectedRegistryScore > 50 ? '#00D4FF' : '#FFB800' }}>
                                {activeScenario.expectedRegistryScore}%
                              </span>
                            </div>
                            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${activeScenario.expectedRegistryScore}%` }}
                                transition={{ duration: 1, delay: 0.6 }}
                                className="h-full rounded-full bg-dp-cyan"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Feature breakdown for fakes */}
                        {isFake && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="mb-4 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]"
                          >
                            <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Synthetic Artifact Scores</div>
                            <div className="grid grid-cols-2 gap-2">
                              {Object.entries(MOCK_FEATURE_SCORES).map(([k, v]) => (
                                <div key={k} className="flex items-center justify-between text-xs">
                                  <span className="text-white/40 capitalize">{k}</span>
                                  <div className="flex items-center gap-2">
                                    <div className="w-12 h-1.5 rounded-full bg-white/5 overflow-hidden">
                                      <div className="h-full rounded-full bg-dp-red" style={{ width: `${v}%` }} />
                                    </div>
                                    <span className="font-mono text-dp-red w-8 text-right">{v}%</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {/* Certificate QR for verified */}
                        {!isFake && activeScenario.expectedVerdict !== 'unverified_copy' && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="p-4 rounded-lg bg-white/[0.03] border border-white/[0.06] text-center"
                          >
                            <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Reality Certificate</div>
                            <div className="inline-block p-3 rounded-xl bg-white">
                              <QRCodeSVG value="https://cardona-zkevm.polygonscan.com/tx/0x3a2c8e9f1b" size={100} level="M" />
                            </div>
                            <div className="mt-3 text-xs text-white/40">
                              <span className="font-mono text-dp-green">Token #1247</span> • Minted 14:32:07 UTC
                            </div>
                            <a href="#" className="inline-flex items-center gap-1 mt-2 text-xs text-dp-cyan hover:underline">
                              View on Polygon <ExternalLink className="h-3 w-3" />
                            </a>
                          </motion.div>
                        )}

                        {/* Violation alert for unverified */}
                        {activeScenario.expectedVerdict === 'unverified_copy' && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="p-3 rounded-lg bg-dp-amber/5 border border-dp-amber/20"
                          >
                            <div className="flex items-center gap-2 text-dp-amber text-xs font-semibold mb-1">
                              <AlertTriangle className="h-3 w-3" />
                              Policy Violation Detected
                            </div>
                            <p className="text-xs text-white/40">
                              Automated takedown request initiated. Content owner notified.
                            </p>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })()}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
