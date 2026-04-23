import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { AlertCircle, CheckCircle, Clock, Shield } from 'lucide-react';

interface LogEntry {
  id: string;
  score: number;
  riskLevel: string;
  transactionAmount: number;
  transactionLocation: string;
  transactionDevice: string;
  timestamp: string;
}

export default function AuditLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/history');
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // Poll every 30 seconds for new events
    const interval = setInterval(fetchLogs, 30000);
    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'text-red-500';
      case 'HIGH': return 'text-orange-500';
      case 'MEDIUM': return 'text-yellow-500';
      default: return 'text-emerald-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-tighter">System Audit Logs</h2>
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Real-time persistence layer active</p>
        </div>
        <button 
          onClick={fetchLogs}
          className="px-3 py-1 bg-white/5 border border-white/10 rounded flex items-center gap-2 text-[10px] uppercase font-bold text-slate-400 hover:bg-white/10 transition-colors"
        >
          <Clock size={12} /> Refresh
        </button>
      </div>

      <div className="overflow-hidden border border-white/5 rounded-xl bg-bg-surface/50 backdrop-blur-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Time</th>
              <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Entity</th>
              <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location</th>
              <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount</th>
              <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Score</th>
              <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-slate-500 font-serif italic text-xs">
                  No transaction records found in nodes. Initiate a scan to begin data persistence.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={log.id} 
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-[10px] text-slate-400">{log.timestamp}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                       <Shield size={12} className="text-brand-blue" />
                       <span className="text-xs font-bold text-white tracking-tight">{log.transactionDevice}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-300">{log.transactionLocation}</td>
                  <td className="px-4 py-3 font-mono text-xs text-white">${log.transactionAmount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${log.score > 70 ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'} border border-current/20`}>
                      {log.score}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className={`flex items-center justify-end gap-1.5 text-[9px] font-black uppercase ${getRiskColor(log.riskLevel)}`}>
                      {log.riskLevel === 'CRITICAL' || log.riskLevel === 'HIGH' ? <AlertCircle size={10} /> : <CheckCircle size={10} />}
                      {log.riskLevel}
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
