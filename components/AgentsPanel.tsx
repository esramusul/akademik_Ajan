import React, { useState } from 'react';
import { AgentType, AgentResult } from '../types';
import { runAgent, fixProofreadErrors } from '../services/geminiService';

interface AgentsPanelProps {
  documentContent: string;
  onSmartUpdate: (html: string) => void;
  onReplaceContent: (html: string) => void;
}

const AGENTS: { id: AgentType; title: string; desc: string; icon: string; color: string; bg: string; demoData?: string }[] = [
  { 
    id: 'proofread', 
    title: 'Dil ve İmla Denetçisi', 
    desc: 'TDK uyumlu yazım ve gramer kontrolü', 
    icon: 'spellcheck', 
    color: 'text-pink-600', 
    bg: 'bg-pink-50 border-pink-100' 
  },
  { 
    id: 'precheck', 
    title: 'Desk Rejection Simülatörü', 
    desc: 'Hakem öncesi risk analizi', 
    icon: 'gavel', 
    color: 'text-purple-600', 
    bg: 'bg-purple-50 border-purple-100' 
  },
  { 
    id: 'apa_audit', 
    title: 'APA 7 Denetçisi', 
    desc: 'Atıf ve kaynakça uyumu', 
    icon: 'fact_check', 
    color: 'text-blue-600', 
    bg: 'bg-blue-50 border-blue-100' 
  },
  { 
    id: 'chart', 
    title: 'İstatistik Görselleştirici', 
    desc: 'Ham veriden akademik tablo', 
    icon: 'table_chart', 
    color: 'text-emerald-600', 
    bg: 'bg-emerald-50 border-emerald-100',
    demoData: 'Kategori, 2021, 2022, 2023\nYayın Sayısı, 45, 62, 88\nAtıf Sayısı, 120, 245, 410\nİşbirliği Oranı, 0.15, 0.22, 0.35'
  },
  { 
    id: 'image_comment', 
    title: 'Şekil Yorumlayıcı', 
    desc: 'Görseller için altyazı üretimi', 
    icon: 'image', 
    color: 'text-orange-600', 
    bg: 'bg-orange-50 border-orange-100',
    demoData: 'GÖRSEL ANALİZ TALEBİ: Şekil 2\'de 2018-2024 arası küresel karbon emisyon değerleri verilmiştir. Grafikte 2020 (Pandemi) yılında %7\'lik sert bir düşüş, ancak 2022 itibariyle eski seviyesinin %3 üzerine çıkan bir "V" tipi toparlanma görülmektedir. Asya-Pasifik bölgesi emisyon payı %45 ile en büyük dilimi oluşturmaktadır.'
  },
];

export const AgentsPanel: React.FC<AgentsPanelProps> = ({ documentContent, onSmartUpdate, onReplaceContent }) => {
  const [selectedAgent, setSelectedAgent] = useState<AgentType>('proofread');
  const [contextInput, setContextInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isFixing, setIsFixing] = useState<string | null>(null);
  const [results, setResults] = useState<AgentResult[]>([]);

  const handleRunAgent = async () => {
    setIsRunning(true);
    const contentToAnalyze = contextInput.trim() ? contextInput : documentContent;

    const output = await runAgent(selectedAgent, contentToAnalyze);

    const newResult: AgentResult = {
        id: Date.now().toString(),
        type: selectedAgent,
        title: AGENTS.find(a => a.id === selectedAgent)?.title || 'Ajan Raporu',
        content: output,
        timestamp: new Date(),
        status: 'success'
    };

    setResults(prev => [newResult, ...prev]);
    setIsRunning(false);
  };

  const handleApplyFixes = async (result: AgentResult) => {
    if (isFixing) return;
    setIsFixing(result.id);
    
    try {
      const fixedHtml = await fixProofreadErrors(documentContent, result.content);
      onReplaceContent(fixedHtml);
      
      setResults(prev => prev.map(r => 
        r.id === result.id 
          ? { ...r, content: r.content + '<div class="mt-4 p-2 bg-green-50 text-green-700 text-xs rounded border border-green-200">✅ Tüm düzeltmeler belgeye başarıyla uygulandı.</div>' } 
          : r
      ));
    } catch (e) {
      console.error(e);
    } finally {
      setIsFixing(null);
    }
  };

  const currentAgent = AGENTS.find(a => a.id === selectedAgent);

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      <div className="flex-1 overflow-y-auto p-5 pb-24 scroll-smooth custom-scrollbar">
        <h3 className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-4 ml-1">Aktif Ajanlar</h3>
        
        <div className="grid grid-cols-1 gap-3 mb-6">
            {AGENTS.map((agent) => (
                <button
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent.id)}
                    className={`flex items-start gap-4 p-4 rounded-2xl border transition-all text-left group relative
                        ${selectedAgent === agent.id 
                            ? 'bg-white border-black shadow-lg shadow-black/5 ring-1 ring-black/5 scale-[1.01] z-10' 
                            : 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-md'}`}
                >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${selectedAgent === agent.id ? 'bg-black text-white' : `${agent.bg} ${agent.color}`}`}>
                        <span className="material-symbols-rounded text-[24px]">{agent.icon}</span>
                    </div>
                    <div>
                        <h4 className={`text-sm font-bold leading-tight ${selectedAgent === agent.id ? 'text-black' : 'text-slate-700'}`}>
                            {agent.title}
                        </h4>
                        <p className="text-[12px] text-gray-500 mt-1 leading-snug">{agent.desc}</p>
                    </div>
                    
                    {selectedAgent === agent.id && (
                        <div className="absolute top-4 right-4 text-black animate-pulse">
                             <span className="material-symbols-rounded text-[20px]">radio_button_checked</span>
                        </div>
                    )}
                </button>
            ))}
        </div>

        <div className="h-px bg-gray-200 my-4"></div>

        <div className="flex flex-col gap-2 mb-6">
            <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    Özel Bağlam (Analiz Edilecek Veri)
                </label>
                {currentAgent?.demoData && (
                    <button 
                        onClick={() => setContextInput(currentAgent.demoData!)}
                        className="text-[9px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all font-bold"
                    >
                        DEMO VERİ YÜKLE
                    </button>
                )}
            </div>
            <textarea 
                className="w-full p-4 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black outline-none resize-none h-28 bg-white placeholder:text-gray-400 transition-all shadow-sm text-slate-800"
                placeholder="İstatistik verileri veya görsel betimlemelerini buraya yapıştırın veya 'DEMO VERİ YÜKLE' butonuna basın."
                value={contextInput}
                onChange={(e) => setContextInput(e.target.value)}
            />
        </div>

        {results.length > 0 && (
            <div className="flex flex-col gap-4 animate-fade-in-up">
                <div className="flex items-center justify-between px-1">
                     <h3 className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Sonuçlar</h3>
                     <button className="text-[10px] text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors font-bold" onClick={() => setResults([])}>TEMİZLE</button>
                </div>
                {results.map((res) => (
                    <div key={res.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden group">
                        <div className="px-4 py-3 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-rounded text-[18px] text-green-600">check_circle</span>
                                <span className="text-xs font-bold text-slate-900">{res.title}</span>
                            </div>
                            <span className="text-[10px] text-gray-400 font-mono">{res.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        
                        <div className="p-5 text-sm text-slate-800 leading-relaxed font-sans prose 
                             [&_*]:text-slate-800
                             [&>h3]:font-bold [&>h3]:text-base [&>h3]:mt-3 [&>h3]:mb-2
                             [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-3
                             [&>p]:mb-2
                             [&>strong]:font-bold [&>b]:font-bold
                             [&_table]:w-full [&_table]:border [&_table]:border-gray-200 [&_table]:my-3
                             [&_th]:bg-gray-50 [&_th]:p-2 [&_th]:font-bold [&_th]:text-left
                             [&_td]:border-t [&_td]:border-gray-100 [&_td]:p-2
                            " 
                            dangerouslySetInnerHTML={{ __html: res.content }} />

                        {res.type === 'proofread' && (
                          <div className="px-5 pb-5 flex gap-2">
                            <button 
                                onClick={() => handleApplyFixes(res)}
                                disabled={isFixing === res.id}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
                            >
                                {isFixing === res.id ? (
                                    <span className="material-symbols-rounded animate-spin text-[18px]">sync</span>
                                ) : (
                                    <span className="material-symbols-rounded text-[18px]">magic_button</span>
                                )}
                                <span>HATALARI OTOMATİK DÜZELT</span>
                            </button>
                          </div>
                        )}
                        {(res.type === 'chart' || res.type === 'image_comment' || res.type === 'precheck' || res.type === 'apa_audit') && (
                            <div className="px-5 pb-5">
                                <button 
                                    onClick={() => onSmartUpdate(res.content)}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                                >
                                    <span className="material-symbols-rounded text-[18px]">update</span>
                                    <span>AKILLI UYGULA</span>
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        )}
      </div>

      <div className="p-5 bg-white/80 backdrop-blur-md border-t border-gray-100 absolute bottom-0 w-full z-20">
         <button 
            onClick={handleRunAgent}
            disabled={isRunning}
            className="w-full bg-black hover:bg-gray-800 text-white font-bold h-12 rounded-xl shadow-xl shadow-black/10 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
         >
            {isRunning ? (
                <span className="material-symbols-rounded animate-spin text-[24px]">sync</span>
            ) : (
                <span className="material-symbols-rounded text-[24px]">play_arrow</span>
            )}
            <span>PROTOKOLÜ ÇALIŞTIR</span>
         </button>
      </div>
    </div>
  );
};