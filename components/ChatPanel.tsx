import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

interface ChatPanelProps {
  documentContent: string;
  onInsertContent: (text: string) => void;
  onSmartUpdate: (html: string) => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ documentContent, onInsertContent, onSmartUpdate }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Merhaba! Ben akademik asistanınızım. Size nasıl yardımcı olabilirim?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (directUpdate = false, overrideText?: string) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await sendMessageToGemini(textToSend, documentContent);

    if (directUpdate) {
        onSmartUpdate(responseText);
        const systemMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: `✅ İçerik akıllı şekilde güncellendi.`,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, systemMsg]);
    } else {
        const modelMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: responseText,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, modelMsg]);
    }
    
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (window.innerWidth > 768) {
          e.preventDefault();
          handleSend();
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative overflow-hidden">
        {/* Messages List - Main Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5 flex flex-col gap-4 md:gap-6 scroll-smooth custom-scrollbar">
            {/* Suggestion Chips only at start */}
            {messages.length === 1 && (
                <div className="pb-2 shrink-0">
                    <div className="bg-[#eff4ff] border border-blue-100 rounded-xl md:rounded-2xl p-4 md:p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-3 md:mb-4">
                            <span className="text-indigo-600 font-black tracking-tighter text-sm md:text-base">BOLT</span>
                            <span className="text-indigo-300 text-[8px] md:text-[10px] font-bold uppercase tracking-widest">HIZLI İŞLEMLER</span>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            {[
                                'Bulguları tablo yap', 
                                'Akademik dili güçlendir', 
                                'Literatürü düzenle'
                            ].map(s => (
                                <button 
                                    key={s} 
                                    onClick={() => handleSend(false, s)}
                                    className="bg-white border border-blue-50 hover:border-indigo-200 text-left px-3 md:px-4 py-2.5 md:py-3.5 rounded-lg md:rounded-xl text-xs md:text-sm text-slate-700 flex items-center justify-between group transition-all"
                                >
                                    <span className="font-medium truncate pr-2">{s}</span>
                                    <span className="material-symbols-rounded text-[16px] md:text-[18px] text-indigo-200 group-hover:text-indigo-500 font-bold shrink-0">arrow_forward</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 md:gap-4 animate-fade-in-up ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm border
                        ${msg.role === 'model' 
                            ? 'bg-black text-white border-black' 
                            : 'bg-white text-gray-500 border-gray-200'}`}>
                        <span className="material-symbols-rounded text-[16px] md:text-[18px]">
                            {msg.role === 'model' ? 'auto_awesome' : 'person'}
                        </span>
                    </div>
                    <div className={`flex flex-col max-w-[90%] md:max-w-[85%] gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`rounded-xl md:rounded-2xl px-4 md:px-5 py-2.5 md:py-3.5 text-xs md:text-sm leading-relaxed shadow-sm relative group
                            ${msg.role === 'model' 
                                ? 'bg-gray-50 text-slate-900 rounded-tl-none border border-gray-200' 
                                : 'bg-black text-white rounded-tr-none'}
                            `}>
                            
                            <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                            
                            {msg.role === 'model' && !msg.text.includes('✅') && (
                                <div className="absolute -bottom-8 left-0 opacity-0 group-hover:opacity-100 transition-opacity z-10 pt-1">
                                     <button 
                                        onClick={() => onSmartUpdate(msg.text)}
                                        className="bg-white border border-gray-200 shadow-xl text-[10px] font-bold text-slate-700 px-2 py-1 rounded-full flex items-center gap-1 hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="material-symbols-rounded text-[14px]">update</span>
                                        Uygula
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
            
            {isLoading && (
                 <div className="flex gap-3 md:gap-4 animate-pulse">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-black flex items-center justify-center shrink-0 mt-1">
                        <span className="material-symbols-rounded text-[16px]">auto_awesome</span>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-xl rounded-tl-none p-4 flex items-center gap-2">
                        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                    </div>
                 </div>
            )}
            <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* Input Area - Adjusted for Apple Home Bar and Safari UI */}
        <div className="border-t border-gray-100 bg-white shrink-0 z-30 shadow-[0_-15px_40px_rgba(0,0,0,0.08)] safe-pb">
            <div className="p-3 md:p-4">
                <div className="relative shadow-sm rounded-xl md:rounded-2xl max-w-full overflow-hidden">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Mesaj yazın..."
                        className="w-full bg-gray-50 hover:bg-white border border-gray-200 rounded-xl md:rounded-2xl px-3 md:px-4 py-3.5 text-xs md:text-sm focus:outline-none focus:border-black pr-20 md:pr-24 resize-none h-[52px] md:h-[64px] transition-all placeholder:text-gray-400 text-slate-900 leading-tight"
                    />
                    
                    <div className="absolute top-1/2 -translate-y-1/2 right-1.5 md:right-2 flex items-center gap-1">
                        <button 
                            onClick={() => handleSend(true)}
                            disabled={isLoading || !input.trim()}
                            className="w-8 h-8 md:w-9 md:h-9 rounded-lg text-gray-400 hover:text-blue-600 transition-colors flex items-center justify-center disabled:opacity-30"
                            title="Akıllı Uygula"
                        >
                            <span className="material-symbols-rounded text-[20px] md:text-[22px]">magic_button</span>
                        </button>
                        <button 
                            onClick={() => handleSend(false)}
                            disabled={isLoading || !input.trim()}
                            className="w-8 h-8 md:w-9 md:h-9 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center disabled:opacity-50 shadow-md"
                            title="Gönder"
                        >
                            <span className="material-symbols-rounded text-[20px] md:text-[22px]">arrow_upward</span>
                        </button>
                    </div>
                </div>
            </div>
            {/* Additional micro-spacer for extreme cases of Safari floating bars */}
            <div className="h-2 md:hidden"></div>
        </div>
    </div>
  );
};