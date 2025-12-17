import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';

export interface EditorHandle {
  insertText: (text: string) => void;
  clearContent: () => void;
  insertPageBreak: () => void;
  toggleFont: () => void;
  format: (cmd: string, val?: string) => void;
  smartUpdate: (html: string) => void;
  replaceContent: (html: string) => void;
}

interface EditorProps {
  content: string;
  setContent: (val: string) => void;
  onPageCountChange?: (count: number) => void;
}

export const Editor = forwardRef<EditorHandle, EditorProps>(({ content, setContent, onPageCountChange }, ref) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [fontFamily, setFontFamily] = useState<'Sans' | 'Serif'>('Sans');
  const [isInitialized, setIsInitialized] = useState(false);

  const PAGE_HEIGHT_PX = 1123; 

  const insertPageBreak = () => {
    if (editorRef.current) {
        editorRef.current.focus();
        const dividerHtml = `<div class="manual-page-break" contenteditable="false"></div><p><br></p>`;
        document.execCommand('insertHTML', false, dividerHtml);
        setContent(editorRef.current.innerHTML);
    }
  };

  const smartUpdate = (html: string) => {
    if (!editorRef.current) return;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const aiHeaders = tempDiv.querySelectorAll('h1, h2, h3');
    
    let updated = false;

    if (aiHeaders.length > 0) {
        const anchorHeader = aiHeaders[0];
        const headerText = anchorHeader.textContent?.trim().toLowerCase();

        const currentHeaders = editorRef.current.querySelectorAll('h1, h2, h3');
        let targetHeader: HTMLElement | null = null;

        for (const h of Array.from(currentHeaders) as HTMLElement[]) {
            if (h.textContent?.trim().toLowerCase() === headerText) {
                targetHeader = h;
                break;
            }
        }

        if (targetHeader) {
            const range = document.createRange();
            range.setStartBefore(targetHeader);
            
            let next = targetHeader.nextElementSibling;
            while (next && !['H1', 'H2', 'H3'].includes(next.tagName)) {
                next = next.nextElementSibling;
            }

            if (next) {
                range.setEndBefore(next);
            } else {
                range.setEndAfter(editorRef.current.lastChild || editorRef.current);
            }

            const selection = window.getSelection();
            if (selection) {
                editorRef.current.focus();
                selection.removeAllRanges();
                selection.addRange(range);
                
                // Seçilen alanı temizle (eski içerik silinir)
                selection.deleteFromDocument();
                
                // Yeni içeriği tam o noktaya yerleştir
                document.execCommand('insertHTML', false, html);
                updated = true;

                setTimeout(() => {
                    const newHeaders = editorRef.current?.querySelectorAll('h1, h2, h3');
                    for (const h of Array.from(newHeaders || []) as HTMLElement[]) {
                        if (h.textContent?.trim().toLowerCase() === headerText) {
                            h.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            break;
                        }
                    }
                }, 50);
            }
        }
    }

    if (!updated) {
        editorRef.current.focus();
        document.execCommand('insertHTML', false, html);
    }

    setContent(editorRef.current.innerHTML);
  };

  const replaceContent = (html: string) => {
    if (editorRef.current) {
      editorRef.current.innerHTML = html;
      setContent(html);
    }
  };

  useImperativeHandle(ref, () => ({
    insertText: (text: string) => {
      if (editorRef.current) {
        editorRef.current.focus();
        document.execCommand('insertHTML', false, text);
        setContent(editorRef.current.innerHTML);
      }
    },
    smartUpdate,
    replaceContent,
    clearContent: () => {
      if (editorRef.current) {
        editorRef.current.innerHTML = '<p><br></p>'; 
        setContent('');
        editorRef.current.focus();
      }
    },
    insertPageBreak,
    toggleFont: () => {
        setFontFamily(prev => prev === 'Sans' ? 'Serif' : 'Sans');
    },
    format: (cmd: string, val?: string) => {
        document.execCommand(cmd, false, val);
        editorRef.current?.focus();
    }
  }));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        insertPageBreak();
    }
  };

  useEffect(() => {
    if (editorRef.current) {
        if (!isInitialized || (content !== editorRef.current.innerHTML)) {
            editorRef.current.innerHTML = content || '<p><br></p>';
            setIsInitialized(true);
        }
    }
  }, [content, isInitialized]);

  const handleInput = () => {
    if (editorRef.current) {
        setContent(editorRef.current.innerHTML);
        const height = editorRef.current.scrollHeight;
        const pages = Math.max(1, Math.ceil(height / PAGE_HEIGHT_PX));
        if (onPageCountChange) onPageCountChange(pages);
    }
  };

  return (
    <div className="scroll-container flex-1 bg-[#0F172A]">
        <main 
            className="editor-workspace" 
            onClick={(e) => {
                if (e.target === e.currentTarget) editorRef.current?.focus();
            }}
        >
          <div 
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            data-font={fontFamily === 'Serif' ? 'serif' : 'sans'}
            className="a4-page editor-content"
            spellCheck={false}
          >
          </div>
        </main>
    </div>
  );
});

Editor.displayName = 'Editor';