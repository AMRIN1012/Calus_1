/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Transaction, AssessmentResult, RiskFactor, RiskLevel } from '../types.js';

const THRESHOLDS = {
  HIGH_AMOUNT: 5000,
  HIGH_FREQUENCY: 5,
  SUSPICIOUS_HOURS: [2, 3, 4, 5], // 2 AM to 5 AM
};

export function evaluateRules(transaction: Transaction): AssessmentResult {
  const factors: RiskFactor[] = [];
  let score = 0;

  // 1. Amount Rule
  if (transaction.amount >= THRESHOLDS.HIGH_AMOUNT) {
    const isCritical = transaction.amount >= 20000;
    factors.push({
      id: 'amount',
      name: 'Amount',
      level: isCritical ? 'CRITICAL' : 'HIGH',
      description: 'Transaction exceeds standard amount limits.',
      ruleValue: `$${THRESHOLDS.HIGH_AMOUNT.toLocaleString()}`,
      actualValue: transaction.amount.toLocaleString(),
    });
    score += isCritical ? 40 : 25;
  } else {
    factors.push({
      id: 'amount',
      name: 'Amount',
      level: 'LOW',
      description: 'Transaction within normal amount limits.',
      ruleValue: `$${THRESHOLDS.HIGH_AMOUNT.toLocaleString()}`,
      actualValue: transaction.amount.toLocaleString(),
    });
  }

  // 2. Frequency Rule
  if (transaction.transactionsIn24h > THRESHOLDS.HIGH_FREQUENCY) {
    factors.push({
      id: 'frequency',
      name: 'Frequency',
      level: 'HIGH',
      description: 'High number of transactions in the last 24 hours.',
      ruleValue: `Max ${THRESHOLDS.HIGH_FREQUENCY}`,
      actualValue: transaction.transactionsIn24h.toString(),
    });
    score += 20;
  } else {
    factors.push({
      id: 'frequency',
      name: 'Frequency',
      level: 'LOW',
      description: 'Transaction frequency is within normal limits.',
      ruleValue: `Max ${THRESHOLDS.HIGH_FREQUENCY}`,
      actualValue: transaction.transactionsIn24h.toString(),
    });
  }

  // 3. Location Rule
  const isInternational = transaction.currentLocation.includes('International');
  const locationChanged = transaction.previousLocation && transaction.currentLocation !== transaction.previousLocation;
  
  if (isInternational) {
    factors.push({
      id: 'location',
      name: 'Location',
      level: 'MEDIUM',
      description: 'Transaction initiated from an international location.',
      ruleValue: 'Domestic Only',
      actualValue: transaction.currentLocation,
    });
    score += 15;
  } else if (locationChanged) {
     factors.push({
      id: 'location',
      name: 'Location',
      level: 'MEDIUM',
      description: 'Location change detected from previous transaction.',
      ruleValue: transaction.previousLocation || 'None',
      actualValue: transaction.currentLocation,
    });
    score += 10;
  } else {
    factors.push({
      id: 'location',
      name: 'Location',
      level: 'LOW',
      description: 'Location matches typical user patterns.',
      ruleValue: transaction.previousLocation || 'Known',
      actualValue: transaction.currentLocation,
    });
  }

  // 4. Time Rule
  const [hours] = transaction.timestamp.split(':').map(Number);
  if (THRESHOLDS.SUSPICIOUS_HOURS.includes(hours)) {
    factors.push({
      id: 'time',
      name: 'Time',
      level: 'MEDIUM',
      description: 'Transaction initiated during unusual hours (2-5 AM).',
      ruleValue: 'Standard hours',
      actualValue: transaction.timestamp,
    });
    score += 15;
  } else {
    factors.push({
      id: 'time',
      name: 'Time',
      level: 'LOW',
      description: 'Transaction time is within normal user activity hours.',
      ruleValue: 'Standard hours',
      actualValue: transaction.timestamp,
    });
  }

  // 5. Device Rule (Simplified for demo)
  if (transaction.deviceType === 'Unknown Device' || transaction.deviceType === 'Public VPN') {
    factors.push({
      id: 'device',
      name: 'Device',
      level: 'HIGH',
      description: 'Suspicious device or network type detected.',
      ruleValue: 'Verified devices',
      actualValue: transaction.deviceType,
    });
    score += 20;
  } else {
    factors.push({
      id: 'device',
      name: 'Device',
      level: 'LOW',
      description: 'Device security check passed.',
      ruleValue: 'Verified devices',
      actualValue: transaction.deviceType,
    });
  }

  // Final score normalization
  const finalScore = Math.min(100, Math.max(0, score));
  let level: RiskLevel = 'LOW';
  if (finalScore > 75) level = 'CRITICAL';
  else if (finalScore > 50) level = 'HIGH';
  else if (finalScore > 25) level = 'MEDIUM';

  return {
    score: finalScore,
    riskLevel: level,
    factors,
    timestamp: new Date().toISOString(),
  };
}
