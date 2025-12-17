import React, { useState } from 'react';
import { AcademicDocument } from '../types';
import { SettingsModal } from './SettingsModal';

interface DashboardProps {
  documents: AcademicDocument[];
  onOpenDocument: (doc: AcademicDocument) => void;
  onCreateDocument: (type: 'blank' | 'literature' | 'data' | 'audit' | 'grant' | 'thesis' | 'conference') => void;
  onDeleteDocument: (e: React.MouseEvent, id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ documents, onOpenDocument, onCreateDocument, onDeleteDocument }) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="h-screen w-full bg-[#0B0F17] flex flex-col font-sans text-slate-300 relative overflow-y-auto scroll-smooth">
      
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}

      {/* Arka plan dekorasyonu */}
      <div className="fixed top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none z-0"></div>

      {/* NAV - Yapışkan */}
      <nav className="w-full px-6 md:px-12 py-6 flex justify-between items-center border-b border-white/5 bg-[#0B0F17]/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-4">
            <div className="w-2 h-8 bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.8)]"></div>
            <div>
                <h1 className="font-mono text-xl font-bold tracking-widest text-white">AGENT<span className="text-cyan-500">.OS</span></h1>
                <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">System Core v3.0</p>
            </div>
        </div>
        <button 
            onClick={() => setShowSettings(true)}
            className="w-10 h-10 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
        >
            <span className="material-symbols-rounded">settings</span>
        </button>
      </nav>

      {/* Ana İçerik Alanı */}
      <main className="flex-1 max-w-[1400px] mx-auto w-full px-6 md:px-12 py-12 relative z-10">
        
        {/* HERO */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
            <div className="max-w-3xl">
                <h2 className="text-sm font-mono text-cyan-500 mb-3 tracking-[0.3em] uppercase">/// Operasyonel Kontrol</h2>
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-[1.1]">
                    AKADEMİK <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">PROTOKOL BAŞLATIN</span>
                </h1>
                <p className="text-slate-400 text-lg md:text-xl font-light border-l-2 border-slate-700 pl-6 leading-relaxed">
                    Yapay zeka modellerini akademik iş akışlarınıza entegre edin. Bir şablon seçerek operasyonu başlatın.
                </p>
            </div>
            
            <button 
                onClick={() => onCreateDocument('blank')}
                className="w-full md:w-auto group flex items-center justify-center gap-4 px-12 py-6 bg-white text-black hover:bg-cyan-400 font-bold font-mono tracking-tighter rounded-sm transition-all shadow-xl hover:shadow-cyan-500/20"
            >
                <span className="material-symbols-rounded text-2xl">add_circle</span>
                <span>YENİ DOSYA</span>
            </button>
        </div>

        {/* ŞABLONLAR */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 mb-24">
            {[
                { id: 'literature', label: 'LİTERATÜR TARAMASI', code: 'LIT-01', icon: 'travel_explore' },
                { id: 'data', label: 'VERİ ANALİZİ', code: 'DAT-02', icon: 'query_stats' },
                { id: 'audit', label: 'YAYIN DENETİMİ', code: 'AUD-03', icon: 'security' },
                { id: 'grant', label: 'PROJE ÖNERİSİ', code: 'GRN-04', icon: 'monetization_on' },
                { id: 'thesis', label: 'TEZ TASLAĞI', code: 'THS-05', icon: 'school' },
                { id: 'conference', label: 'KONFERANS BİLDİRİSİ', code: 'CNF-06', icon: 'mic_external_on' }
            ].map(protocol => (
                <div 
                    key={protocol.id}
                    onClick={() => onCreateDocument(protocol.id as any)}
                    className="group relative bg-[#111827]/60 border border-white/5 p-8 h-[240px] md:h-[280px] flex flex-col justify-between hover:border-cyan-500/50 hover:bg-[#161e2e] transition-all cursor-pointer rounded-xl overflow-hidden"
                >   
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 -mr-16 -mt-16 rounded-full group-hover:bg-cyan-500/10"></div>
                    <div>
                        <div className="flex justify-between items-start mb-6">
                            <span className="text-[10px] font-mono text-cyan-500 border border-cyan-500/30 px-3 py-1 rounded bg-cyan-500/5 uppercase tracking-widest">{protocol.code}</span>
                            <span className="material-symbols-rounded text-slate-600 group-hover:text-cyan-400 transition-all text-4xl">{protocol.icon}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{protocol.label}</h3>
                    </div>
                </div>
            ))}
        </div>

        {/* SON DOSYALAR */}
        <div className="border-t border-white/5 pt-16 pb-20">
            <h2 className="text-xs font-mono text-slate-500 flex items-center gap-4 tracking-[0.4em] mb-10">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                DOSYA VERİTABANI
            </h2>
            <div className="flex flex-col gap-4">
                {documents.map((doc) => (
                    <div 
                        key={doc.id}
                        onClick={() => onOpenDocument(doc)}
                        className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-[#111827]/40 border border-white/5 hover:border-cyan-500/40 hover:bg-[#161e2e]/60 rounded-xl cursor-pointer transition-all gap-4"
                    >
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 flex items-center justify-center bg-slate-800/80 rounded-xl text-slate-500 group-hover:text-cyan-400">
                                <span className="material-symbols-rounded text-3xl">description</span>
                            </div>
                            <div className="min-w-0">
                                <h4 className="text-white font-bold font-mono text-lg group-hover:text-cyan-400 transition-colors truncate">{doc.title}</h4>
                                <div className="flex items-center gap-4 mt-2">
                                    <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-500 uppercase">{doc.wordCount} Kelime</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-10">
                            <div className="text-right hidden md:block">
                                <div className="text-[10px] font-mono text-slate-600 uppercase">Revizyon Tarihi</div>
                                <div className="text-xs font-mono text-slate-400">{new Date(doc.lastModified).toLocaleDateString()}</div>
                            </div>
                            <button 
                                onClick={(e) => { e.stopPropagation(); onDeleteDocument(e, doc.id); }}
                                className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-800/50 hover:bg-rose-950/40 text-slate-500 hover:text-rose-500 transition-all border border-transparent hover:border-rose-500/30"
                            >
                                <span className="material-symbols-rounded text-2xl">delete</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </main>
    </div>
  );
};