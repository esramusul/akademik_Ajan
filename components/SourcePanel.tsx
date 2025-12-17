import React from 'react';
import { Source } from '../types';

const MOCK_SOURCES: Source[] = [
    { id: '1', title: 'APA Publication Manual (7th Ed.)', citation: 'American Psychological Association', snippet: 'Tablo başlıkları tablonun üzerinde, şekil başlıkları ise şeklin altında yer almalı ve italik yazılmalıdır.', type: 'internal', confidence: 100 },
    { id: '2', title: 'Nature: Reporting Standards', citation: 'Nature Portfolio', snippet: 'İstatistiksel analizler için p-değerleri kesin olarak verilmeli (örn: p=0.032), sadece <0.05 olarak belirtilmemelidir.', type: 'internal', confidence: 100 },
    { id: '3', title: 'Desk Rejection Reasons Analysis', citation: 'Elsevier Insights', snippet: 'Makalelerin %30\'u "Kapsam Dışı" veya "Yetersiz Metodoloji" nedeniyle editör aşamasında reddedilmektedir.', type: 'report', confidence: 95 },
    { id: '4', title: 'Writing the Empirical Journal Article', citation: 'Bem, D. J. (2003)', snippet: 'Giriş bölümü hunu şeklinde olmalı; genelden özele inerek araştırma sorusuna odaklanmalıdır.', type: 'paper', confidence: 90 },
];

export const SourcePanel: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-slate-50">
        <div className="flex-1 overflow-y-auto p-5 pb-20 custom-scrollbar">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 leading-tight">Standartlar & Kaynaklar</h3>
                <p className="text-xs text-slate-500 mt-1">Global akademik yayın kuralları.</p>
            </div>

            {/* Active Rule Card */}
            <div className="bg-white rounded-2xl p-4 border border-indigo-100 shadow-sm mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-50 rounded-bl-full -mr-4 -mt-4 z-0"></div>
                <div className="relative z-10 flex justify-between items-start gap-3">
                    <div>
                         <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-[10px] font-bold text-indigo-700 ring-1 ring-inset ring-indigo-600/10 mb-2 uppercase tracking-wide">Aktif Protokol</span>
                         <h4 className="font-bold text-slate-900 text-sm">Yüksek Etki Faktörlü Dergi Formatı</h4>
                         <p className="text-xs text-slate-500 mt-1">APA 7 & Nature Standartları</p>
                    </div>
                    <div className="w-10 h-10 bg-white border border-indigo-100 rounded-full flex items-center justify-center text-indigo-600 shadow-sm">
                        <span className="material-symbols-rounded text-[20px]">verified</span>
                    </div>
                </div>
            </div>

            {/* Source List */}
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3 ml-1">Referans Kütüphanesi</h4>
            <div className="flex flex-col gap-3">
                {MOCK_SOURCES.map(source => (
                    <div key={source.id} className="bg-white rounded-xl p-4 border border-gray-200 hover:border-black/20 transition-colors group cursor-pointer shadow-sm hover:shadow-md">
                        <div className="flex items-start gap-3">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 
                                ${source.type === 'internal' ? 'bg-purple-50 text-purple-600' : (source.type === 'paper' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600')}`}>
                                <span className="material-symbols-rounded text-[20px]">
                                    {source.type === 'internal' ? 'policy' : (source.type === 'paper' ? 'article' : 'analytics')}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h5 className="text-sm font-bold text-slate-900 truncate leading-tight">{source.title}</h5>
                                <p className="text-[11px] text-gray-500 mt-0.5">{source.citation}</p>
                            </div>
                        </div>
                        <div className="mt-3 bg-gray-50 rounded-lg p-3 text-xs text-gray-600 leading-relaxed border border-gray-100">
                            <span className="font-serif italic text-gray-400 mr-1">"</span>
                            {source.snippet}
                            <span className="font-serif italic text-gray-400 ml-1">"</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        
        {/* Footer Disclaimer */}
        <div className="p-4 border-t border-gray-200 bg-white">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex gap-3">
                <span className="material-symbols-rounded text-slate-400 text-[20px] shrink-0">info</span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                    AI Etik Hatırlatması: Nihai bilimsel sorumluluk insana aittir. Üretilen tüm metin ve analizleri doğrulayınız.
                </p>
            </div>
        </div>
    </div>
  );
};