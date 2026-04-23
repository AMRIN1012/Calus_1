/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import React from 'react';
import { AssessmentResult, RiskLevel } from '../types';
import { AlertCircle, CheckCircle, Info, ChevronDown, Zap, ShieldCheck } from 'lucide-react';

interface Props {
  result: AssessmentResult | null;
  isLoading: boolean;
}

const LEVEL_COLORS: Record<RiskLevel, string> = {
  LOW: 'text-emerald-400',
  MEDIUM: 'text-amber-400',
  HIGH: 'text-brand-orange font-black',
  CRITICAL: 'text-rose-600 font-black',
};

const LEVEL_BGS: Record<RiskLevel, string> = {
  LOW: 'bg-emerald-500/10 border-emerald-500/20',
  MEDIUM: 'bg-amber-500/10 border-amber-500/20',
  HIGH: 'bg-brand-orange/10 border-brand-orange/20',
  CRITICAL: 'bg-rose-600/10 border-rose-600/20',
};

export default function AssessmentDashboard({ result, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 dashboard-card h-full min-h-[500px] border-white/10">
        <div className="w-20 h-20 border-2 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin mb-6 shadow-[0_0_30px_rgba(37,99,235,0.2)]" />
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] animate-pulse">Processing Multi-Layer Intelligence...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center p-12 dashboard-card h-full min-h-[500px] border-dashed border-white/10">
        <div className="w-32 h-32 border border-brand-blue/20 rounded-full flex items-center justify-center animate-pulse mb-8">
          <div className="w-20 h-20 bg-brand-blue/5 rounded-full flex items-center justify-center border border-brand-blue/10">
            <Zap size={32} className="text-brand-blue opacity-30" />
          </div>
        </div>
        <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Awaiting Vector Data</h3>
        <p className="text-slate-600 text-[11px] text-center mt-4 max-w-xs leading-relaxed font-serif italic">
          Submit a new transaction node to initialize the real-time risk assessment hub.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Risk Summary */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`dashboard-card p-6 border border-white/10 relative overflow-hidden ${result.riskLevel !== 'LOW' ? 'shadow-[0_0_50px_rgba(249,115,22,0.1)]' : ''}`}
        id="risk-summary"
      >
        <div className="flex justify-between items-start mb-8">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Vector Assessment Verdict</p>
            <h2 className={`text-4xl font-black flex items-center gap-4 tracking-tighter ${LEVEL_COLORS[result.riskLevel]}`}>
              {result.riskLevel === 'LOW' ? (
                <><CheckCircle className="text-emerald-500" size={32} strokeWidth={3} /> LEGITIMATE</>
              ) : (
                <><AlertCircle className="text-brand-orange" size={32} strokeWidth={3} /> FLAG: {result.riskLevel}</>
              )}
            </h2>
          </div>
          <div className="text-right">
            <div className={`px-3 py-1 rounded border ${LEVEL_BGS[result.riskLevel]} text-[10px] font-black uppercase tracking-widest`}>
              TX-IDENT: #SENT-{Math.floor(Math.random() * 10000)}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-[11px] font-mono tracking-widest">
            <span className="text-slate-500 uppercase font-black">Composite Risk Score</span>
            <span className="text-white font-black">{result.score}% OVER NORM</span>
          </div>
          <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/5 p-0.5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${result.score}%` }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className={`h-full rounded-full ${result.score > 75 ? 'bg-rose-600 shadow-[0_0_15px_rgba(225,29,72,0.5)]' : result.score > 50 ? 'bg-brand-orange shadow-[0_0_15px_rgba(249,115,22,0.5)]' : 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]'}`}
            />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Risk Factors List */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="dashboard-card p-6 min-h-[200px]"
          id="flagged-factors"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-1 rounded-full bg-slate-500" />
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Anomaly Analysis ({result.factors.filter(f => f.level !== 'LOW').length})</h3>
          </div>
          <div className="space-y-4">
            {result.factors.filter(f => f.level !== 'LOW').map((factor) => (
              <div key={factor.id} className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{factor.name}</span>
                  <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded border ${LEVEL_BGS[factor.level]} ${LEVEL_COLORS[factor.level]}`}>{factor.level}</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-400 font-medium">{factor.description}</p>
                <div className="text-[9px] font-mono uppercase bg-black/40 p-1.5 rounded border border-white/5 flex justify-between">
                  <span className="opacity-40">DELTA:</span>
                  <span>{factor.ruleValue} → <span className={LEVEL_COLORS[factor.level]}>{factor.actualValue}</span></span>
                </div>
              </div>
            ))}
            {result.factors.filter(f => f.level !== 'LOW').length === 0 && (
              <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                <ShieldCheck size={24} className="text-emerald-500/20 mb-2" />
                <p className="text-[10px] text-slate-600 uppercase font-black tracking-widest">No anomalies detected</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Neural Link - AI Analysis */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="dashboard-card p-6 bg-[#0a0c14] border-brand-blue/20 flex flex-col"
          id="rule-analysis"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" />
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-brand-blue">Neural-Link Insight (X-AI)</h3>
            </div>
          </div>
          <div className="flex-1 bg-black/40 p-5 rounded-2xl border border-white/5 overflow-y-auto max-h-[400px] shadow-inner custom-scrollbar">
            <div className="markdown-body">
              {result.aiAnalysis?.split('\n').map((line, i) => (
                <p key={i} className="mb-2 leading-relaxed tracking-tight">{line}</p>
              )) || "Generating neural-link synthesis..."}
            </div>
          </div>
          <button className="w-full py-3 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-xl mt-4 hover:bg-slate-200 transition-colors">
            Authorize Node Review
          </button>
        </motion.div>
      </div>
    </div>
  );
}
