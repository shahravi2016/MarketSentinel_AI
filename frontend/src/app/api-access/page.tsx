"use client";

import React from 'react';
import { ShieldAlert, Terminal, Lock, Globe, Key, Copy, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ApiAccessPage() {
  return (
    <main className="min-h-screen pb-20 relative selection:bg-blue-500/30">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950" />
      <div className="fixed inset-0 -z-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />

      <nav className="max-w-7xl mx-auto px-6 py-12 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 group hover:opacity-80 transition-opacity">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <ShieldAlert className="text-white h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight uppercase">MarketSentinel <span className="text-blue-500">AI</span></span>
        </a>
        <a href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-blue-500 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Terminal
        </a>
      </nav>

      <div className="max-w-4xl mx-auto px-6 space-y-20 mt-12">
        <section className="text-center">
            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">API <span className="text-blue-500">Access</span></h1>
            <p className="text-slate-400 text-xl leading-relaxed max-w-2xl mx-auto font-medium">
                Programmatic integration for institutional trading systems and high-frequency surveillance.
            </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 border-slate-800 flex flex-col items-center text-center group hover:border-blue-500/30 transition-colors">
                <div className="bg-blue-600/10 p-4 rounded-2xl mb-6 text-blue-500 ring-1 ring-blue-500/20">
                    <Lock className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-bold mb-2">Auth v2</h4>
                <p className="text-xs text-slate-500 leading-relaxed uppercase tracking-tighter">HMAC-SHA256 Signed Requests</p>
            </div>
            <div className="glass-card p-8 border-slate-800 flex flex-col items-center text-center group hover:border-emerald-500/30 transition-colors">
                <div className="bg-emerald-600/10 p-4 rounded-2xl mb-6 text-emerald-500 ring-1 ring-emerald-500/20">
                    <Globe className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-bold mb-2">Edge Sync</h4>
                <p className="text-xs text-slate-500 leading-relaxed uppercase tracking-tighter">12 Global Ingestion Nodes</p>
            </div>
            <div className="glass-card p-8 border-slate-800 flex flex-col items-center text-center group hover:border-amber-500/30 transition-colors">
                <div className="bg-amber-600/10 p-4 rounded-2xl mb-6 text-amber-500 ring-1 ring-amber-500/20">
                    <Terminal className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-bold mb-2">Webhooks</h4>
                <p className="text-xs text-slate-500 leading-relaxed uppercase tracking-tighter">&lt; 50ms Alert Latency</p>
            </div>
        </div>

        <section className="space-y-10">
            <div className="flex items-center gap-6">
                <h3 className="text-2xl font-bold text-slate-200">Main Endpoint</h3>
                <div className="h-px flex-1 bg-slate-900" />
            </div>

            <div className="glass-card overflow-hidden border-slate-800 shadow-2xl">
                <div className="bg-slate-900/80 p-5 flex items-center justify-between border-b border-slate-800 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <span className="bg-emerald-500/10 text-emerald-500 text-[11px] font-black px-3 py-1 rounded-lg border border-emerald-500/20 tracking-widest">GET</span>
                        <code className="text-sm font-bold text-slate-300">/analyze/&#123;ticker&#125;</code>
                    </div>
                </div>
                <div className="p-8 space-y-6">
                    <p className="text-[15px] text-slate-400 leading-relaxed font-medium">
                        Returns a high-density JSON object containing the latest Risk Index, historical anomalies, and summary statistics for any global ticker.
                    </p>
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-10 group-hover:opacity-20 transition-opacity" />
                        <pre className="relative bg-slate-950 p-6 rounded-2xl font-mono text-xs text-blue-400 overflow-x-auto border border-slate-800/50 leading-loose">
{`# Execute remote surveillance call
curl -X GET "https://api.marketsentinel.ai/v1/analyze/TSLA" \\
     -H "X-API-KEY: YOUR_DEVELOPER_KEY" \\
     -H "Accept: application/json"`}
                        </pre>
                        <button className="absolute top-6 right-6 text-slate-600 hover:text-white transition-colors">
                            <Copy className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <section className="glass-card p-12 border-blue-500/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
                <div className="space-y-6 text-center md:text-left">
                    <h3 className="text-3xl font-bold tracking-tight">Generate Key</h3>
                    <p className="text-[15px] text-slate-400 max-w-md leading-relaxed">
                        Public researcher keys are available instantly. For commercial-grade high-throughput keys, please contact our institutional desk.
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-2 font-black text-[10px] tracking-widest text-emerald-500 uppercase">
                        <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> No Credit Card</span>
                        <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Instant Activation</span>
                    </div>
                </div>
                <button className="btn-primary py-4 px-10 flex items-center gap-3 whitespace-nowrap shadow-2xl shadow-blue-600/40 text-base">
                    <Key className="h-5 w-5" /> Create API Key
                </button>
            </div>
        </section>

        <footer className="py-20 border-t border-slate-900 text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.8em] text-slate-600 italic">API Gateway Infrastructure 2026</p>
        </footer>
      </div>
    </main>
  );
}
