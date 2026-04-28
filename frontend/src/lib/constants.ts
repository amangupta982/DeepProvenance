import type { VerdictType, DemoScenario, LiveAlert } from '@/types';

export const VERDICT_CONFIG: Record<VerdictType, { label: string; color: string; bgClass: string; icon: string; description: string }> = {
  original: {
    label: 'ORIGINAL VERIFIED',
    color: '#00FF88',
    bgClass: 'verdict-original',
    icon: 'shield-check',
    description: 'Uploaded by owner, valid certificate, authentic content',
  },
  verified_reuse: {
    label: 'VERIFIED REUSE',
    color: '#00D4FF',
    bgClass: 'verdict-reuse',
    icon: 'check-circle',
    description: 'Same content, authorized user, not fake',
  },
  unverified_copy: {
    label: 'UNVERIFIED COPY',
    color: '#FFB800',
    bgClass: 'verdict-unverified',
    icon: 'alert-triangle',
    description: 'Real content but unauthorized upload, policy violation',
  },
  fake: {
    label: 'FAKE / AI MANIPULATED',
    color: '#FF3366',
    bgClass: 'verdict-fake',
    icon: 'x-octagon',
    description: 'High forgery score, no registry match, AI-generated content',
  },
};

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 1,
    title: 'Official BCCI Match Photo',
    description: 'Original photo uploaded by the verified BCCI photographer. Certificate minted at 14:32:07 UTC.',
    imageUrl: '/demo/scenario1.jpg',
    expectedVerdict: 'original',
    expectedAiScore: 3,
    expectedRegistryScore: 99,
    isOwner: true,
    isAuthorized: true,
  },
  {
    id: 2,
    title: 'Authorized Player Repost',
    description: 'Team player reposts the same photo with authorization from the original photographer.',
    imageUrl: '/demo/scenario2.jpg',
    expectedVerdict: 'verified_reuse',
    expectedAiScore: 4,
    expectedRegistryScore: 97,
    isOwner: false,
    isAuthorized: true,
  },
  {
    id: 3,
    title: 'Unauthorized Fan Upload',
    description: 'Random user uploads the same photo without authorization. Policy violation detected.',
    imageUrl: '/demo/scenario3.jpg',
    expectedVerdict: 'unverified_copy',
    expectedAiScore: 5,
    expectedRegistryScore: 96,
    isOwner: false,
    isAuthorized: false,
  },
  {
    id: 4,
    title: 'AI-Generated Fake',
    description: 'AI-generated fake of the same cricket scene. Synthetic artifacts detected in grass, ball blur, and crowd.',
    imageUrl: '/demo/scenario4.jpg',
    expectedVerdict: 'fake',
    expectedAiScore: 92,
    expectedRegistryScore: 12,
    isOwner: false,
    isAuthorized: false,
  },
];

export const PROCESSING_STEPS = [
  { id: 'upload', label: 'Uploading media...' },
  { id: 'extract', label: 'Extracting visual DNA features...' },
  { id: 'registry', label: 'Searching Content DNA Registry...' },
  { id: 'forgery', label: 'Running AI forgery detector...' },
  { id: 'blockchain', label: 'Consulting blockchain records...' },
  { id: 'verdict', label: 'Computing final verdict...' },
];

export function generateMockAlerts(): LiveAlert[] {
  const types: LiveAlert['type'][] = ['fake_detected', 'violation', 'certificate_minted', 'verification_complete'];
  const titles: Record<LiveAlert['type'], string[]> = {
    fake_detected: ['AI-Generated Image Detected — Cricket Match', 'Deepfake Alert — Football Highlight Reel', 'Synthetic Content — Tennis Rally Clip'],
    violation: ['Unauthorized Repost — IPL Final Photo', 'Policy Violation — Premier League Goal', 'Copyright Flag — Olympic Ceremony'],
    certificate_minted: ['New Certificate — FIFA World Cup Frame', 'Reality Certificate — NBA Dunk Sequence', 'Certificate Issued — F1 Podium Shot'],
    verification_complete: ['Verification Complete — Authentic Content', 'Scan Complete — Original Verified', 'Analysis Done — No Tampering Found'],
  };
  const severities: Record<LiveAlert['type'], LiveAlert['severity']> = {
    fake_detected: 'critical',
    violation: 'warning',
    certificate_minted: 'success',
    verification_complete: 'info',
  };

  return Array.from({ length: 20 }, (_, i) => {
    const type = types[Math.floor(Math.random() * types.length)];
    const titleArr = titles[type];
    return {
      id: `alert-${i}`,
      type,
      severity: severities[type],
      title: titleArr[Math.floor(Math.random() * titleArr.length)],
      description: `Automated detection at ${new Date(Date.now() - i * 45000).toLocaleTimeString()}`,
      timestamp: new Date(Date.now() - i * 45000).toISOString(),
    };
  });
}

export const MOCK_FEATURE_SCORES = {
  grass: 45,
  jerseys: 28,
  ball: 30,
  crowd: 25,
  lighting: 18,
  hands: 12,
};
