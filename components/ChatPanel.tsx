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
      text: 'Merhaba! Ben akademik asistanınızım. "Tablo oluştur", "Yöntem yaz", "Özeti düzelt" gibi komutlarla size yardımcı olabilirim.',
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
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
        {/* Suggestion Chips */}
        {messages.length === 1 && (
            <div className="p-5 pb-0 shrink-0">
                <div className="bg-[#eff4ff] border border-blue-100 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-indigo-600 font-black tracking-tighter text-base">BOLT</span>
                        <span className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest">HIZLI İŞLEMLER</span>
                    </div>
                    
                    <div className="flex flex-col gap-2.5">
                        {[
                            'Bulguları tablo olarak karşılaştır', 
                            'Özgün Değer bölümünü akademik dille güçlendir', 
                            'Literatür özetini genişlet ve düzenle'
                        ].map(s => (
                            <button 
                                key={s} 
                                onClick={() => handleSend(false, s)}
                                className="bg-white border border-blue-50 hover:border-indigo-200 text-left px-4 py-3.5 rounded-xl text-sm text-slate-700 flex items-center justify-between group transition-all shadow-sm"
                            >
                                <span className="font-medium text-slate-600 group-hover:text-indigo-900 transition-colors">{s}</span>
                                <span className="material-symbols-rounded text-[18px] text-indigo-200 group-hover:text-indigo-500 transition-colors font-bold">arrow_forward</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6 scroll-smooth custom-scrollbar">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-4 animate-fade-in-up ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm border
                        ${msg.role === 'model' 
                            ? 'bg-black text-white border-black' 
                            : 'bg-white text-gray-500 border-gray-200'}`}>
                        <span className="material-symbols-rounded text-[18px]">
                            {msg.role === 'model' ? 'auto_awesome' : 'person'}
                        </span>
                    </div>
                    <div className={`flex flex-col max-w-[85%] gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-sm relative group
                            ${msg.role === 'model' 
                                ? 'bg-gray-50 text-slate-900 rounded-tl-none border border-gray-200 [&_*]:text-slate-900' 
                                : 'bg-black text-white rounded-tr-none [&_*]:text-white'}
                            
                            [&>h3]:font-bold [&>h3]:text-base [&>h3]:mb-1.5 [&>h3]:mt-2
                            [&>ul]:list-disc [&>ul]:pl-4 [&>ul]:mb-2
                            [&>ol]:list-decimal [&>ol]:pl-4 [&>ol]:mb-2
                            [&>p]:mb-2 [&>p]:last:mb-0
                            [&>strong]:font-bold
                            [&_table]:w-full [&_table]:border-collapse [&_table]:my-2 [&_table]:text-xs
                            [&_th]:bg-black/5 [&_th]:p-1.5 [&_th]:text-left [&_th]:font-bold
                            [&_td]:border [&_td]:border-gray-300 [&_td]:p-1.5
                            `}>
                            
                            {/* Render HTML content safely */}
                            <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                            
                            {msg.role === 'model' && !msg.text.includes('✅') && (
                                <div className="absolute -bottom-10 left-0 opacity-0 group-hover:opacity-100 transition-opacity z-10 pt-2">
                                     <button 
                                        onClick={() => onSmartUpdate(msg.text)}
                                        className="bg-white border border-gray-200 shadow-xl text-xs font-bold text-slate-700 px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-gray-50 hover:text-primary hover:border-primary transition-colors"
                                    >
                                        <span className="material-symbols-rounded text-[16px]">update</span>
                                        Akıllı Uygula
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
            
            {isLoading && (
                 <div className="flex gap-4 animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center shrink-0 mt-1">
                        <span className="material-symbols-rounded text-[18px]">auto_awesome</span>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-none p-5 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                 </div>
            )}
            <div ref={messagesEndRef} className="h-2" />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-100 bg-white shrink-0 z-20">
            <div className="relative shadow-sm rounded-2xl">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Bir şeyler yazın... (örn: Özgün değeri güçlendir)"
                    className="w-full bg-gray-50 hover:bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black pr-24 resize-none h-[60px] max-h-32 transition-all placeholder:text-gray-400 focus:bg-white text-slate-900"
                />
                
                <div className="absolute bottom-2 right-2 flex items-center gap-1">
                    <button 
                        onClick={() => handleSend(true)}
                        disabled={isLoading || !input.trim()}
                        className="w-8 h-8 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center disabled:opacity-30"
                        title="Akıllı Revizyon Uygula"
                    >
                        <span className="material-symbols-rounded text-[20px]">magic_button</span>
                    </button>
                    <button 
                        onClick={() => handleSend(false)}
                        disabled={isLoading || !input.trim()}
                        className="w-8 h-8 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                        title="Gönder"
                    >
                        <span className="material-symbols-rounded text-[20px]">arrow_upward</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};