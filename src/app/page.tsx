"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
      <div className="min-h-screen spatial-bg text-white flex flex-col overflow-hidden relative selection:bg-teal-500/30">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse delay-75"></div>

      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16 relative z-10">
        
        {/* Left Side: Brand Value Proposition */}
        <div className="flex flex-col gap-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700/60 px-3 py-1.5 rounded-full w-fit mx-auto lg:mx-0 text-xs text-teal-400 font-medium tracking-wide">
            🚀 v1.0 • Agile Workspace Engine Active
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-teal-300 via-emerald-200 to-indigo-400 bg-clip-text text-transparent">
            devChart
          </h1>
          
          <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
            An intuitive Kanban engine engineered for managing club operations, tracking active task deployments, and streamlining developer collaboration in real time.
          </p>
          
          <p className="text-sm font-mono text-teal-500/80 tracking-widest italic uppercase">
            // Have a Nice Time Building...
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-4">
            <Link 
              href="/dashboard" 
              className="px-8 py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold rounded-xl hover:from-teal-500 hover:to-emerald-500 transition duration-300 shadow-lg shadow-teal-900/40 text-center tracking-wide"
            >
              Open Workspace Pipeline
            </Link>
            <Link 
              href="/create-task" 
              className="px-8 py-3.5 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition duration-300 text-center tracking-wide"
            >
              + Deploy New Task
            </Link>
          </div>
        </div>

        {/* Right Side: Modern Geometric Workspace Visualization */}
        <div className="relative flex justify-center items-center lg:justify-end">
          <div className="w-full max-w-[500px] aspect-square relative bg-gradient-to-br from-slate-800/80 to-slate-900/40 border border-slate-700/50 rounded-3xl shadow-2xl p-6 flex flex-col justify-between backdrop-blur-sm group hover:border-teal-500/30 transition duration-500">
            
            {/* Mock Header Row */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/60"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500/60"></span>
                <span className="w-3 h-3 rounded-full bg-green-500/60"></span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">core_sprint_pipeline.json</span>
            </div>

            {/* Decorative Isometric UI Floating Blocks */}
            <div className="flex flex-col gap-4 my-auto relative">
              <div className="bg-slate-950/40 border border-slate-800 p-4 rounded-xl shadow-md transform -translate-x-4 group-hover:-translate-x-2 transition duration-500">
                <div className="w-12 h-2 bg-amber-500/30 rounded-full mb-2"></div>
                <div className="w-full h-3 bg-slate-700 rounded-md mb-1"></div>
                <div className="w-3/4 h-3 bg-slate-800 rounded-md"></div>
              </div>
              
              <div className="bg-gradient-to-r from-teal-950/40 to-slate-950/40 border border-teal-500/20 p-4 rounded-xl shadow-xl transform translate-x-4 group-hover:translate-x-2 transition duration-500 relative z-10">
                <div className="w-16 h-2 bg-teal-500/40 rounded-full mb-2"></div>
                <div className="w-5/6 h-3 bg-slate-700 rounded-md mb-1"></div>
                <div className="w-1/2 h-3 bg-slate-800 rounded-md"></div>
              </div>

              <div className="bg-slate-950/40 border border-slate-800 p-4 rounded-xl shadow-md transform -translate-x-2 group-hover:-translate-x-1 transition duration-500">
                <div className="w-10 h-2 bg-emerald-500/30 rounded-full mb-2"></div>
                <div className="w-11/12 h-3 bg-slate-700 rounded-md mb-1"></div>
                <div className="w-2/3 h-3 bg-slate-800 rounded-md"></div>
              </div>
            </div>

            {/* Mock Status Row */}
            <div className="flex justify-between items-center text-[11px] font-mono text-slate-500 border-t border-slate-800/60 pt-4">
              <span>Status: Synchronized</span>
              <span className="text-teal-400 animate-pulse">● Live Connection</span>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}