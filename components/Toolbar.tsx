import React, { useState } from 'react';
import { ThemeColor } from '../App';

const HorizontalDivider = () => <div className="w-3 md:w-6 h-px bg-white/10 my-1 md:my-1.5 shrink-0"></div>;

const IconButton = ({ 
    icon, 
    active = false, 
    tooltip, 
    onClick,
    isSerif = false,
}: { 
    icon: string; 
    active?: boolean; 
    tooltip?: string;
    onClick?: () => void;
    isSerif?: boolean;
}) => (
  <button 
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg md:rounded-xl transition-all active:scale-90 group relative shrink-0
      ${active 
        ? 'bg-cyan-600 text-white shadow-[0_0_15px_rgba(8,145,178,0.4)]' 
        : 'text-slate-400 hover:bg-white/10 hover:text-white'
      }`}
    title={tooltip}
  >
    {isSerif ? (
        <span className="font-serif font-bold text-sm md:text-lg">A</span>
    ) : (
        <span className="material-symbols-rounded text-[18px] md:text-[22px]">{icon}</span>
    )}
  </button>
);

interface ToolbarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  onInsertPageBreak: () => void;
  onToggleFont: () => void;
  onFormat: (cmd: string, val?: string) => void;
  themeColor: ThemeColor;
}

export const Toolbar: React.FC<ToolbarProps> = ({ 
    toggleSidebar, 
    isSidebarOpen, 
    onInsertPageBreak,
    onToggleFont,
    onFormat,
    themeColor
}) => {
  const [currentFontName, setCurrentFontName] = useState<'Sans' | 'Serif'>('Sans');
  
  const handleFontToggle = () => {
      const newName = currentFontName === 'Sans' ? 'Serif' : 'Sans';
      setCurrentFontName(newName);
      onToggleFont();
  };

  return (
    <div className={`fixed left-2 md:left-6 top-1/2 -translate-y-1/2 flex flex-col items-center z-20 pointer-events-none transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'opacity-0 scale-95 -translate-x-12 pointer-events-none' : 'opacity-100 scale-100 translate-x-0'}`}>
       {/* Vertical Side Bar */}
       <div className="bg-[#0B0F17]/95 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10 rounded-xl md:rounded-[24px] p-1 md:p-2 flex flex-col items-center pointer-events-auto gap-0.5 md:gap-1">
          
          <IconButton icon="undo" tooltip="Geri Al" onClick={() => onFormat('undo')} />
          <IconButton icon="redo" tooltip="Yinele" onClick={() => onFormat('redo')} />

          <HorizontalDivider />

          <button 
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleFontToggle}
            className="flex flex-col items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl hover:bg-white/5 text-[7px] md:text-[8px] font-mono font-bold text-slate-400 transition-colors shrink-0"
          >
            <span className="material-symbols-rounded text-[16px] md:text-[18px]">text_fields</span>
            <span className="mt-0.5 leading-none">{currentFontName === 'Sans' ? 'SNS' : 'SRF'}</span>
          </button>
          
          <HorizontalDivider />
          
          <IconButton icon="format_bold" tooltip="Kalın" onClick={() => onFormat('bold')} />
          <IconButton icon="format_italic" tooltip="İtalik" onClick={() => onFormat('italic')} />
          
          <HorizontalDivider />

          <IconButton icon="format_align_left" tooltip="Sola Yasla" onClick={() => onFormat('justifyLeft')} />
          <IconButton icon="format_align_center" tooltip="Ortala" onClick={() => onFormat('justifyCenter')} />

          <HorizontalDivider />

          <IconButton icon="horizontal_rule" tooltip="Yeni Sayfa" onClick={onInsertPageBreak} />

          {/* AI Trigger (At bottom of vertical bar) */}
          <div className="mt-1.5 pt-1.5 border-t border-white/10 shrink-0">
            <button 
                onClick={toggleSidebar}
                className={`flex flex-col items-center justify-center w-9 h-9 md:w-12 md:h-12 rounded-lg md:rounded-xl transition-all text-[8px] md:text-[10px] font-bold tracking-tight border
                    ${isSidebarOpen 
                        ? 'bg-cyan-600 border-cyan-500 text-white shadow-[0_0_20px_rgba(8,145,178,0.6)]' 
                        : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}
            >
                <span className={`material-symbols-rounded text-[20px] md:text-[24px] ${isSidebarOpen ? 'animate-spin-slow' : ''}`}>auto_awesome</span>
                <span className="text-[7px] md:text-[8px] mt-0.5">AI</span>
            </button>
          </div>
       </div>
    </div>
  );
};