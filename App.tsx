import React, { useState, useRef, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Toolbar } from './components/Toolbar';
import { Editor, EditorHandle } from './components/Editor';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { AcademicDocument } from './types';

export type ThemeColor = 'slate' | 'indigo' | 'emerald' | 'rose';

const PROTOCOL_TEMPLATES: Record<string, { title: string; content: string }> = {
    blank: { title: 'Yeni Çalışma', content: '<p><br></p>' },
    literature: { 
        title: 'Literatür Taraması: Derin Öğrenme ve Radyoloji', 
        content: `<h1>RADYOLOJİDE DERİN ÖĞRENME: LİTERATÜR ANALİZİ</h1>
        <h3>1. GİRİŞ</h3><p>Son on yılda, konvolüsyonel sinir ağları (CNN), tıbbi görüntü işlemede devrim yaratmıştır. Özellikle Smith ve ark. (2021) tarafından yapılan çalışmalar, göğüs röntgenlerinde anomali tespitinde %98 doğruk oranına ulaşılabileceğini göstermiştir.</p>
        <h3>2. MEVCUT ÇALIŞMALAR</h3><p>Jones (2022), veri setlerinin çeşitliliğinin model başarısındaki en kritik faktör olduğunu savunmaktadır. Buna karşılık, Karpat (2023) algoritmik verimliliğin donanım kısıtlı ortamlarda daha öncelikli olduğunu belirtmiştir.</p>
        <p><i>NOT: Bu taslağı genişletmek için AI Sohbeti'ne "Bu çalışmalardaki metodolojik farkları özetle" diyebilirsiniz.</i></p>` 
    },
    data: { 
        title: 'Veri Analizi: Öğrenci Motivasyon Anketi', 
        content: `<h1>ANKET VERİLERİ VE ANALİZ RAPORU</h1>
        <h3>HAM VERİ SETİ (Kopyalanabilir)</h3>
        <p>Cinsiyet, Puan, Motivasyon_Skoru, Katılım_Oranı</p>
        <p>Kadın, 85, 4.2, 0.92 | Erkek, 78, 3.8, 0.85 | Kadın, 92, 4.8, 0.98 | Erkek, 65, 3.1, 0.70 | Kadın, 88, 4.5, 0.95</p>
        <p><b>ANALİZ GÖREVİ:</b> Bu ham verileri kopyalayıp "İstatistik Görselleştirici" ajanına yapıştırarak profesyonel bir akademik tablo oluşturabilirsiniz.</p>` 
    },
    audit: { 
        title: 'Yayın Denetimi: Sosyal Medya ve Psikoloji', 
        content: `<h1>MAKALE DENETİM TASLAĞI</h1>
        <p>Aşağıdaki metin editör aşamasından geçmesi için analiz edilmelidir:</p>
        <p>"Sosyal medya kullanımı gençlerde anksiyete yapar. Birçok araştırma bunu kanıtlamıştır. Bu makalede biz de bu konuyu inceledik ve benzer sonuçlar bulduk. Metodumuz ise anket yapmak üzerine kuruludur."</p>
        <p><i>NOT: Bu metni "Desk Rejection Simülatörü" ajanı ile taratarak neden reddedilebileceğini görebilirsiniz.</i></p>` 
    },
    grant: { 
        title: 'TÜBİTAK 1001: Akıllı Şehir Atık Yönetimi', 
        content: `<h1>PROJE ÖNERİSİ: AKILLI ŞEHİRLERDE SIFIR ATIK</h1>
        <h3>1. ÖZGÜN DEĞER</h3><p>Önerilen proje, kentsel atık toplama rotalarını yapay zeka tabanlı "gerçek zamanlı sensör füzyonu" ile optimize etmeyi hedeflemektedir. Mevcut sistemler statik planlama yaparken, bu proje dinamik yük takibi sunmaktadır.</p>
        <h3>2. YÖNTEM</h3><p>Atık konteynerlerine yerleştirilecek ultrasonik mesafe sensörleri, doluluk oranlarını LoRaWAN protokolü üzerinden merkeze iletecektir.</p>` 
    },
    thesis: { 
        title: 'Tez Yazım Taslağı: Blokzincir ve Tedarik Zinciri', 
        content: `<h1>TEZ: BLOKZİNCİR TEKNOLOJİSİNİN LOJİSTİKTEKİ ETKİSİ</h1>
        <h3>ÖZET</h3><p>Bu çalışma, hiper-yerel tedarik zincirlerinde şeffaflık sorununu blokzincir teknolojisi ile çözmeyi amaçlamaktadır. İlk bulgular, güven maliyetlerinin %40 oranında azaldığını göstermektedir.</p>` 
    },
    conference: { 
        title: 'Görsel Analiz Taslağı: Karbon Emisyonları', 
        content: `<h1>KÜRESEL EMİSYON TRENDLERİ ANALİZİ</h1>
        <h3>ŞEKİL 1: KARBON EMİSYONLARI</h3>
        <p>[BURAYA GÖRSEL GELECEK: 2018-2024 Karbon Emisyonu Grafiği]</p>
        <p>Grafikteki veriler emisyonların 2020'de düştüğünü ama sonra hızla arttığını gösteriyor.</p>
        <p><b>GÖREV:</b> Sağdaki "Şekil Yorumlayıcı" ajanına demo veriyi yükleyip çalıştırarak bu bölümü profesyonelce güncelleyin.</p>` 
    }
};

const DEMO_DOCUMENTS: AcademicDocument[] = Object.entries(PROTOCOL_TEMPLATES).map(([key, val], idx) => ({
    id: `demo-${key}-${idx}`,
    title: val.title,
    content: val.content,
    lastModified: Date.now() - (idx * 3600000),
    wordCount: val.content.split(' ').length,
    preview: val.content.substring(0, 100).replace(/<[^>]*>/g, '') + '...'
}));

const App: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'editor'>('dashboard');
  const [documents, setDocuments] = useState<AcademicDocument[]>([]);
  const [currentDocId, setCurrentDocId] = useState<string | null>(null);
  const [themeColor, setThemeColor] = useState<ThemeColor>('slate'); 
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [documentContent, setDocumentContent] = useState('');
  const [docTitle, setDocTitle] = useState('İsimsiz Çalışma');
  const [wordCount, setWordCount] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  
  const editorRef = useRef<EditorHandle>(null);

  useEffect(() => {
    const savedDocs = localStorage.getItem('academic-agent-docs');
    if (savedDocs) {
        try {
            const parsed = JSON.parse(savedDocs);
            if (parsed.length < 1) {
                 setDocuments(DEMO_DOCUMENTS);
                 saveToStorage(DEMO_DOCUMENTS);
            } else {
                 setDocuments(parsed);
            }
        } catch (e) {
            setDocuments(DEMO_DOCUMENTS);
        }
    } else {
        setDocuments(DEMO_DOCUMENTS);
        saveToStorage(DEMO_DOCUMENTS);
    }
  }, []);

  const saveToStorage = (docs: AcademicDocument[]) => {
      localStorage.setItem('academic-agent-docs', JSON.stringify(docs));
  };

  useEffect(() => {
    if (!currentDocId || view !== 'editor') return;

    setIsSaving(true);
    const timeoutId = setTimeout(() => {
        const text = documentContent.replace(/<[^>]*>/g, ' ');
        const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
        const preview = text.substring(0, 150) + '...';

        setDocuments(prevDocs => {
            const updatedDocs = prevDocs.map(doc => 
                doc.id === currentDocId 
                    ? { ...doc, title: docTitle, content: documentContent, wordCount: words, preview, lastModified: Date.now() }
                    : doc
            );
            saveToStorage(updatedDocs);
            return updatedDocs;
        });
        setIsSaving(false);
        setWordCount(words);
    }, 1000); 

    return () => clearTimeout(timeoutId);
  }, [documentContent, docTitle, currentDocId]);

  const handleCreateDocument = (type: string = 'blank') => {
    const template = PROTOCOL_TEMPLATES[type] || PROTOCOL_TEMPLATES.blank;
    const newDoc: AcademicDocument = {
        id: Date.now().toString(),
        title: template.title,
        content: template.content,
        lastModified: Date.now(),
        wordCount: template.content.split(' ').length,
        preview: template.content.substring(0, 100).replace(/<[^>]*>/g, '') + '...'
    };
    setDocuments([newDoc, ...documents]);
    saveToStorage([newDoc, ...documents]);
    setCurrentDocId(newDoc.id);
    setDocTitle(newDoc.title);
    setDocumentContent(newDoc.content);
    setView('editor');
  };

  const handleOpenDocument = (doc: AcademicDocument) => {
      setCurrentDocId(doc.id);
      setDocTitle(doc.title);
      setDocumentContent(doc.content || '<p><br></p>');
      setView('editor');
  };

  const handleDeleteDocument = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      const updatedDocs = documents.filter(d => d.id !== id);
      setDocuments(updatedDocs);
      saveToStorage(updatedDocs);
  };

  const handleGoHome = () => setView('dashboard');
  
  const handleInsertContent = (text: string) => editorRef.current?.insertText(text);
  const handleSmartUpdate = (html: string) => editorRef.current?.smartUpdate(html);
  const handleReplaceContent = (html: string) => editorRef.current?.replaceContent(html);
  const handlePageBreak = () => editorRef.current?.insertPageBreak();
  const handleToggleFont = () => editorRef.current?.toggleFont();
  const handleFormat = (cmd: string, val?: string) => editorRef.current?.format(cmd, val);
  const handlePageCountChange = (count: number) => setPageCount(count);

  if (view === 'dashboard') {
      return (
          <Dashboard 
            documents={documents}
            onCreateDocument={handleCreateDocument}
            onOpenDocument={handleOpenDocument}
            onDeleteDocument={handleDeleteDocument}
          />
      );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0B0F17]">
      <Navbar 
        onGoHome={handleGoHome}
        title={docTitle}
        setTitle={setDocTitle}
        wordCount={wordCount}
        pageCount={pageCount}
        isSaving={isSaving}
        themeColor={themeColor}
        isSidebarOpen={isSidebarOpen}
      />
      
      <div className="flex flex-1 overflow-hidden relative z-10">
        <div className={`flex-1 transition-all duration-300 ease-in-out transform ${isSidebarOpen ? 'md:-translate-x-[210px] -translate-x-[50%]' : 'translate-x-0'}`}>
            <Editor 
                key={currentDocId} 
                ref={editorRef}
                content={documentContent} 
                setContent={setDocumentContent}
                onPageCountChange={handlePageCountChange}
            />
        </div>
        
        <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
            documentContent={documentContent}
            onInsertContent={handleInsertContent}
            onSmartUpdate={handleSmartUpdate}
            onReplaceContent={handleReplaceContent}
        />
      </div>

      <Toolbar 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        isSidebarOpen={isSidebarOpen}
        onInsertPageBreak={handlePageBreak}
        onToggleFont={handleToggleFont}
        onFormat={handleFormat}
        themeColor={themeColor} 
      />
    </div>
  );
};

export default App;
