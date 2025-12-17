import React, { useState, useEffect } from 'react';
import { ThemeColor } from '../App';

interface NavbarProps {
  onGoHome: () => void;
  title: string;
  setTitle: (title: string) => void;
  wordCount?: number;
  pageCount?: number;
  isSaving?: boolean;
  themeColor: ThemeColor;
  isSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onGoHome, 
  title, 
  setTitle, 
  wordCount = 0, 
  pageCount = 1, 
  isSaving = false, 
  themeColor,
  isSidebarOpen = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);

  useEffect(() => {
    setTempTitle(title);
  }, [title]);

  const handleTitleSubmit = () => {
    if (tempTitle.trim()) {
      setTitle(tempTitle);
    } else {
      setTempTitle(title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleTitleSubmit();
    if (e.key === 'Escape') {
      setTempTitle(title);
      setIsEditing(false);
    }
  };

  return (
    <header className="fixed top-2 md:top-6 left-0 right-0 z-30 px-2 md:px-6 pointer-events-none flex justify-center">
      
      {/* Floating Dark Glass HUD Wrapper */}
      <div className="pointer-events-auto bg-[#0B0F17]/95 backdrop-blur-md shadow-2xl border border-white/10 rounded-full pl-2 pr-2 py-1.5 md:py-2 flex items-center transition-all duration-300">
          
          {/* Back Button - Always Visible */}
          <button 
            onClick={onGoHome}
            className="w-7 h-7 md:w-8 h-8 rounded-full bg-slate-800 hover:bg-cyan-600 hover:text-white text-slate-400 flex items-center justify-center transition-colors shrink-0"
          >
             <span className="material-symbols-rounded text-[16px] md:text-[18px]">arrow_back</span>
          </button>

          {/* This part (HUD/Stats) hides when AI sidebar is open */}
          <div className={`flex items-center gap-2 md:gap-4 overflow-hidden transition-all duration-300 ease-in-out ${isSidebarOpen ? 'max-w-0 opacity-0' : 'max-w-[500px] opacity-100 ml-2 pr-2 md:pr-4'}`}>
            <div className="w-px h-4 bg-white/10 shrink-0"></div>
            
            {/* Title Edit */}
            <div className="flex flex-col items-center min-w-[100px] md:min-w-[140px]">
              {isEditing ? (
                  <input 
                      type="text" 
                      value={tempTitle}
                      onChange={(e) => setTempTitle(e.target.value)}
                      onBlur={handleTitleSubmit}
                      onKeyDown={handleKeyDown}
                      autoFocus
                      className="font-mono font-bold text-xs md:text-sm text-white bg-transparent outline-none w-full text-center"
                  />
              ) : (
                  <h1 
                      onClick={() => setIsEditing(true)}
                      className="font-mono font-bold text-xs md:text-sm text-white cursor-text hover:text-cyan-400 transition-colors max-w-[120px] md:max-w-[240px] truncate"
                  >
                      {title}
                  </h1>
              )}
              <div className="flex items-center gap-1.5 md:gap-2 text-[8px] md:text-[9px] font-mono text-slate-500 uppercase tracking-wider">
                  <span className="hidden xs:inline">{wordCount} W</span>
                  <span className="xs:hidden">{wordCount}</span>
                  <span className="text-cyan-600 font-bold">•</span>
                  <span>P {pageCount}</span>
                  <span className="text-cyan-600 font-bold">•</span>
                  <span className="truncate">{isSaving ? <span className="text-cyan-500 animate-pulse">SYNC</span> : 'OK'}</span>
              </div>
            </div>
          </div>
      </div>
    </header>
  );
};