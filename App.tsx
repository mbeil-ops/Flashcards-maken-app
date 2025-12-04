import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { PreviewGrid } from './components/PreviewGrid';
import { generateFlashcardPDF } from './services/pdfGenerator';
import { Flashcard, MirrorMode, FontName } from './types';
import { Download, Printer, AlertCircle, CheckCircle2, RefreshCw, Type, Sparkles, Eye, FileSpreadsheet } from 'lucide-react';

const App: React.FC = () => {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [fileName, setFileName] = useState<string>('');
  
  // Fixed settings as requested
  // Horizontal mirror mode corresponds to [3, 2, 1] layout for 'flip on short edge'
  const mirrorMode: MirrorMode = 'horizontal';
  const showCutLines = true;
  
  const [selectedFont, setSelectedFont] = useState<FontName>('Inter');

  const handleDataLoaded = (loadedCards: Flashcard[], name: string) => {
    setCards(loadedCards);
    setFileName(name);
  };

  const handleReset = () => {
    setCards([]);
    setFileName('');
  };

  const handleDownload = () => {
    if (cards.length === 0) return;
    generateFlashcardPDF({
      cards,
      mirrorMode,
      showCutLines,
      font: selectedFont,
    });
  };

  const fontOptions: FontName[] = [
    'Inter',
    'Roboto',
    'Open Sans',
    'Montserrat',
    'Playfair Display',
    'Merriweather'
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans text-slate-900">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-20 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Removed Printer Icon as requested */}
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Begrippen leren met flashcards</h1>
          </div>
          {cards.length > 0 && (
             <button 
                onClick={handleReset}
                className="group flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300"
             >
                <RefreshCw className="w-4 h-4 transition-transform group-hover:rotate-180 duration-500" /> 
                Opnieuw beginnen
             </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* State: No File Loaded */}
        {cards.length === 0 ? (
          <div className="max-w-3xl mx-auto mt-8 sm:mt-16 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="w-3 h-3" /> Gratis PDF Generator
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">Flashcard maker</span>
              </h2>
              <p className="text-slate-600 text-lg max-w-xl mx-auto leading-relaxed">
                Heb je een begrippenlijst? Upload je bestand en wij zetten het om naar een perfecte dubbelzijdige PDF. Alleen nog even printen en snijden!
              </p>
            </div>
            
            <div className="transform transition-all duration-300 hover:scale-[1.01]">
                <FileUpload onDataLoaded={handleDataLoaded} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
               {[
                 { step: 1, title: 'Upload', desc: 'Excel-bestand met 2 kolommen', color: 'blue', icon: FileSpreadsheet },
                 { step: 2, title: 'Voorbeeld', desc: 'Controleer de uitlijning', color: 'violet', icon: Eye },
                 { step: 3, title: 'Print', desc: 'Dubbelzijdige PDF', color: 'emerald', icon: Printer }
               ].map((item) => (
                 <div key={item.step} className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white shadow-sm hover:shadow-md transition-shadow text-center group">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-${item.color}-50 text-${item.color}-600 font-bold text-lg group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                      {item.step}
                    </div>
                    <h3 className="font-bold text-slate-800 text-lg">{item.title}</h3>
                    <p className="text-sm text-slate-500 mt-2">{item.desc}</p>
                 </div>
               ))}
            </div>
          </div>
        ) : (
          /* State: File Loaded */
          <div className="space-y-8 animate-in fade-in duration-700">
            
            {/* Control Bar */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-slate-200/50 border border-white/50 p-6 md:p-8 flex flex-col gap-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50 to-transparent opacity-50 rounded-bl-full pointer-events-none"></div>

              {/* Top Row: File Info */}
              <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-full">
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            {fileName}
                        </h2>
                        <p className="text-slate-500 font-medium">
                        {cards.length} kaarten gereed (Liggend formaat)
                        </p>
                    </div>
                  </div>
              </div>

              {/* Controls */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end border-t border-slate-100 pt-8 relative z-10">
                 
                 {/* Left Controls */}
                 <div className="md:col-span-8 flex flex-col sm:flex-row gap-6">
                    {/* Font Selector */}
                    <div className="space-y-2 w-full sm:max-w-xs">
                        <label className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-2">
                            <Type className="w-3 h-3" /> Typografie
                        </label>
                        <div className="relative group">
                            <select 
                                value={selectedFont}
                                onChange={(e) => setSelectedFont(e.target.value as FontName)}
                                className="w-full appearance-none bg-slate-50 hover:bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 font-medium py-3 pl-4 pr-10 rounded-xl transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/10 cursor-pointer shadow-sm"
                                style={{ fontFamily: selectedFont }}
                            >
                                {fontOptions.map(font => (
                                    <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400 group-hover:text-indigo-500 transition-colors">
                                <Type className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                 </div>

                 {/* Action Button */}
                 <div className="md:col-span-4 flex justify-end">
                     <button 
                        onClick={handleDownload}
                        className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-lg font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-indigo-200 transform hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] active:translate-y-0"
                     >
                        <Download className="w-5 h-5" />
                        Download PDF
                     </button>
                 </div>
              </div>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50/80 backdrop-blur-sm border border-blue-100 rounded-xl p-5 flex gap-4 items-center shadow-sm">
                <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <div className="text-sm text-blue-900 leading-relaxed">
                    <p className="font-bold">Printtip: stel in op 'flip on short edge' .</p>
                </div>
            </div>

            {/* Visual Preview */}
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-4">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Printer className="w-5 h-5 text-indigo-500" />
                        Live Printvoorbeeld
                    </h3>
                </div>
                <PreviewGrid cards={cards} mirrorMode={mirrorMode} font={selectedFont} />
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default App;