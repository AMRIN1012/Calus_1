/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Shield, MapPin, Smartphone, Clock, RefreshCw } from 'lucide-react';
import { Transaction, DEVICE_OPTIONS, LOCATION_OPTIONS } from '../types';

interface Props {
  onCheck: (transaction: Transaction) => void;
  isLoading: boolean;
}

export default function TransactionForm({ onCheck, isLoading }: Props) {
  const [formData, setFormData] = useState<Transaction>({
    amount: 1500,
    currentLocation: 'Home',
    previousLocation: 'Office',
    deviceType: 'Desktop',
    timestamp: '14:30',
    transactionsIn24h: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCheck(formData);
  };

  return (
    <div className="dashboard-card p-6 shadow-[0_0_40px_rgba(37,99,235,0.05)] border-white/10" id="transaction-input-container">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1.5 h-1.5 rounded-full bg-brand-blue shadow-[0_0_8px_#2563eb]" />
        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Transaction Analysis Layer</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-[10px] font-bold text-slate-500 mb-2 block tracking-widest uppercase opacity-70">
            Transaction Amount (USD)
          </label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
            className="glass-input text-xl font-mono text-white font-bold tracking-tight"
            placeholder="e.g. 5000"
            required
            id="input-amount"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] font-bold text-slate-500 mb-2 block uppercase tracking-widest opacity-70">
              Current Origin
            </label>
            <select
              value={formData.currentLocation}
              onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
              className="glass-input font-mono italic"
              required
              id="input-location"
            >
              {LOCATION_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="bg-bg-card">{opt}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 mb-2 block uppercase tracking-widest opacity-70">
              Pattern Memo
            </label>
            <select
              value={formData.previousLocation}
              onChange={(e) => setFormData({ ...formData, previousLocation: e.target.value })}
              className="glass-input font-mono italic"
              id="input-prev-location"
            >
              <option value="" className="bg-bg-card">No Baseline</option>
              {LOCATION_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="bg-bg-card">{opt}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] font-bold text-slate-500 mb-2 block uppercase tracking-widest opacity-70">
              Device Fingerprint
            </label>
            <select
              value={formData.deviceType}
              onChange={(e) => setFormData({ ...formData, deviceType: e.target.value })}
              className="glass-input font-mono"
              required
              id="input-device"
            >
              {DEVICE_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="bg-bg-card">{opt}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 mb-2 block uppercase tracking-widest opacity-70">
              Vector Timestamp
            </label>
            <input
              type="time"
              value={formData.timestamp}
              onChange={(e) => setFormData({ ...formData, timestamp: e.target.value })}
              className="glass-input font-mono"
              required
              id="input-time"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-500 mb-2 block uppercase tracking-widest opacity-70">
            Node Recurrence (24h)
          </label>
          <input
            type="number"
            value={formData.transactionsIn24h}
            onChange={(e) => setFormData({ ...formData, transactionsIn24h: Number(e.target.value) })}
            className="glass-input font-mono text-brand-blue font-bold"
            min="0"
            id="input-frequency"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full py-4 text-xs tracking-[0.2em] uppercase font-black"
          id="btn-check-fraud"
        >
          {isLoading ? (
            <>
              <RefreshCw className="animate-spin" size={18} />
              SCANNING VECTORS...
            </>
          ) : (
            <>RUN RISK ASSESSMENT</>
          )}
        </button>
      </form>
    </div>
  );
}
