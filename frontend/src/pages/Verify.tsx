import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, Search, Shield, AlertTriangle, XOctagon, CheckCircle,
  Eye, EyeOff, Download, Share2, ExternalLink, FileImage, Loader2, Cpu, Database, Link2
} from 'lucide-react';
import { VERDICT_CONFIG, PROCESSING_STEPS, MOCK_FEATURE_SCORES } from '@/lib/constants';
import type { VerdictType, VerificationResult, ProcessingStep } from '@/types';

const verdictIcons: Record<VerdictType, typeof Shield> = {
  original: Shield,
  verified_reuse: CheckCircle,
  unverified_copy: AlertTriangle,
  fake: XOctagon,
};

export default function Verify() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [heatmapOpacity, setHeatmapOpacity] = useState(0.6);

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted.length > 0) {
      const f = accepted[0];
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setResult(null);
      setCurrentStep(-1);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024,
  });

  const runVerification = async () => {
    if (!file) return;
    setIsProcessing(true);
    setResult(null);

    // Simulate processing steps
    for (let i = 0; i < PROCESSING_STEPS.length; i++) {
      setCurrentStep(i);
      await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));
    }

    // Simulate verdict (random for demo, deterministic in demo mode)
    const verdicts: VerdictType[] = ['original', 'verified_reuse', 'unverified_copy', 'fake'];
    const verdict = verdicts[Math.floor(Math.random() * verdicts.length)];
    const isFake = verdict === 'fake';

    setResult({
      taskId: `task_${Date.now()}`,
      status: 'complete',
      verdict,
      aiScore: isFake ? 85 + Math.random() * 12 : 2 + Math.random() * 8,
      registryScore: isFake ? 5 + Math.random() * 15 : 90 + Math.random() * 9,
      ownershipFlag: verdict === 'original' || verdict === 'verified_reuse',
      featureScores: isFake ? MOCK_FEATURE_SCORES : { grass: 2, jerseys: 1, ball: 1, crowd: 0, lighting: 1, hands: 0 },
      certificate: verdict !== 'fake' ? {
        id: 'cert_001', contentHash: '0x7f83b165...4ef4', timestampCaptured: new Date().toISOString(),
        deviceId: 'CANON-EOS-R5-SN4823', ownerId: 'user_001', txHash: '0x3a2c8e...f91d',
        onChainTokenId: 1247, metadata: {}, createdAt: new Date().toISOString(),
      } : undefined,
      processingSteps: PROCESSING_STEPS.map((s, i) => ({
        ...s,
        status: 'complete' as const,
      })),
    });
    setIsProcessing(false);
  };

  const resetUpload = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setCurrentStep(-1);
    setIsProcessing(false);
    setShowHeatmap(false);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">
            Content <span className="text-gradient">Verification</span>
          </h1>
          <p className="text-white/40 max-w-lg mx-auto">
            Upload any sports image to verify its authenticity. Our AI analyzes it against the Content DNA Registry and blockchain records.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: Upload + Image */}
          <div className="lg:col-span-3 space-y-6">
            {!preview ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <div
                  {...getRootProps()}
                  className={`upload-zone min-h-[400px] ${isDragActive ? 'upload-zone-active' : ''}`}
                >
                  <input {...getInputProps()} />
                  <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                    <Upload className="h-8 w-8 text-white/30" />
                  </div>
                  <p className="text-lg font-semibold text-white/60 mb-2">
                    {isDragActive ? 'Drop your image here' : 'Drag & drop sports media'}
                  </p>
                  <p className="text-sm text-white/30">or click to browse • JPG, PNG, WebP up to 50MB</p>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
                {/* Image with heatmap overlay */}
                <div className="glass-card overflow-hidden relative group">
                  <div className="relative">
                    <img src={preview} alt="Uploaded" className="w-full h-auto max-h-[500px] object-cover" />
                    {/* Heatmap overlay */}
                    {showHeatmap && result?.verdict === 'fake' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: heatmapOpacity }}
                        className="absolute inset-0 heatmap-overlay"
                        style={{
                          background: `
                            radial-gradient(ellipse at 30% 70%, rgba(255,0,0,0.7) 0%, transparent 40%),
                            radial-gradient(ellipse at 60% 40%, rgba(255,165,0,0.5) 0%, transparent 35%),
                            radial-gradient(ellipse at 80% 80%, rgba(255,255,0,0.4) 0%, transparent 30%),
                            radial-gradient(ellipse at 20% 30%, rgba(255,100,0,0.3) 0%, transparent 25%)
                          `,
                        }}
                      />
                    )}
                    {/* Scan line effect during processing */}
                    {isProcessing && (
                      <div className="absolute inset-0 scan-overlay overflow-hidden" />
                    )}
                  </div>
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button onClick={resetUpload} className="h-8 w-8 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white transition-colors">
                      <XOctagon className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="p-4 flex items-center justify-between border-t border-white/[0.06]">
                    <div className="flex items-center gap-3">
                      <FileImage className="h-4 w-4 text-white/40" />
                      <span className="text-sm text-white/60 truncate max-w-[200px]">{file?.name}</span>
                      <span className="text-xs text-white/30">{file ? (file.size / 1024 / 1024).toFixed(1) + ' MB' : ''}</span>
                    </div>
                    {result?.verdict === 'fake' && (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setShowHeatmap(!showHeatmap)}
                          className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                            showHeatmap ? 'bg-dp-red/10 text-dp-red border border-dp-red/20' : 'bg-white/5 text-white/50 border border-white/10'
                          }`}
                        >
                          {showHeatmap ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          Grad-CAM
                        </button>
                        {showHeatmap && (
                          <input
                            type="range" min="0" max="1" step="0.05" value={heatmapOpacity}
                            onChange={(e) => setHeatmapOpacity(parseFloat(e.target.value))}
                            className="w-20 accent-dp-red"
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action button */}
                {!result && !isProcessing && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={runVerification}
                    className="btn-primary w-full py-4 text-base"
                  >
                    <Search className="h-5 w-5" />
                    Run Verification Analysis
                  </motion.button>
                )}
              </motion.div>
            )}
          </div>

          {/* Right: Processing Steps + Result */}
          <div className="lg:col-span-2 space-y-6">
            {/* Processing Steps */}
            {(isProcessing || result) && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6">
                <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Analysis Pipeline</h3>
                <div className="space-y-2">
                  {PROCESSING_STEPS.map((step, i) => {
                    const isActive = i === currentStep;
                    const isComplete = i < currentStep || result !== null;
                    const StepIcon = i === 0 ? Upload : i === 1 ? Cpu : i === 2 ? Database : i === 3 ? Eye : i === 4 ? Link2 : Shield;
                    return (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-all duration-500 ${
                          isActive ? 'bg-dp-green/5 border border-dp-green/20 text-dp-green' :
                          isComplete ? 'text-dp-green/60' : 'text-white/20'
                        }`}
                      >
                        {isActive ? (
                          <Loader2 className="h-4 w-4 animate-spin text-dp-green" />
                        ) : isComplete ? (
                          <CheckCircle className="h-4 w-4 text-dp-green/60" />
                        ) : (
                          <StepIcon className="h-4 w-4" />
                        )}
                        <span>{step.label}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Verdict Card */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className={`glass-card p-6 ${result.verdict ? VERDICT_CONFIG[result.verdict].bgClass : ''}`}
                >
                  {result.verdict && (() => {
                    const config = VERDICT_CONFIG[result.verdict];
                    const VIcon = verdictIcons[result.verdict];
                    return (
                      <>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${config.color}15` }}>
                            <VIcon className="h-5 w-5" style={{ color: config.color }} />
                          </div>
                          <div>
                            <div className="text-sm font-bold tracking-wider" style={{ color: config.color }}>
                              {config.label}
                            </div>
                            <div className="text-xs text-white/40">{config.description}</div>
                          </div>
                        </div>

                        {/* Scores */}
                        <div className="space-y-3 mb-4">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-white/40">AI Score</span>
                              <span className={result.aiScore! > 50 ? 'text-dp-red' : 'text-dp-green'}>{result.aiScore?.toFixed(1)}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${result.aiScore}%` }}
                                transition={{ duration: 1, delay: 0.3 }}
                                className={`h-full rounded-full ${result.aiScore! > 50 ? 'bg-dp-red' : 'bg-dp-green'}`}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-white/40">Registry Match</span>
                              <span className={result.registryScore! > 50 ? 'text-dp-green' : 'text-dp-red'}>{result.registryScore?.toFixed(1)}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${result.registryScore}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className={`h-full rounded-full ${result.registryScore! > 50 ? 'bg-dp-cyan' : 'bg-dp-amber'}`}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Feature breakdown for fakes */}
                        {result.verdict === 'fake' && result.featureScores && (
                          <div className="mb-4 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                            <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Artifact Analysis</div>
                            <div className="grid grid-cols-2 gap-2">
                              {Object.entries(result.featureScores).map(([key, val]) => (
                                <div key={key} className="flex items-center justify-between text-xs">
                                  <span className="text-white/40 capitalize">{key}</span>
                                  <span className="font-mono text-dp-red">{val}%</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Certificate info */}
                        {result.certificate && (
                          <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] mb-4">
                            <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Certificate</div>
                            <div className="space-y-1 text-xs">
                              <div className="flex justify-between">
                                <span className="text-white/40">Hash</span>
                                <span className="font-mono text-dp-cyan">{result.certificate.contentHash}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-white/40">Token ID</span>
                                <span className="font-mono text-dp-green">#{result.certificate.onChainTokenId}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-white/40">Device</span>
                                <span className="font-mono text-white/60">{result.certificate.deviceId}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button className="btn-secondary flex-1 !py-2 text-xs">
                            <Download className="h-3 w-3" /> Report
                          </button>
                          <button className="btn-secondary flex-1 !py-2 text-xs">
                            <Share2 className="h-3 w-3" /> Share
                          </button>
                          {result.certificate && (
                            <button className="btn-secondary flex-1 !py-2 text-xs">
                              <ExternalLink className="h-3 w-3" /> Chain
                            </button>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
