import React, { useState } from 'react';
import { Tab } from '../types';
import { ChatPanel } from './ChatPanel';
import { AgentsPanel } from './AgentsPanel';
import { SourcePanel } from './SourcePanel';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  documentContent: string;
  onInsertContent: (text: string) => void;
  onSmartUpdate: (html: string) => void;
  onReplaceContent: (html: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, documentContent, onInsertContent, onSmartUpdate, onReplaceContent }) => {
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [chatResetKey, setChatResetKey] = useState(0);

  const handleNewChat = () => {
    setChatResetKey(prev => prev + 1);
  };

  return (
    <>
        {/* Transparent Overlay to close sidebar on click, without blur or darkening */}
        <div 
            className={`fixed inset-0 z-40 transition-opacity duration-300
            ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            onClick={onClose}
        ></div>

        <aside 
            className={`
                fixed inset-y-0 right-0 w-[420px] max-w-full
                bg-[#0B0F17]/98 md:bg-[#0B0F17]/95 backdrop-blur-xl border-l border-white/10 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]
                flex flex-col z-50 transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                h-[100dvh]
            `}
        >
        <div className="h-14 md:h-16 flex items-center justify-between px-4 md:px-6 shrink-0 border-b border-white/10 bg-[#0B0F17]">
            <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></span>
                <h2 className="text-[10px] md:text-sm font-mono font-bold text-white tracking-widest uppercase">AI_TERMINAL</h2>
            </div>
            <div className="flex items-center gap-2">
                <button 
                    onClick={handleNewChat}
                    className="w-8 h-8 rounded border border-white/10 flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-all" 
                    title="Yeni Oturum"
                >
                    <span className="material-symbols-rounded text-[18px]">refresh</span>
                </button>
                <button onClick={onClose} className="w-8 h-8 flex items-center justify-center hover:bg-red-900/30 rounded text-slate-500 hover:text-red-500 transition-colors">
                    <span className="material-symbols-rounded text-[20px]">close</span>
                </button>
            </div>
        </div>

        <div className="px-4 md:px-6 py-3 md:py-4 bg-[#0B0F17] shrink-0">
            <div className="flex gap-1 border-b border-white/10 pb-1">
                {(['chat', 'agents', 'source'] as Tab[]).map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-1.5 md:py-2 text-[8px] md:text-[10px] font-mono font-bold uppercase tracking-wider transition-all border-b-2
                    ${activeTab === tab 
                        ? 'border-cyan-500 text-cyan-400 bg-cyan-950/10' 
                        : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                >
                    {tab === 'chat' && 'SOHBET'}
                    {tab === 'agents' && 'ANALİZ'}
                    {tab === 'source' && 'VERİ'}
                </button>
                ))}
            </div>
        </div>

        <div className="flex-1 overflow-hidden relative bg-[#111827]">
            <div className={`h-full ${activeTab === 'chat' ? 'block' : 'hidden'}`}>
                <ChatPanel key={chatResetKey} documentContent={documentContent} onInsertContent={onInsertContent} onSmartUpdate={onSmartUpdate} />
            </div>
            <div className={`h-full ${activeTab === 'agents' ? 'block' : 'hidden'}`}>
                <AgentsPanel documentContent={documentContent} onSmartUpdate={onSmartUpdate} onReplaceContent={onReplaceContent} />
            </div>
            <div className={`h-full ${activeTab === 'source' ? 'block' : 'hidden'}`}>
                <SourcePanel />
            </div>
        </div>
        </aside>
    </>
  );
};