"use client";

import React from 'react';
import { ShieldAlert, Cpu, Activity, BarChart3, Globe, Zap, ArrowLeft, Target, Layers } from 'lucide-react';

export default function AlgorithmPage() {
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

      <div className="max-w-5xl mx-auto px-6 space-y-24 mt-12">
        <section className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8">Internal <span className="text-blue-500">Algorithm</span></h1>
            <p className="text-slate-400 text-lg leading-relaxed font-medium">
                High-dimensional anomaly detection using unsupervised Isolation Forest models combined with real-time market-wide correlation filters.
            </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="glass-card p-10 border-blue-500/20 shadow-2xl shadow-blue-950/20">
                <div className="bg-blue-600/10 p-4 rounded-2xl w-fit mb-8 text-blue-500 ring-1 ring-blue-500/20">
                    <Target className="h-8 w-8" />
                </div>
                <h3 className="text-3xl font-bold mb-6">Isolation Forest</h3>
                <p className="text-slate-300 leading-relaxed text-[15px] mb-8 opacity-80">
                    A tree-based algorithm designed for outlier detection. It works by randomly partitioning the dataset; anomalies are "closer to the root" because they require fewer splits to be isolated.
                </p>
                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-800">
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Confidence</p>
                        <p className="text-xl font-bold text-blue-500">94.2%</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Inference</p>
                        <p className="text-xl font-bold text-blue-500">&lt; 15ms</p>
                    </div>
                </div>
            </div>

            <div className="glass-card p-10 border-amber-500/20 shadow-2xl shadow-amber-950/10">
                <div className="bg-amber-600/10 p-4 rounded-2xl w-fit mb-8 text-amber-500 ring-1 ring-amber-500/20">
                    <Layers className="h-8 w-8" />
                </div>
                <h3 className="text-3xl font-bold mb-6">Market Alpha Check</h3>
                <p className="text-slate-300 leading-relaxed text-[15px] mb-8 opacity-80">
                    Detects "decoupling" by analyzing the stock's covariance with the S&P 500 (SPY). This filters out market-wide crashes, ensuring we only flag stock-specific manipulation.
                </p>
                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-800">
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Comparison</p>
                        <p className="text-xl font-bold text-amber-500">SPY (Core)</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Sensitivity</p>
                        <p className="text-xl font-bold text-amber-500">Variable</p>
                    </div>
                </div>
            </div>
        </div>

        <section className="glass-card p-12 md:p-16 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[120px] -mr-48 -mt-48 transition-all duration-700 group-hover:bg-blue-600/10" />
            
            <div className="max-w-2xl">
                <h3 className="text-4xl font-bold mb-10 flex items-center gap-4">
                    <BarChart3 className="text-blue-500 h-10 w-10" /> 
                    Vector Logic
                </h3>
                
                <div className="space-y-12">
                    <div className="flex gap-6 items-start">
                        <div className="w-12 h-12 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-center font-black text-blue-500 shrink-0">1</div>
                        <div>
                            <h4 className="text-xl font-bold mb-3 text-slate-200">Price Deviation Index</h4>
                            <p className="text-slate-400 leading-relaxed text-[15px]">The algorithm tracks rolling 36-month daily returns to establish a "normal" range. Movements exceeding 3 standard deviations trigger immediate analysis.</p>
                        </div>
                    </div>

                    <div className="flex gap-6 items-start">
                        <div className="w-12 h-12 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-center font-black text-blue-500 shrink-0">2</div>
                        <div>
                            <h4 className="text-xl font-bold mb-3 text-slate-200">Volume Shock Ratio</h4>
                            <p className="text-slate-400 leading-relaxed text-[15px]">Compares current trading volume against a 30-day moving average. Volume spikes often precede price manipulation in pump-and-dump scenarios.</p>
                        </div>
                    </div>

                    <div className="flex gap-6 items-start">
                        <div className="w-12 h-12 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-center font-black text-blue-500 shrink-0">3</div>
                        <div>
                            <h4 className="text-xl font-bold mb-3 text-slate-200">Contextual Sentiment</h4>
                            <p className="text-slate-400 leading-relaxed text-[15px]">Automatic adjustment of the risk score if real-time news articles or earnings calls coincide with the price movement.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <footer className="py-20 border-t border-slate-900 text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.8em] text-slate-600">Institutional Tech Stack 2026</p>
        </footer>
      </div>
    </main>
  );
}
