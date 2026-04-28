// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DeepProvenance — TypeScript Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type VerdictType = 'original' | 'verified_reuse' | 'unverified_copy' | 'fake';

export type UploadType = 'official' | 'reuse' | 'suspicious';

export type UserRole = 'photographer' | 'broadcaster' | 'agency' | 'admin';

export type ViolationStatus = 'pending' | 'takedown' | 'resolved';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  deviceId?: string;
  createdAt: string;
}

export interface Certificate {
  id: string;
  contentHash: string;
  timestampCaptured: string;
  deviceId: string;
  ownerId: string;
  ownerEmail?: string;
  txHash: string;
  onChainTokenId?: number;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface Upload {
  id: string;
  uploaderId: string;
  filePath: string;
  fileHash: string;
  uploadType: UploadType;
  verdict?: VerdictType;
  aiScore?: number;
  registryMatchId?: string;
  createdAt: string;
}

export interface Violation {
  id: string;
  uploadId: string;
  certificateId: string;
  violatorId: string;
  reportedAt: string;
  status: ViolationStatus;
}

export interface VerificationResult {
  taskId: string;
  status: 'pending' | 'processing' | 'complete' | 'failed';
  verdict?: VerdictType;
  aiScore?: number;
  registryScore?: number;
  ownershipFlag?: boolean;
  heatmapUrl?: string;
  featureScores?: FeatureScores;
  certificate?: Certificate;
  processingSteps?: ProcessingStep[];
}

export interface FeatureScores {
  grass: number;
  jerseys: number;
  ball: number;
  crowd: number;
  lighting: number;
  hands: number;
}

export interface ProcessingStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'complete';
  detail?: string;
}

export interface AnalyticsOverview {
  totalCertificates: number;
  totalVerifications: number;
  fakesDetected: number;
  violationsReported: number;
  detectionRate: number;
  avgConfidence: number;
}

export interface AuditEntry {
  id: string;
  eventType: string;
  actorId: string;
  actorEmail?: string;
  resourceId: string;
  resourceType: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface DemoScenario {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  expectedVerdict: VerdictType;
  expectedAiScore: number;
  expectedRegistryScore: number;
  isOwner: boolean;
  isAuthorized: boolean;
}

export interface LiveAlert {
  id: string;
  type: 'fake_detected' | 'violation' | 'certificate_minted' | 'verification_complete';
  severity: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface ModelStats {
  version: string;
  f1Score: number;
  aucRoc: number;
  precision: number;
  recall: number;
  totalPredictions: number;
  lastUpdated: string;
}
