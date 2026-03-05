"use client";

import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';
import { AlertTriangle, Search, TrendingUp, BarChart3, ShieldAlert, Activity } from 'lucide-react';

export default function Home() {
  const [ticker, setTicker] = useState('TSLA');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeStock = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:8000/analyze/${ticker}`);
      if (!response.ok) throw new Error('Failed to fetch analysis');
      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score > 80) return 'text-red-500';
    if (score > 50) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <ShieldAlert className="text-blue-500 h-8 w-8" />
              MarketSentinel <span className="text-blue-500">AI</span>
            </h1>
            <p className="text-slate-400 mt-1">Real-time stock manipulation & anomaly detection</p>
          </div>

          <form onSubmit={analyzeStock} className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4" />
              <input 
                type="text"
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                placeholder="Enter Ticker (e.g. GME)"
                className="bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none w-48 uppercase"
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </form>
        </header>

        {error && (
          <div className="bg-red-950/30 border border-red-900/50 text-red-200 p-4 rounded-xl flex items-center gap-3">
            <AlertTriangle className="h-5 w-5" />
            {error}
          </div>
        )}

        {data && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Stats Overview */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" /> CURRENT PRICE
                </p>
                <h3 className="text-2xl font-bold mt-2">${data.summary.price.toFixed(2)}</h3>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" /> VOLUME
                </p>
                <h3 className="text-2xl font-bold mt-2">{data.summary.volume.toLocaleString()}</h3>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
                  <Activity className="h-4 w-4" /> VOLATILITY
                </p>
                <h3 className="text-2xl font-bold mt-2">{(data.summary.avg_volatility * 100).toFixed(2)}%</h3>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" /> MANIPULATION RISK
                </p>
                <h3 className={`text-2xl font-bold mt-2 ${getRiskColor(data.latest_risk)}`}>
                  {data.latest_risk}%
                </h3>
              </div>
            </div>

            {/* Price & Risk Chart */}
            <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 p-6 rounded-2xl min-h-[400px]">
              <h3 className="text-lg font-semibold mb-6">Price & Risk History (Last 30 Days)</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.history}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#64748b" 
                      fontSize={12} 
                      tickFormatter={(val) => val.split('-').slice(1).join('/')}
                    />
                    <YAxis yAxisId="left" stroke="#64748b" fontSize={12} />
                    <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={12} domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }}
                      itemStyle={{ color: '#3b82f6' }}
                    />
                    <Line yAxisId="left" type="monotone" dataKey="close" stroke="#3b82f6" strokeWidth={2} dot={false} />
                    <Line yAxisId="right" type="monotone" dataKey="manipulation_risk" stroke="#f59e0b" strokeWidth={2} dot={true} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Suspicious Events */}
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <ShieldAlert className="text-red-500 h-5 w-5" />
                Suspicious Events
              </h3>
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {data.suspicious_events.length > 0 ? (
                  data.suspicious_events.map((event: any, idx: number) => (
                    <div key={idx} className="bg-slate-950/50 border-l-4 border-red-500 p-4 rounded-r-lg">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-bold text-slate-300">{event.date}</span>
                        <span className="text-xs font-bold bg-red-950/50 text-red-500 px-2 py-0.5 rounded">
                          {event.manipulation_risk}% RISK
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed italic">
                        "{event.reason}"
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500 italic">
                    No significant anomalies detected in the observation period.
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {!data && !loading && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="bg-slate-900 p-6 rounded-full mb-6">
              <Activity className="h-12 w-12 text-slate-700" />
            </div>
            <h2 className="text-2xl font-bold text-slate-300">Enter a ticker to start analysis</h2>
            <p className="text-slate-500 max-w-md mt-2">
              MarketSentinel AI uses Isolation Forest models and contextual market signals to identify abnormal stock behavior.
            </p>
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0f172a;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
      `}</style>
    </main>
  );
}
