"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { 
  AlertTriangle, Search, TrendingUp, BarChart3, ShieldAlert, 
  Activity, Info, Cpu, Globe, Zap, ArrowRight, Loader2, Radar, Target, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';

// --- 3D Animated Orb Component ---
function AnimatedOrb() {
  return (
    <Sphere args={[1, 100, 200]} scale={2.4}>
      <MeshDistortMaterial
        color="#3b82f6"
        attach="material"
        distort={0.4}
        speed={1.5}
        roughness={0}
      />
    </Sphere>
  );
}

export default function Home() {
  const [ticker, setTicker] = useState('TSLA');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const analyzeStock = async (e?: React.FormEvent, manualTicker?: string) => {
    if (e) e.preventDefault();
    const searchTicker = manualTicker || ticker;
    if (!searchTicker) return;
    
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:8000/analyze/${searchTicker}`);
      if (!response.ok) throw new Error('Ticker not found or API error');
      const result = await response.json();
      setData(result);
      if (manualTicker) setTicker(manualTicker);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score > 75) return 'text-red-500';
    if (score > 40) return 'text-amber-500';
    return 'text-emerald-500';
  };

  const getRiskBg = (score: number) => {
    if (score > 75) return 'bg-red-500/10 border-red-500/20';
    if (score > 40) return 'bg-amber-500/10 border-amber-500/20';
    return 'bg-emerald-500/10 border-emerald-500/20';
  };

  return (
    <main className="min-h-screen pb-20 selection:bg-blue-500/30 overflow-x-hidden">
      {/* Cinematic Background Layer */}
      <div className="fixed inset-0 -z-10 bg-slate-950" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_-20%,_#1e3a8a33,_transparent_60%)]" />
      <div className="fixed inset-0 -z-10 opacity-30 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Navigation Header */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-slate-950/40 backdrop-blur-2xl py-3 border-b border-white/5' : 'py-8'}`}>
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-12 flex-1">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 cursor-pointer shrink-0"
              onClick={() => {setData(null); window.scrollTo({top: 0, behavior: 'smooth'})}}
            >
              <div className="relative">
                  <div className="absolute inset-0 bg-blue-500 blur-xl opacity-50 animate-pulse" />
                  <div className="bg-blue-600 p-2 rounded-xl relative z-10 shadow-2xl shadow-blue-500/40">
                      <Radar className="text-white h-5 w-5" />
                  </div>
              </div>
              <span className="text-xl font-black uppercase tracking-widest leading-none">
                  Sentinel <span className="text-blue-500">Scan</span>
              </span>
            </motion.div>

            {/* Persistent Search Bar (only when data is loaded) */}
            <AnimatePresence>
              {data && (
                <motion.form 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={(e) => analyzeStock(e)} 
                  className="hidden md:flex items-center flex-1 max-w-sm relative group"
                >
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type="text"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value.toUpperCase())}
                    placeholder="SCAN NEW TICKER..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-xs font-black tracking-widest uppercase outline-none focus:border-blue-500/50 focus:ring-4 ring-blue-500/10 transition-all"
                  />
                  {loading && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-3 w-3 animate-spin text-blue-500" />}
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex gap-10">
                {['Algorithm', 'Documentation', 'API Access'].map((l) => (
                    <a key={l} href={`/${l.toLowerCase().replace(' ', '-')}`} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors">
                        {l}
                    </a>
                ))}
          </motion.div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 pt-32 space-y-12">
        <AnimatePresence mode="wait">
        {data ? (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: "circOut" }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-8"
          >
            
            {/* 3D Visualizer & Main Stats */}
            <div className="lg:col-span-4 glass-card p-10 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-full h-full -z-10 opacity-40">
                   <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                      <ambientLight intensity={0.5} />
                      <pointLight position={[10, 10, 10]} />
                      <Suspense fallback={null}>
                         <AnimatedOrb />
                         <OrbitControls enableZoom={false} />
                      </Suspense>
                   </Canvas>
                </div>

                <div className="flex items-center gap-12">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className={`w-44 h-44 rounded-full border-[8px] flex flex-col items-center justify-center relative shadow-2xl backdrop-blur-3xl ${getRiskBg(data.latest_risk)} transition-all duration-700`}
                    >
                        <div className="absolute inset-0 rounded-full border border-white/5 animate-ping opacity-20" />
                        <span className={`text-4xl font-black tracking-tighter ${getRiskColor(data.latest_risk)}`}>{data.latest_risk}%</span>
                        <span className="text-[10px] font-black opacity-40 uppercase tracking-[0.3em] mt-2">Threat Index</span>
                    </motion.div>
                    
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <h2 className="text-6xl font-black tracking-tighter drop-shadow-2xl">{data.ticker}</h2>
                            <span className="bg-white/5 text-white/40 text-[10px] px-3 py-1.5 rounded-lg font-black tracking-widest uppercase border border-white/5">Surveillance Active</span>
                        </div>
                        <p className="text-slate-400 flex items-center gap-3 text-sm font-bold tracking-wide uppercase opacity-60">
                           <Target className="h-5 w-5 text-blue-500" /> Coordinated Anomaly Target
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-12 w-full md:w-auto relative z-10">
                    <div className="space-y-1">
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Price / Unit</p>
                        <p className="text-3xl font-black">${data.summary.price.toFixed(2)}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Daily Volume</p>
                        <p className="text-3xl font-black">{(data.summary.volume / 1000000).toFixed(1)}M</p>
                    </div>
                    <div className="hidden md:block space-y-1">
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Volatility</p>
                        <p className="text-3xl font-black text-blue-500">{(data.summary.avg_volatility * 100).toFixed(2)}%</p>
                    </div>
                </div>
            </div>

            {/* Tactical Movement Area */}
            <div className="lg:col-span-3 glass-card p-8 min-h-[600px] relative border-white/10 shadow-2xl">
              <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                <div>
                    <h3 className="text-2xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
                      <Activity className="h-6 w-6 text-blue-400" /> Surveillance Trace
                    </h3>
                    <p className="text-[10px] text-slate-500 font-black tracking-[0.2em] mt-1 uppercase">36-Month High-Frequency Variance Analysis</p>
                </div>
                <div className="flex items-center gap-6 bg-slate-950/50 p-3 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-1 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Price Trace</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-1 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]" />
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Threat Index</span>
                    </div>
                </div>
              </div>
              
              <div className="h-[380px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#64748b" 
                      fontSize={10} 
                      fontWeight="bold"
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(val) => val.split('-').slice(1).join('/')}
                      dy={10}
                    />
                    <YAxis yAxisId="left" stroke="#3b82f6" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                    <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} domain={[0, 100]} />
                    
                    <Tooltip 
                      cursor={{ stroke: '#ffffff20', strokeWidth: 1 }}
                      contentStyle={{ 
                        backgroundColor: '#020617', 
                        border: '1px solid #ffffff20', 
                        borderRadius: '12px', 
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                      }}
                      itemStyle={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase' }}
                    />
                    
                    <Area 
                        yAxisId="left" 
                        type="monotone" 
                        dataKey="close" 
                        stroke="#3b82f6" 
                        strokeWidth={4} 
                        fillOpacity={1} 
                        fill="url(#colorPrice)" 
                        filter="url(#glow)"
                        animationDuration={1500}
                    />
                    <Line 
                        yAxisId="right" 
                        type="monotone" 
                        dataKey="manipulation_risk" 
                        stroke="#f59e0b" 
                        strokeWidth={3} 
                        dot={{ r: 4, fill: '#020617', stroke: '#f59e0b', strokeWidth: 2 }} 
                        activeDot={{ r: 6, fill: '#f59e0b', strokeWidth: 0 }}
                        filter="url(#glow)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Tactical Radar Pulse (Volume Shock) */}
              <div className="mt-8 pt-8 border-t border-white/5 h-[300px] w-full relative overflow-hidden">
                {/* Background Radar Scope Texture */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#06b6d405_0%,_transparent_70%)] pointer-events-none" />
                
                <div className="flex items-center justify-between mb-8 relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400 flex items-center gap-3">
                        <Radar className="h-5 w-5 animate-spin-slow" /> Frequency Signature Scan
                    </p>
                    <div className="flex gap-8 text-[9px] font-black uppercase tracking-widest">
                        <span className="text-cyan-400 flex items-center gap-2 font-black tracking-widest uppercase"><div className="w-2 h-2 rounded-full bg-cyan-500 border border-cyan-400/50 shadow-[0_0_8px_#22d3ee40]"/> Baseline Signal</span>
                        <span className="text-magenta-500 flex items-center gap-2 font-black tracking-widest uppercase" style={{color: '#d946ef'}}><div className="w-2.5 h-2.5 rounded-full shadow-[0_0_15px_#d946ef10]" style={{backgroundColor: '#d946ef'}}/> Anomalous Pulse</span>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, left: -20, bottom: 20 }}>
                        <defs>
                            <filter id="magenta-glow">
                                <feGaussianBlur stdDeviation="6" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>
                        <CartesianGrid strokeDasharray="15 15" stroke="#06b6d408" vertical={true} />
                        <XAxis dataKey="date" hide />
                        <YAxis dataKey="rel_volume" hide domain={[0, 'auto']} />
                        <ZAxis dataKey="rel_volume" range={[80, 800]} />
                        <Tooltip 
                            cursor={{ stroke: '#d946ef50', strokeWidth: 1, strokeDasharray: '0' }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    return (
                                        <div className="bg-slate-950/90 border border-magenta-500/30 p-4 rounded-xl backdrop-blur-xl shadow-2xl">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 border-b border-white/5 pb-2">Target Data // {data.date}</p>
                                            <div className="space-y-1.5">
                                                <div className="flex justify-between gap-8">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Intensity</span>
                                                    <span className="text-[10px] font-black text-magenta-400">{parseFloat(data.rel_volume).toFixed(2)}x</span>
                                                </div>
                                                <div className="flex justify-between gap-8">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Status</span>
                                                    <span className={`text-[10px] font-black uppercase ${data.rel_volume > 2.5 ? 'text-red-500' : 'text-cyan-500'}`}>
                                                        {data.rel_volume > 2.5 ? 'Shock Detected' : 'Nominal'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Scatter 
                            data={data.history} 
                            animationBegin={300}
                            animationDuration={2000}
                        >
                            {data.history.map((entry: any, index: number) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={entry.rel_volume > 2.5 ? '#d946ef' : '#06b6d4'} 
                                    filter={entry.rel_volume > 2.5 ? 'url(#magenta-glow)' : 'none'}
                                    stroke={entry.rel_volume > 2.5 ? '#d946ef' : '#06b6d430'}
                                    strokeWidth={entry.rel_volume > 2.5 ? 3 : 1}
                                    opacity={entry.rel_volume > 2.5 ? 1 : 0.2}
                                    className="transition-all duration-300 hover:opacity-100 hover:stroke-white hover:stroke-[2px] cursor-crosshair"
                                />
                            ))}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* High-Impact Alerts */}
            <div className="lg:col-span-1 glass-card p-6 flex flex-col bg-slate-900/60 border-white/5">
                <h3 className="text-xl font-black text-white mb-10 flex items-center gap-3 uppercase tracking-tighter">
                    <ShieldAlert className="text-red-500 h-6 w-6 animate-pulse" /> Threat Intel
                </h3>
                <div className="space-y-6 flex-1 overflow-y-auto pr-3 custom-scrollbar">
                    {data.suspicious_events.length > 0 ? (
                    data.suspicious_events.map((event: any, idx: number) => (
                        <motion.div 
                          key={idx} 
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: idx * 0.1 }}
                          className={`p-5 rounded-2xl border backdrop-blur-2xl transition-all hover:bg-white/5 cursor-default ${getRiskBg(event.manipulation_risk)}`}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-black opacity-40 tracking-[0.2em] uppercase">{event.date}</span>
                                <span className={`text-[10px] font-black px-2.5 py-1 rounded-md ${getRiskColor(event.manipulation_risk)} bg-white/5 border border-white/5`}>
                                    {event.manipulation_risk}% THREAT
                                </span>
                            </div>
                            <p className="text-[13px] text-slate-300 leading-relaxed font-bold tracking-wide italic">
                                "{event.reason}"
                            </p>
                        </motion.div>
                    ))
                    ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center opacity-20">
                        <Eye className="h-12 w-12 mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-[0.4em]">Zero Deviations</p>
                    </div>
                    )}
                </div>
            </div>

          </motion.div>
        ) : (
          /* Cinematic Landing Experience */
          <motion.div 
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 md:py-40 relative"
          >
            {/* 3D Focal Point */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] -z-10 opacity-60">
                <Canvas>
                    <ambientLight intensity={0.4} />
                    <pointLight position={[10, 10, 10]} />
                    <Suspense fallback={null}>
                        <AnimatedOrb />
                    </Suspense>
                </Canvas>
            </div>

            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "circOut" }}
              className="text-center max-w-4xl relative z-10"
            >
                <div className="inline-flex items-center gap-3 px-6 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-12 animate-pulse-slow">
                    <Activity className="h-4 w-4" /> Sentinel AI
                </div>
                <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-10 leading-[0.85] text-white">
                    SILENT <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">SURVEILLANCE</span>
                </h1>
                <p className="text-slate-400 text-lg md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed opacity-80 mb-20">
                    Proprietary high-dimensional anomaly detection identifying coordinated manipulation before market impact.
                </p>
                
                {/* Tactical Search Interface */}
                <form onSubmit={analyzeStock} className="w-full max-w-3xl mx-auto relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] blur opacity-25 group-focus-within:opacity-50 transition-opacity" />
                    <div className="relative bg-slate-950 border border-white/10 rounded-[2rem] p-3 flex items-center gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 h-6 w-6" />
                            <input 
                                type="text"
                                value={ticker}
                                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                                placeholder="INITIALIZE SCAN (E.G. GME, NVDA)..."
                                className="w-full bg-transparent border-none outline-none py-6 pl-16 pr-8 text-xl font-black tracking-[0.2em] uppercase placeholder:text-slate-800 placeholder:tracking-widest"
                            />
                        </div>
                        <button disabled={loading} className="bg-blue-600 hover:bg-blue-500 text-white px-12 py-6 rounded-[1.5rem] font-black uppercase tracking-widest flex items-center gap-4 transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-blue-600/40">
                            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Zap className="h-6 w-6 fill-current" />}
                            {loading ? 'Processing' : 'Execute'}
                        </button>
                    </div>
                </form>

                <div className="mt-16 flex flex-wrap justify-center gap-8 opacity-40">
                    {['NVDA', 'GME', 'BTC-USD', 'TSLA'].map((t) => (
                        <button key={t} onClick={() => analyzeStock(undefined, t)} className="text-xs font-black tracking-[0.3em] uppercase hover:text-blue-500 transition-colors">
                            Scan {t}
                        </button>
                    ))}
                </div>
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>

        {/* Cinematic Infographics Section */}
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-32"
        >
            <div className="relative p-10 glass-card group overflow-hidden border-white/5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[50px] group-hover:bg-blue-600/10 transition-colors" />
                <Cpu className="h-10 w-10 text-blue-500 mb-8" />
                <h4 className="text-xl font-black uppercase tracking-tighter mb-4 text-white">Isolation Inference</h4>
                <p className="text-slate-500 text-sm leading-relaxed font-bold uppercase tracking-tight opacity-70">
                    High-dimensional tree partitioning to isolate suspicious vectors across 36-month datasets.
                </p>
            </div>
            <div className="relative p-10 glass-card group overflow-hidden border-white/5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-600/5 blur-[50px] group-hover:bg-amber-600/10 transition-colors" />
                <Globe className="h-10 w-10 text-amber-500 mb-8" />
                <h4 className="text-xl font-black uppercase tracking-tighter mb-4 text-white">Market Decoupling</h4>
                <p className="text-slate-500 text-sm leading-relaxed font-bold uppercase tracking-tight opacity-70">
                    Real-time covariance checks against SPY index nodes to eliminate market-wide noise.
                </p>
            </div>
            <div className="relative p-10 glass-card group overflow-hidden border-white/5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/5 blur-[50px] group-hover:bg-emerald-600/10 transition-colors" />
                <Info className="h-10 w-10 text-emerald-500 mb-8" />
                <h4 className="text-xl font-black uppercase tracking-tighter mb-4 text-white">Contextual Filter</h4>
                <p className="text-slate-500 text-sm leading-relaxed font-bold uppercase tracking-tight opacity-70">
                    Natural Language verification of news signals and earnings schedules to validate price moves.
                </p>
            </div>
        </motion.div>
      </div>

      {/* Global Quick Access Bar */}
      <div className="max-w-7xl mx-auto px-8 mt-20">
        <div className="glass-card p-6 flex flex-wrap items-center justify-center gap-12 border-blue-500/10 shadow-2xl shadow-blue-950/20">
            <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-xs font-black tracking-[0.4em] text-slate-400 uppercase">Surveillance Hotlinks</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-10">
                {[
                    { t: 'AAPL', n: 'Apple' },
                    { t: 'MSFT', n: 'Microsoft' },
                    { t: 'AMZN', n: 'Amazon' },
                    { t: 'GOOGL', n: 'Alphabet' },
                    { t: 'META', n: 'Meta' }
                ].map((s) => (
                    <button 
                        key={s.t}
                        onClick={() => analyzeStock(undefined, s.t)}
                        className="group flex flex-col items-start transition-all"
                    >
                        <span className="text-sm font-black text-slate-200 group-hover:text-blue-400 transition-colors tracking-widest uppercase">{s.t}</span>
                        <span className="text-[9px] font-bold text-slate-600 group-hover:text-slate-400 transition-colors uppercase tracking-tight">{s.n}</span>
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* Modern High-Tech Footer */}
      <footer className="max-w-7xl mx-auto px-8 mt-40 pb-20 border-t border-white/5 pt-20 flex flex-col items-center text-center">
         <div className="bg-blue-600/10 p-4 rounded-3xl mb-12 text-blue-500 ring-1 ring-blue-500/20">
            <ShieldAlert className="h-12 w-12" />
         </div>
         <p className="text-[10px] font-black tracking-[1em] uppercase text-slate-600 mb-8">Institutional Intelligence Node</p>
         <div className="flex gap-16 text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">
            <a href="/algorithm" className="hover:text-white transition-colors">Protocol</a>
            <a href="/documentation" className="hover:text-white transition-colors">Structure</a>
            <a href="/api-access" className="hover:text-white transition-colors">Interface</a>
         </div>
      </footer>
    </main>
  );
}
