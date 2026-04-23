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
  timestamp: string;
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
  score: number;
  riskLevel: RiskLevel;
  factors: RiskFactor[];
  aiAnalysis?: string;
  timestamp: string;
}
