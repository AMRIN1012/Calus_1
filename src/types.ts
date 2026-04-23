/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Transaction {
  amount: number;
  currentLocation: string;
  previousLocation?: string;
  deviceType: string;
  timestamp: string; // ISO string or HH:mm
  transactionsIn24h: number;
}

export interface RiskFactor {
  id: string;
  name: string;
  level: RiskLevel;
  description: string;
  ruleValue: string;
  actualValue: string;
}

export interface AssessmentResult {
  score: number; // 0-100
  riskLevel: RiskLevel;
  factors: RiskFactor[];
  aiAnalysis?: string;
  timestamp: string;
}

export const DEVICE_OPTIONS = [
  'Desktop',
  'Mobile (iOS)',
  'Mobile (Android)',
  'Tablet',
  'Unknown Device',
] as const;

export const LOCATION_OPTIONS = [
  'Home',
  'Office',
  'Coffee Shop',
  'Airport',
  'International (London)',
  'International (Singapore)',
  'International (New York)',
  'Public VPN',
] as const;
