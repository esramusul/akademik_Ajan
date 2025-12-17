
import React from 'react';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-[500px] max-w-[90vw] bg-[#0B0F17] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-sm relative overflow-hidden">
        
        {/* Decorative Header Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600"></div>

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#111827]">
            <div className="flex items-center gap-3">
                <span className="material-symbols-rounded text-cyan-500 animate-spin-slow">settings</span>
                <h2 className="font-mono font-bold text-white tracking-widest text-lg">SİSTEM AYARLARI</h2>
            </div>
            <button 
                onClick={onClose}
                className="text-slate-500 hover:text-red-500 transition-colors"
            >
                <span className="material-symbols-rounded text-xl">close</span>
            </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
            
            {/* Section 1: Agent Profile */}
            <div>
                <h3 className="text-xs font-mono text-slate-500 uppercase mb-3 tracking-wider">// AJAN PROFİLİ</h3>
                <div className="flex items-center gap-4 bg-[#161e2e] p-3 rounded border border-white/5">
                    <div className="w-12 h-12 bg-cyan-900/30 border border-cyan-500/30 rounded flex items-center justify-center text-cyan-400">
                        <span className="material-symbols-rounded text-2xl">security</span>
                    </div>
                    <div>
                        <div className="text-white font-mono text-sm font-bold">OPERATOR_01</div>
                        <div className="text-emerald-500 text-[10px] font-mono mt-1">YETKİ SEVİYESİ: 5 (ADMIN)</div>
                    </div>
                </div>
            </div>

            {/* Section 2: Preferences */}
            <div>
                <h3 className="text-xs font-mono text-slate-500 uppercase mb-3 tracking-wider">// TERCİHLER</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 hover:bg-white/5 rounded transition-colors cursor-pointer group">
                        <div>
                            <div className="text-slate-300 text-sm font-medium group-hover:text-white">Otomatik Kayıt</div>
                            <div className="text-slate-600 text-[10px]">Değişiklikleri anlık senkronize et</div>
                        </div>
                        <div className="w-8 h-4 bg-cyan-900/50 rounded-full relative border border-cyan-700">
                            <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]"></div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-3 hover:bg-white/5 rounded transition-colors cursor-pointer group">
                        <div>
                            <div className="text-slate-300 text-sm font-medium group-hover:text-white">Bildirimler</div>
                            <div className="text-slate-600 text-[10px]">Operasyon tamamlandığında uyar</div>
                        </div>
                         <div className="w-8 h-4 bg-cyan-900/50 rounded-full relative border border-cyan-700">
                            <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]"></div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-3 hover:bg-white/5 rounded transition-colors cursor-pointer group">
                        <div>
                            <div className="text-slate-300 text-sm font-medium group-hover:text-white">Karanlık Mod (Zorunlu)</div>
                            <div className="text-slate-600 text-[10px]">Göz yorgunluğunu azaltmak için aktif</div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">KİLİTLİ</span>
                    </div>
                </div>
            </div>

            {/* Section 3: API Status */}
             <div>
                <h3 className="text-xs font-mono text-slate-500 uppercase mb-3 tracking-wider">// API DURUMU</h3>
                <div className="flex items-center justify-between bg-black/30 p-2 rounded border border-white/5">
                    <span className="text-xs text-slate-400 font-mono pl-2">GEMINI-3-FLASH-PREVIEW</span>
                    <span className="px-2 py-0.5 bg-emerald-900/30 text-emerald-400 text-[10px] font-mono rounded border border-emerald-900/50">AKTİF</span>
                </div>
            </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#111827] border-t border-white/5 flex justify-end">
            <button 
                onClick={onClose}
                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold rounded-sm transition-all shadow-[0_0_15px_rgba(8,145,178,0.4)]"
            >
                KAYDET VE ÇIK
            </button>
        </div>

      </div>
    </div>
  );
};
