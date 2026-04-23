/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TransactionForm from './components/TransactionForm';
import AssessmentDashboard from './components/AssessmentDashboard';
import { Transaction, AssessmentResult } from './types';
import { evaluateRules } from './lib/fraud-logic';
import { getAIAnalysis } from './services/ai';
import { ShieldCheck } from 'lucide-react';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [activeTab, setActiveTab] = useState('monitoring');

  const handleCheckFraud = async (transaction: Transaction) => {
    setIsLoading(true);
    setResult(null);

    // Artificial delay to simulate processing and show the loading state
    await new Promise(resolve => setTimeout(resolve, 800));

    // Phase 1: Heuristic Engine
    const ruleResult = evaluateRules(transaction);
    setResult({ ...ruleResult, aiAnalysis: "Generating behavioral analysis..." });

    // Phase 2: AI Depth Analysis
    const aiText = await getAIAnalysis(transaction, ruleResult);
    
    setResult({
      ...ruleResult,
      aiAnalysis: aiText
    });
    setIsLoading(false);
  };

  return (
    <div className="h-screen bg-slate-950 flex flex-col overflow-hidden text-slate-200 font-sans selection:bg-brand-blue/30">
      <div className="flex-1 flex flex-col relative bg-bg-deep">
        {/* Immersive Header */}
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-bg-surface/80 backdrop-blur-md shrink-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-blue rounded flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.5)]">
              <ShieldCheck className="text-white" size={20} strokeWidth={2.5} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white uppercase italic">
              CALUS
            </h1>
            <div className="ml-4 px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-400 font-mono tracking-widest uppercase">
              System Secure
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Throughput</div>
              <div className="text-sm font-mono text-brand-blue">14.2k TX/S</div>
            </div>
            <div className="h-8 w-[1px] bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              <span className="text-xs font-medium text-slate-400 italic font-serif">Node: Global-Hub-01</span>
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
          
          <main className="flex-1 flex flex-col min-w-0 bg-bg-deep relative" id="main-content">
            {/* Scrollable Upper Area */}
            <div className="flex-1 overflow-y-auto w-full custom-scrollbar p-6">
              {activeTab === 'monitoring' ? (
                <>
                  {/* Stats Grid */}
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-bg-card border border-white/5 rounded-xl p-4 flex flex-col justify-between h-20">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">Risk Scanned (24h)</span>
                      <div className="flex items-end justify-between">
                        <span className="text-lg font-mono text-white leading-none">1,284,092</span>
                        <span className="text-emerald-500 text-[9px] font-bold font-mono">+12%</span>
                      </div>
                    </div>
                    <div className="bg-bg-card border border-white/5 rounded-xl p-4 flex flex-col justify-between h-20">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">Flagged Anomaly</span>
                      <div className="flex items-end justify-between">
                        <span className="text-lg font-mono text-orange-400 font-bold leading-none">42</span>
                        <span className="text-slate-500 text-[8px] font-medium uppercase opacity-50">Stable</span>
                      </div>
                    </div>
                    <div className="bg-bg-card border border-white/5 rounded-xl p-4 flex flex-col justify-between h-20">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">Fraud Prevented</span>
                      <div className="flex items-end justify-between">
                        <span className="text-lg font-mono text-brand-blue leading-none">$4.2M</span>
                        <span className="text-brand-blue text-[8px] font-bold uppercase opacity-80">High Opt</span>
                      </div>
                    </div>
                    <div className="bg-brand-blue border border-white/20 rounded-xl p-4 flex flex-col justify-between h-20 shadow-[0_0_20px_rgba(37,99,235,0.15)]">
                      <span className="text-[9px] font-bold text-white/70 uppercase tracking-widest leading-none">Model Accuracy</span>
                      <div className="flex items-end justify-between">
                        <span className="text-lg font-mono text-white font-black leading-none">99.98%</span>
                        <span className="text-white/60 text-[8px] font-mono whitespace-nowrap">v4.2.1-STABLE</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-6 items-start">
                    <div className="col-span-12 xl:col-span-5">
                      <TransactionForm onCheck={handleCheckFraud} isLoading={isLoading} />
                    </div>

                    <div className="col-span-12 xl:col-span-7">
                      <AssessmentDashboard result={result} isLoading={isLoading} />
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-10 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
                    <ShieldCheck size={32} className="text-brand-blue opacity-50" />
                  </div>
                  <h2 className="text-xl font-black text-white uppercase tracking-tighter">
                    {activeTab === 'rules' && 'Rules Engine'}
                    {activeTab === 'audit' && 'System Audit Logs'}
                    {activeTab === 'alerts' && 'Security Alert Center'}
                    {activeTab === 'config' && 'Core Configuration'}
                  </h2>
                  <p className="text-slate-500 max-w-sm font-serif italic text-xs leading-relaxed">
                    Accessing Calus secure protocols. Navigation to this module is strictly restricted to authorized entities.
                  </p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-mono text-brand-blue tracking-widest uppercase">
                    Status: Verified Connection
                  </div>
                </div>
              )}
            </div>

            {/* Network Grid Footer */}
            <footer className="h-[188px] border-t border-white/10 bg-black/30 p-6 shrink-0 relative overflow-hidden">
               <div className="grid grid-cols-3 h-full gap-8 relative z-10">
                 <div className="space-y-4">
                   <div className="flex items-center gap-2">
                     <div className="w-1 h-1 rounded-full bg-brand-blue shadow-[0_0_5px_#2563eb]" />
                     <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Live Traffic Distribution</span>
                   </div>
                   <div className="flex flex-col gap-3">
                     {[
                       { label: 'North America', value: 85, color: 'bg-brand-blue' },
                       { label: 'EU Central', value: 64, color: 'bg-emerald-500' },
                       { label: 'Asia Pacific', value: 42, color: 'bg-brand-orange' },
                     ].map(node => (
                       <div key={node.label} className="space-y-1">
                         <div className="flex justify-between text-[9px] font-mono uppercase">
                           <span className="text-slate-600">{node.label}</span>
                           <span className="text-white/40">{node.value}%</span>
                         </div>
                         <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                           <div className={`h-full ${node.color} opacity-60`} style={{ width: `${node.value}%` }} />
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>

                 <div className="col-span-2 border-l border-white/5 pl-8 flex items-center justify-between">
                   <div className="space-y-4 flex-1">
                     <div className="flex items-center gap-2">
                       <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]" />
                       <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Neural Sync Status</span>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                       <div className="bg-white/5 border border-white/5 p-3 rounded-lg">
                         <div className="text-[8px] uppercase text-slate-600 mb-1">Model Latency</div>
                         <div className="text-sm font-mono text-white">0.024 MS</div>
                       </div>
                       <div className="bg-white/5 border border-white/5 p-3 rounded-lg">
                         <div className="text-[8px] uppercase text-slate-600 mb-1">Uptime Node</div>
                         <div className="text-sm font-mono text-emerald-500">99.999%</div>
                       </div>
                     </div>
                   </div>
                   <div className="ml-8 w-24 h-24 border border-brand-blue/20 rounded-full flex items-center justify-center relative">
                     <div className="absolute inset-0 border-2 border-brand-blue/10 border-t-brand-blue/50 rounded-full animate-spin" />
                     <div className="text-center">
                       <div className="text-[8px] text-slate-500 uppercase">Load</div>
                       <div className="text-xs font-black text-brand-blue">OPTIMAL</div>
                     </div>
                   </div>
                 </div>
               </div>
               
               {/* Background visual artifact */}
               <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-blue/5 rounded-full blur-[80px] -mr-32 -mb-32" />
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}
