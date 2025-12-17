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
}

export const Navbar: React.FC<NavbarProps> = ({ onGoHome, title, setTitle, wordCount = 0, pageCount = 1, isSaving = false, themeColor }) => {
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
    <header className="fixed top-6 left-0 right-0 z-50 px-6 pointer-events-none flex justify-center">
      
      {/* Floating Dark Glass HUD */}
      <div className="pointer-events-auto bg-[#0B0F17]/90 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-white/10 rounded-full pl-2 pr-6 py-2 flex items-center gap-4 transition-all hover:border-cyan-500/30">
          
          {/* Back Button */}
          <button 
            onClick={onGoHome}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-cyan-600 hover:text-white text-slate-400 flex items-center justify-center transition-colors"
          >
             <span className="material-symbols-rounded text-[18px]">arrow_back</span>
          </button>

          <div className="w-px h-4 bg-white/10"></div>
          
          {/* Title Edit */}
          <div className="flex flex-col items-center">
            {isEditing ? (
                <input 
                    type="text" 
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    onBlur={handleTitleSubmit}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className="font-mono font-bold text-sm text-white bg-transparent outline-none min-w-[120px] text-center"
                />
            ) : (
                <h1 
                    onClick={() => setIsEditing(true)}
                    className="font-mono font-bold text-sm text-white cursor-text hover:text-cyan-400 transition-colors max-w-[240px] truncate"
                >
                    {title}
                </h1>
            )}
            <div className="flex items-center gap-2 text-[9px] font-mono text-slate-500 uppercase tracking-wider">
                <span>{wordCount} WORDS</span>
                <span className="text-cyan-600 font-bold">•</span>
                <span>SAYFA {pageCount}</span>
                <span className="text-cyan-600 font-bold">•</span>
                <span>{isSaving ? <span className="text-cyan-500 animate-pulse">SAVING...</span> : 'SECURE'}</span>
            </div>
          </div>
      </div>
    </header>
  );
};