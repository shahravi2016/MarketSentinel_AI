"use client";

import React from 'react';
import { ShieldAlert, BookOpen, Search, Activity, Code, List, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function DocumentationPage() {
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
        <section>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6">Documentation</h1>
            <p className="text-slate-400 text-xl leading-relaxed font-medium">
                Operational guide and technical architecture for the MarketSentinel surveillance engine.
            </p>
        </section>

        <div className="space-y-16">
            <section className="glass-card p-10 border-slate-800">
                <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-blue-500">
                    <Search className="h-6 w-6" /> Data Pipeline
                </h3>
                <div className="space-y-8 text-slate-300">
                    {[
                        { t: 'Ingestion', d: 'High-frequency retrieval of OHLCV data via distributed market nodes.' },
                        { t: 'Feature Scaling', d: 'Transformation of raw prices into relative volume and volatility vectors using Z-score normalization.' },
                        { t: 'Model Inference', d: 'Unsupervised evaluation via Isolation Forest to identify multi-dimensional outliers.' },
                        { t: 'Risk Synthesis', d: 'Weighted aggregation of anomaly scores and contextual market signals.' }
                    ].map((step, i) => (
                        <div key={i} className="flex items-start gap-6 group">
                            <span className="w-10 h-10 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 font-black text-sm shrink-0 group-hover:bg-blue-600/20 transition-colors">
                                0{i+1}
                            </span>
                            <div>
                                <h4 className="font-bold text-lg mb-1 text-slate-200">{step.t}</h4>
                                <p className="text-sm opacity-60 leading-relaxed">{step.d}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section className="glass-card p-8 border-slate-800">
                    <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Activity className="h-5 w-5 text-emerald-500" /> Risk Taxonomy
                    </h4>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                            <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Normal</span>
                            <span className="text-xs text-slate-500 font-bold">0% - 40%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                            <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Unusual</span>
                            <span className="text-xs text-slate-500 font-bold">40% - 75%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
                            <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Extreme</span>
                            <span className="text-xs text-slate-500 font-bold">75% - 100%</span>
                        </div>
                    </div>
                </section>

                <section className="glass-card p-8 border-slate-800">
                    <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Code className="h-5 w-5 text-blue-500" /> Local Instance
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed mb-6">
                        System requirements: Python 3.10+, Node.js 20+.
                    </p>
                    <div className="bg-slate-950 p-5 rounded-2xl font-mono text-[11px] text-blue-400 border border-slate-800/50 shadow-inner">
                        <span className="opacity-40"># Initialize environment</span><br/>
                        pip install -r requirements.txt<br/>
                        npm run platform:init<br/>
                        <span className="opacity-40"># Launch surveillance</span><br/>
                        npm run start:dev
                    </div>
                </section>
            </div>

            <section className="glass-card p-10 border-slate-800 overflow-hidden">
                <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    <List className="h-6 w-6 text-blue-500" /> Response Schema
                </h3>
                <div className="space-y-6">
                    <div className="grid grid-cols-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pb-4 border-b border-slate-800">
                        <span>Attribute</span>
                        <span>Type</span>
                        <span>Definition</span>
                    </div>
                    {[
                        { a: 'latest_risk', t: 'Float', d: 'Primary risk coefficient for current T+0 window.' },
                        { a: 'suspicious_events', t: 'Array', d: 'Collection of identified outliers exceeding 70% confidence.' },
                        { a: 'summary', t: 'Object', d: 'Computed statistics for the requested observation window.' }
                    ].map((row, i) => (
                        <div key={i} className="grid grid-cols-3 text-sm py-2 group">
                            <code className="text-blue-400 font-bold">{row.a}</code>
                            <span className="text-slate-500 italic">{row.t}</span>
                            <span className="text-slate-400 opacity-80">{row.d}</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>

        <footer className="py-20 border-t border-slate-900 text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.8em] text-slate-600 italic">Surveillance Standards v1.0.4-Stable</p>
        </footer>
      </div>
    </main>
  );
}
