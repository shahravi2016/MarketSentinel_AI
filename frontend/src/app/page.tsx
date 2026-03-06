"use client";

import React, { useState, Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { 
  LineChart, Line as RechartsLine, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell
} from 'recharts';
import { AlertTriangle, Search, TrendingUp, BarChart3, ShieldAlert, Activity, Info, X, Zap, Target, Waves, Flame } from 'lucide-react';

// Custom Tooltip for Neural Analysis
const NeuralTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#020617] border border-white/10 p-4 rounded-xl shadow-2xl backdrop-blur-md">
        <p className="text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">{label}</p>
        <div className="space-y-1">
          <p className="text-sm font-bold flex justify-between gap-8">
            <span className="text-blue-400 uppercase tracking-tighter">Price:</span>
            <span className="text-white tabular-nums">${payload[0].value.toFixed(2)}</span>
          </p>
          {payload[1] && (
            <p className="text-sm font-bold flex justify-between gap-8">
              <span className="text-pink-400 uppercase tracking-tighter">Risk:</span>
              <span className="text-white tabular-nums">{payload[1].value.toFixed(1)}%</span>
            </p>
          )}
        </div>
      </div>
    );
  }
  return null;
};

// Custom Tooltip for Volume
const VolumeTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const risk = payload[0].payload.manipulation_risk;
    return (
      <div className="bg-[#020617] border border-white/10 p-4 rounded-xl shadow-2xl">
        <p className="text-[10px] font-black text-slate-500 mb-2 tracking-widest uppercase">{label}</p>
        <div className="space-y-1">
          <p className="text-sm font-bold flex justify-between gap-8">
            <span className="text-slate-400 uppercase">Volume:</span>
            <span className="text-white">{(payload[0].value / 1000000).toFixed(2)}M</span>
          </p>
          <p className="text-sm font-bold flex justify-between gap-8">
            <span className="text-slate-400 uppercase">Status:</span>
            <span className={risk > 70 ? "text-red-500" : "text-emerald-500"}>{risk > 70 ? "ANOMALOUS" : "STABLE"}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

// Custom Tooltip for Stress/Volatility
const StressTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#020617] border border-white/10 p-4 rounded-xl shadow-2xl">
        <p className="text-[10px] font-black text-slate-500 mb-2 uppercase">{label}</p>
        <p className="text-sm font-bold flex justify-between gap-8">
          <span className="text-purple-400 uppercase">Variance:</span>
          <span className="text-white tabular-nums">{(payload[0].value).toFixed(4)}%</span>
        </p>
      </div>
    );
  }
  return null;
};

// Custom Tooltip for Risk Only
const RiskTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#020617] border border-white/10 p-4 rounded-xl shadow-2xl backdrop-blur-md">
        <p className="text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">{label}</p>
        <div className="space-y-1">
          <p className="text-sm font-bold flex justify-between gap-8">
            <span className="text-pink-400 uppercase tracking-tighter">Risk:</span>
            <span className="text-white tabular-nums">{payload[0].value.toFixed(1)}%</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

function Background() {
  const pointsRef = useRef<any>();
  const [positions] = useState(() => {
    const pos = new Float32Array(1500 * 3);
    for (let i = 0; i < 1500; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  });

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.05;
      pointsRef.current.rotation.x = Math.sin(t * 0.1) * 0.1;
    }
  });

  return (
    <group>
      <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial transparent color="#3b82f6" size={0.015} sizeAttenuation={true} depthWrite={false} opacity={0.4} />
      </Points>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
        <planeGeometry args={[50, 50, 50, 50]} />
        <meshBasicMaterial color="#3b82f6" wireframe opacity={0.05} transparent />
      </mesh>
    </group>
  );
}

export default function Home() {
  const [ticker, setTicker] = useState('TSLA');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [investigationReport, setInvestigationReport] = useState<string>('');
  const [investigating, setInvestigating] = useState(false);

  const analyzeStock = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:8000/analyze/${ticker}`);
      if (!response.ok) throw new Error('Terminal Offline');
      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInvestigate = async (event: any) => {
    setSelectedEvent(event);
    setInvestigating(true);
    setInvestigationReport('');
    try {
      const response = await fetch(`http://localhost:8000/investigate/${ticker}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: event.date, data: event })
      });
      const result = await response.json();
      setInvestigationReport(result.report);
    } catch (err) {
      setInvestigationReport("Neural processing failed.");
    } finally {
      setInvestigating(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 8] }}>
          <Background />
        </Canvas>
      </div>

      <div className="relative z-20 max-w-[1600px] mx-auto p-6 md:p-10 flex flex-col min-h-screen gap-8">
        {/* Header */}
        <motion.header className="flex flex-col lg:flex-row items-center justify-between gap-10 border-b border-white/5 pb-8">
          <div className="flex items-center gap-6">
            <div className="relative group cursor-pointer" onClick={() => setData(null)}>
                <div className="absolute -inset-2 bg-blue-600 blur-xl opacity-10 group-hover:opacity-20 transition-opacity" />
                <img src="/logo.png" alt="MarketSentinel AI" className="h-16 w-auto relative z-10" />
            </div>
            <div className="hidden md:block border-l border-white/10 pl-6">
              <h1 className="text-2xl font-black italic tracking-tighter uppercase leading-none">
                MARKET<span className="text-blue-500">SENTINEL</span>
              </h1>
              <p className="text-[9px] font-bold text-slate-500 tracking-[0.4em] uppercase mt-1 italic opacity-50">Surveillance node active</p>
            </div>
          </div>

          {data && (
            <motion.form 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={analyzeStock} 
              className="flex gap-2 bg-slate-900 p-1.5 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-xl"
            >
                <input 
                    type="text"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value.toUpperCase())}
                    placeholder="ASSET ID"
                    className="bg-transparent text-white font-black tracking-widest text-sm outline-none px-6 py-3 w-40"
                />
                <button disabled={loading} className="btn-primary py-3 px-8 rounded-xl font-black text-xs uppercase tracking-widest bg-blue-600 hover:bg-blue-500 transition-colors">
                    {loading ? 'SCANNING...' : 'EXECUTE'}
                </button>
            </motion.form>
          )}
        </motion.header>

        {data ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
            
            <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { l: 'Price Index', v: `$${data.summary.price.toFixed(2)}`, i: TrendingUp, c: 'text-blue-400' },
                    { l: 'Volume Flow', v: `${(data.summary.volume / 1000000).toFixed(1)}M`, i: BarChart3, c: 'text-slate-400' },
                    { l: 'Neural Variance', v: `${(data.summary.avg_volatility * 100).toFixed(2)}%`, i: Waves, c: 'text-purple-400' },
                    { l: 'Risk factor', v: `${data.latest_risk}%`, i: AlertTriangle, c: data.latest_risk > 75 ? 'text-red-500' : 'text-emerald-500' }
                ].map((s, i) => (
                    <div key={i} className="glass-card p-6 border-white/5 bg-slate-900/40 backdrop-blur-md">
                        <p className="text-[9px] font-black text-slate-500 uppercase mb-4 flex items-center gap-2 tracking-widest"><s.i className="h-3 w-3" /> {s.l}</p>
                        <h3 className={`text-3xl font-black italic tracking-tighter tabular-nums ${s.c}`}>{s.v}</h3>
                    </div>
                ))}
            </div>

            {/* Neural Chart */}
            <div className="lg:col-span-8 glass-card p-8 min-h-[500px] border-white/10 bg-slate-900/40 backdrop-blur-md flex flex-col">
                <div className="flex items-center justify-between mb-10">
                    <h3 className="text-[10px] font-black tracking-widest uppercase italic text-slate-400">Neural Frequency Analysis // {ticker}</h3>
                    <div className="flex items-center gap-4 text-[8px] font-black text-slate-500 uppercase tracking-widest">
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500" /> Signal</span>
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse shadow-[0_0_8px_#f472b6]" /> Shock Pulse</span>
                    </div>
                </div>
                <div className="flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.history} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="mainGlow" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                            <XAxis dataKey="date" hide />
                            <YAxis yAxisId="left" hide domain={['auto', 'auto']} />
                            <YAxis yAxisId="right" hide domain={[0, 100]} />
                            <Tooltip content={<NeuralTooltip />} cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '5 5' }} />
                            <Area yAxisId="left" type="monotone" dataKey="close" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#mainGlow)" animationDuration={2000} />
                            <RechartsLine 
                                yAxisId="right"
                                type="monotone" 
                                dataKey="manipulation_risk" 
                                stroke="#f472b6" 
                                strokeWidth={2} 
                                strokeDasharray="5 5"
                                opacity={0.3}
                                dot={(props: any) => (props.payload.manipulation_risk > 75 ? <circle cx={props.cx} cy={props.cy} r={6} fill="#f472b6" stroke="white" strokeWidth={2} className="drop-shadow-[0_0_10px_#f472b6]" /> : null)} 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Shock Events */}
            <div className="lg:col-span-4 space-y-6">
                <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-red-500 italic px-2">High Intensity Events</h3>
                <div className="space-y-3 overflow-y-auto max-h-[450px] pr-2 custom-scrollbar">
                    {data.suspicious_events.map((event: any, i: number) => (
                        <button key={i} onClick={() => handleInvestigate(event)} className="w-full text-left glass-card p-5 hover:bg-white/[0.05] transition-all group border-white/5 overflow-hidden active:scale-95 bg-slate-900/40 backdrop-blur-sm">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-[9px] font-black text-slate-500 tabular-nums">{event.date}</span>
                                <ShieldAlert className="h-3 w-3 text-red-500" />
                            </div>
                            <p className="text-[11px] font-bold text-slate-300 group-hover:text-white leading-relaxed mb-4">{event.reason.split('|')[0]}</p>
                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <span className="text-xl font-black italic tracking-tighter text-blue-500 tabular-nums">{event.manipulation_risk}%</span>
                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1 transition-colors">Forensic Audit <Info className="h-3 w-3" /></span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Risk Probability Trend - NEW GRAPH */}
            <div className="lg:col-span-12 glass-card p-8 border-white/10 min-h-[300px] bg-slate-900/40 backdrop-blur-md">
                <div className="flex items-center justify-between mb-8 text-slate-400">
                    <h3 className="text-[10px] font-black tracking-widest uppercase italic flex items-center gap-3"><AlertTriangle className="h-4 w-4 text-pink-500" /> Risk Probability Trend</h3>
                    <div className="text-[8px] font-black bg-white/5 px-2 py-1 rounded">PROBABILISTIC FORECAST</div>
                </div>
                <div className="h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.history} margin={{ top: 0, right: 0, left: -40, bottom: 0 }}>
                            <defs>
                                <linearGradient id="riskGlow" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f472b6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#f472b6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                            <XAxis dataKey="date" hide />
                            <YAxis hide domain={[0, 100]} />
                            <Tooltip content={<RiskTooltip />} />
                            <Area type="monotone" dataKey="manipulation_risk" stroke="#f472b6" strokeWidth={3} fillOpacity={1} fill="url(#riskGlow)" animationDuration={1800} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Volume Graph */}
            <div className="lg:col-span-6 glass-card p-8 border-white/10 min-h-[350px] bg-slate-900/40 backdrop-blur-md">
                <div className="flex items-center justify-between mb-8 text-slate-400">
                    <h3 className="text-[10px] font-black tracking-widest uppercase italic flex items-center gap-3"><BarChart3 className="h-4 w-4 text-blue-500" /> Volume intensity distribution</h3>
                    <div className="text-[8px] font-black bg-white/5 px-2 py-1 rounded">ACCUMULATION ANALYTICS</div>
                </div>
                <div className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.history} margin={{ top: 0, right: 0, left: -40, bottom: 0 }}>
                            <defs>
                                <linearGradient id="volNormal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                </linearGradient>
                                <linearGradient id="volShock" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#f472b6" stopOpacity={0.8}/>
                                    <stop offset="100%" stopColor="#f472b6" stopOpacity={0.1}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                            <XAxis dataKey="date" hide />
                            <YAxis hide domain={['auto', 'auto']} />
                            <Tooltip content={<VolumeTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                            <Bar dataKey="volume" radius={[4, 4, 0, 0]} barSize={20}>
                                {data.history.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={entry.manipulation_risk > 70 ? 'url(#volShock)' : 'url(#volNormal)'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Stress Heatmap */}
            <div className="lg:col-span-6 glass-card p-8 border-white/10 min-h-[350px] bg-slate-900/40 backdrop-blur-md">
                <div className="flex items-center justify-between mb-8 text-slate-400">
                    <h3 className="text-[10px] font-black tracking-widest uppercase italic flex items-center gap-3"><Flame className="h-4 w-4 text-purple-500" /> Volumetric Stress Heatmap</h3>
                    <div className="text-[8px] font-black bg-white/5 px-2 py-1 rounded">VARIANCE CLUSTERING</div>
                </div>
                <div className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.history} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="stressPulse" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                            <XAxis dataKey="date" hide />
                            <YAxis hide domain={[0, 'auto']} />
                            <Tooltip content={<StressTooltip />} />
                            <Area type="monotone" dataKey="volatility" stroke="#a78bfa" strokeWidth={3} fillOpacity={1} fill="url(#stressPulse)" animationDuration={1500} connectNulls />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center space-y-12">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative"
            >
                <div className="absolute -inset-20 bg-blue-500/20 blur-[120px] rounded-full animate-pulse" />
                <img src="/logo.png" alt="MarketSentinel AI" className="h-40 w-auto relative z-10 drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]" />
            </motion.div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center space-y-4"
            >
              <h2 className="text-5xl font-black italic tracking-tighter text-white uppercase leading-none">
                Initialize <span className="text-blue-500">Surveillance</span>
              </h2>
              <p className="text-xs font-bold text-slate-500 tracking-[0.6em] uppercase italic opacity-60">Neural anomaly detection node</p>
            </motion.div>

            <motion.form 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              onSubmit={analyzeStock} 
              className="w-full max-w-2xl group"
            >
              <div className="relative bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[32px] p-2 pl-8 flex items-center shadow-2xl group-hover:border-blue-500/50 transition-all duration-500 group-hover:shadow-blue-500/10">
                <Search className="text-slate-500 h-6 w-6 group-focus-within:text-blue-500 transition-colors" />
                <input 
                    type="text"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value.toUpperCase())}
                    placeholder="ENTER ASSET TICKER (E.G. TSLA, NVDA)"
                    className="bg-transparent text-white font-black tracking-[0.2em] text-lg outline-none px-6 py-6 w-full placeholder:text-slate-700"
                />
                <button 
                  disabled={loading} 
                  className="bg-blue-600 hover:bg-blue-500 text-white h-16 px-12 rounded-[24px] font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-blue-600/20"
                >
                    {loading ? 'SYNCING...' : 'INITIATE SCAN'}
                </button>
              </div>
              
              <div className="mt-8 flex justify-center gap-8">
                {['Real-time', 'Context Aware', 'Forensic Audit'].map((tag, i) => (
                  <span key={i} className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-blue-500/40" /> {tag}
                  </span>
                ))}
              </div>
            </motion.form>
          </div>
        )}

        <AnimatePresence>
          {selectedEvent && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-50 flex items-center justify-center p-6">
              <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="glass-card max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border-white/10 shadow-2xl bg-slate-950">
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                  <div className="flex items-center gap-6">
                    <div className="p-4 bg-red-600 rounded-2xl shadow-xl"><ShieldAlert className="text-white h-8 w-8" /></div>
                    <div>
                      <h2 className="text-2xl font-black italic uppercase tracking-tight">Forensic Audit Report</h2>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-1 italic">{ticker} // {selectedEvent.date}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedEvent(null)} className="p-3 hover:bg-white/5 rounded-full transition-colors text-slate-500"><X className="h-8 w-8" /></button>
                </div>
                
                <div className="p-12 overflow-y-auto custom-scrollbar flex-1 bg-slate-900/20">
                  {investigating ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-6">
                        <div className="h-16 w-16 border-2 border-blue-500/10 border-t-blue-500 rounded-full animate-spin" />
                        <p className="text-blue-500 font-black tracking-[0.6em] text-[10px] uppercase animate-pulse">Decrypting market signature...</p>
                    </div>
                  ) : (
                    <div className="space-y-12">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { l: 'Price Delta', v: `+${(selectedEvent.price_change * 100).toFixed(2)}%`, c: 'text-blue-400' },
                            { l: 'Shock Ratio', v: `${selectedEvent.rel_volume.toFixed(2)}x`, c: 'text-purple-400' },
                            { l: 'Context Sync', v: selectedEvent.has_news ? 'JUSTIFIED' : 'DECOUPLED', c: selectedEvent.has_news ? 'text-emerald-400' : 'text-red-400' }
                        ].map((item, i) => (
                            <div key={i} className="bg-slate-900/50 p-6 rounded-3xl border border-white/5 shadow-inner backdrop-blur-sm">
                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">{item.l}</p>
                                <p className={`text-2xl font-black italic tracking-tighter leading-none tabular-nums ${item.c}`}>{item.v}</p>
                            </div>
                        ))}
                      </div>
                      <div className="bg-slate-950 border border-white/10 p-10 rounded-[40px] shadow-2xl relative">
                        <div className="prose prose-invert max-w-none text-slate-300 font-medium leading-[1.8] text-lg tracking-tight italic">
                            <ReactMarkdown components={{
                                strong: ({node, ...props}) => <strong className="text-blue-400 font-black not-italic underline decoration-blue-500/30 underline-offset-4" {...props} />,
                                p: ({node, ...props}) => <p className="mb-6" {...props} />,
                                li: ({node, ...props}) => <li className="mb-2 list-disc ml-4" {...props} />
                            }}>
                                {investigationReport}
                            </ReactMarkdown>
                        </div>
                        <Zap className="absolute bottom-10 right-10 h-12 w-12 text-white/5 pointer-events-none" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-10 border-t border-white/5 bg-white/[0.02] flex justify-end">
                  <button onClick={() => setSelectedEvent(null)} className="btn-primary py-4 px-12 text-xs font-black bg-blue-600 rounded-xl hover:bg-blue-500 tracking-widest shadow-2xl shadow-blue-600/20">CLOSE AUDIT</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
