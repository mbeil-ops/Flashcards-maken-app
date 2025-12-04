import React from 'react';
import { Flashcard, MirrorMode, FontName } from '../types';
import { ArrowRightLeft, ArrowUpDown, Ban } from 'lucide-react';

interface PreviewGridProps {
  cards: Flashcard[];
  mirrorMode: MirrorMode;
  font: FontName;
}

export const PreviewGrid: React.FC<PreviewGridProps> = ({ cards, mirrorMode, font }) => {
  // Take the first 9 cards for preview
  const previewCards = cards.slice(0, 9);
  // Pad with placeholders if less than 9
  const gridItems = [...previewCards, ...Array(9 - previewCards.length).fill(null)];

  return (
    <div className="flex flex-col xl:flex-row gap-8 items-start justify-center w-full">
      {/* Front Page Preview */}
      <div className="flex-1 w-full max-w-2xl mx-auto">
        <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="bg-indigo-100 text-indigo-600 w-6 h-6 rounded-full flex items-center justify-center text-[10px]">1</span>
            Pagina 1: Begrippen (Voorkant)
        </h3>
        {/* Paper Container - Landscape Aspect Ratio */}
        <div className="bg-white p-4 rounded-xl shadow-xl shadow-slate-200 border border-slate-100">
            <div className="grid grid-cols-3 gap-2 aspect-[297/210] bg-slate-50 p-2 border-2 border-dashed border-slate-200 rounded-lg">
            {gridItems.map((item, idx) => (
                <div 
                    key={`front-${idx}`} 
                    className="relative bg-gradient-to-br from-indigo-50 to-white rounded-lg shadow-sm border border-indigo-100 p-2 flex items-center justify-center text-center overflow-hidden group hover:shadow-md transition-shadow"
                    style={{ fontFamily: font }}
                >
                {/* Decorative Geometric Background */}
                <div className="absolute top-0 right-0 w-8 h-8 bg-indigo-100/50 rounded-bl-full -mr-2 -mt-2"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 bg-purple-100/50 rounded-tr-full -ml-2 -mb-2"></div>
                
                {item ? (
                    <>
                        <span className="relative z-10 text-[10px] sm:text-xs font-bold text-slate-800 line-clamp-4 leading-relaxed">
                            {item.front}
                        </span>
                        <div className="absolute top-1 left-1.5 text-[8px] font-bold text-indigo-300 font-sans">
                            {idx + 1}
                        </div>
                    </>
                ) : (
                    <span className="text-slate-200 text-xs font-sans">Leeg</span>
                )}
                </div>
            ))}
            </div>
        </div>
      </div>

      {/* Mirror Indicator */}
      <div className="flex xl:flex-col items-center justify-center gap-3 text-slate-400 my-auto py-4 xl:py-0">
        <div className="h-px xl:h-12 w-12 xl:w-px bg-slate-200"></div>
        {mirrorMode === 'vertical' && (
             <div className="flex flex-col items-center gap-2 bg-white p-3 rounded-lg shadow-sm border border-slate-100">
                <div className="bg-purple-50 p-2 rounded-md">
                    <ArrowUpDown className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-[10px] uppercase font-bold text-slate-500 text-center">Verticaal<br/>(Rijen)</span>
             </div>
        )}
        {mirrorMode === 'horizontal' && (
             <div className="flex flex-col items-center gap-2 bg-white p-3 rounded-lg shadow-sm border border-slate-100">
                <div className="bg-indigo-50 p-2 rounded-md">
                     <ArrowRightLeft className="w-5 h-5 text-indigo-600" />
                </div>
                <span className="text-[10px] uppercase font-bold text-slate-500 text-center">Horizontaal<br/>(Kolommen)</span>
             </div>
        )}
        {mirrorMode === 'none' && (
             <div className="flex flex-col items-center gap-2 bg-white p-3 rounded-lg shadow-sm border border-slate-100">
                <div className="bg-slate-50 p-2 rounded-md">
                    <Ban className="w-5 h-5 text-slate-600" />
                </div>
                <span className="text-[10px] uppercase font-bold text-slate-500">Geen</span>
             </div>
        )}
        <div className="h-px xl:h-12 w-12 xl:w-px bg-slate-200"></div>
      </div>

      {/* Back Page Preview */}
      <div className="flex-1 w-full max-w-2xl mx-auto">
        <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-600 w-6 h-6 rounded-full flex items-center justify-center text-[10px]">2</span>
            Pagina 2: Definities (Achterkant)
        </h3>
        {/* Paper Container - Landscape Aspect Ratio */}
        <div className="bg-white p-4 rounded-xl shadow-xl shadow-slate-200 border border-slate-100">
            <div className="grid grid-cols-3 gap-2 aspect-[297/210] bg-slate-50 p-2 border-2 border-dashed border-slate-200 rounded-lg">
            {/* Logic to rearrange items for LANDSCAPE */}
            {Array(9).fill(null).map((_, idx) => {
                const fullSlots = gridItems; 
                const mirroredSlots = new Array(9).fill(null);
                
                for (let r=0; r<3; r++) {
                    for (let c=0; c<3; c++) {
                        const origIdx = r*3 + c;
                        let targetIdx = origIdx;
                        
                        if (mirrorMode === 'vertical') {
                            // Landscape: Long Edge is Top/Bottom. Flip Vertical (Rows).
                            // Front Row 1 -> Back Row 3
                            targetIdx = ((3-1)-r)*3 + c;
                        }
                        else if (mirrorMode === 'horizontal') {
                            // Landscape: Short Edge is Left/Right. Flip Horizontal (Cols).
                            // Front Row 1 -> Back Row 1 (Reversed)
                            targetIdx = (r*3) + ((3-1)-c);
                        }
                        
                        mirroredSlots[targetIdx] = fullSlots[origIdx];
                    }
                }

                const item = mirroredSlots[idx];
                const originalIndex = gridItems.indexOf(item);

                return (
                    <div 
                        key={`back-${idx}`} 
                        className="relative bg-gradient-to-br from-emerald-50 to-white rounded-lg shadow-sm border border-emerald-100 p-2 flex items-center justify-center text-center overflow-hidden group hover:shadow-md transition-shadow"
                        style={{ fontFamily: font }}
                    >
                    {/* Decorative Geometric Background */}
                    <div className="absolute top-0 left-0 w-8 h-8 bg-emerald-100/50 rounded-br-full -ml-2 -mt-2"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-teal-100/50 rounded-tl-full -mr-2 -mb-2"></div>

                    {item ? (
                        <>
                            <span className="relative z-10 text-[9px] sm:text-[10px] text-slate-600 line-clamp-5 leading-tight">
                                {item.back}
                            </span>
                            {originalIndex !== -1 && (
                                <div className="absolute top-1 right-1.5 text-[8px] font-bold text-emerald-300 font-sans">
                                    #{originalIndex + 1}
                                </div>
                            )}
                        </>
                    ) : (
                        <span className="text-slate-200 text-xs font-sans">Leeg</span>
                    )}
                    </div>
                );
            })}
            </div>
        </div>
      </div>
    </div>
  );
};