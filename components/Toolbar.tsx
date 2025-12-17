import React, { useState } from 'react';
import { ThemeColor } from '../App';

const Divider = () => <div className="w-px h-4 bg-white/10 mx-2 shrink-0"></div>;

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
    className={`w-8 h-8 flex items-center justify-center rounded-sm transition-all active:scale-95 group relative
      ${active 
        ? 'bg-cyan-600 text-white' 
        : 'text-slate-400 hover:bg-white/10 hover:text-white'
      }`}
    title={tooltip}
  >
    {isSerif ? (
        <span className="font-serif font-bold text-lg">A</span>
    ) : (
        <span className="material-symbols-rounded text-[20px]">{icon}</span>
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
    <div className="fixed bottom-8 left-0 right-0 flex justify-center z-50 pointer-events-none">
       {/* Main Bar */}
       <div className="bg-[#0B0F17]/90 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.6)] border border-white/10 rounded-xl p-1.5 flex items-center pointer-events-auto transform transition-all hover:-translate-y-1">
          
          <IconButton icon="undo" tooltip="Geri Al" onClick={() => onFormat('undo')} />
          <IconButton icon="redo" tooltip="Yinele" onClick={() => onFormat('redo')} />

          <Divider />

          <button 
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleFontToggle}
            className="flex items-center gap-2 px-3 py-1 rounded hover:bg-white/5 text-[10px] font-mono font-bold text-slate-400 transition-colors mx-1 w-20 justify-center"
          >
            <span>{currentFontName.toUpperCase()}</span>
          </button>
          
          <Divider />
          
          <IconButton icon="format_bold" tooltip="Kalın" onClick={() => onFormat('bold')} />
          <IconButton icon="format_italic" tooltip="İtalik" onClick={() => onFormat('italic')} />
          <IconButton icon="format_underlined" tooltip="Altı Çizili" onClick={() => onFormat('underline')} />
          
          <Divider />

          <IconButton icon="format_align_left" tooltip="Sola Hizala" onClick={() => onFormat('justifyLeft')} />
          <IconButton icon="format_align_center" tooltip="Ortala" onClick={() => onFormat('justifyCenter')} />
          <IconButton icon="format_align_right" tooltip="Sağa Hizala" onClick={() => onFormat('justifyRight')} />

          <Divider />

          <IconButton icon="horizontal_rule" tooltip="Yeni Sayfa" onClick={onInsertPageBreak} />

          {/* AI Trigger */}
          <div className="ml-3 pl-3 border-l border-white/10">
            <button 
                onClick={toggleSidebar}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg transition-all text-xs font-bold tracking-wide border
                    ${isSidebarOpen 
                        ? 'bg-cyan-600 border-cyan-500 text-white shadow-[0_0_15px_rgba(8,145,178,0.5)]' 
                        : 'bg-white/5 border-transparent text-slate-400 hover:text-white hover:bg-white/10'}`}
            >
                <span className={`material-symbols-rounded text-[18px] ${isSidebarOpen ? 'animate-spin' : ''}`}>auto_awesome</span>
                <span>AI_ASSIST</span>
            </button>
          </div>
       </div>
    </div>
  );
};