import React, { useCallback } from 'react';
import { Upload, FileSpreadsheet, Plus } from 'lucide-react';
import { parseExcelFile } from '../utils/excelParser';
import { Flashcard } from '../types';

interface FileUploadProps {
  onDataLoaded: (cards: Flashcard[], fileName: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const cards = await parseExcelFile(file);
        onDataLoaded(cards, file.name);
      } catch (error) {
        console.error("Error parsing file:", error);
        alert("Kon het Excel-bestand niet verwerken. Zorg ervoor dat het twee kolommen bevat.");
      }
    }
  }, [onDataLoaded]);

  return (
    <div className="w-full max-w-xl mx-auto">
      <label 
        htmlFor="file-upload" 
        className="relative flex flex-col items-center justify-center w-full h-72 border-2 border-indigo-100 border-dashed rounded-3xl cursor-pointer bg-white/50 hover:bg-white hover:border-indigo-400 transition-all duration-300 group shadow-sm hover:shadow-md overflow-hidden"
      >
        {/* Background decorative blob */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-6 relative z-10">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-indigo-200 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative p-5 bg-gradient-to-br from-indigo-50 to-white rounded-2xl shadow-sm border border-indigo-50 group-hover:scale-110 transition-transform duration-300">
                <Upload className="w-10 h-10 text-indigo-600" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-green-100 text-green-600 rounded-full p-1.5 border-2 border-white shadow-sm group-hover:scale-110 transition-transform delay-75">
                <Plus className="w-4 h-4" />
            </div>
          </div>

          <h3 className="mb-2 text-xl font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">
            Upload Excel-bestand
          </h3>
          <p className="text-sm text-slate-500 mb-6 max-w-xs mx-auto leading-relaxed">
            Sleep je <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-mono text-xs">.xlsx</code> bestand hierheen, of klik om te bladeren.
          </p>
          
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl shadow-md shadow-indigo-200 group-hover:bg-indigo-700 transition-all active:scale-95">
             <FileSpreadsheet className="w-4 h-4" />
             <span className="font-medium">Selecteer bestand</span>
          </div>
        </div>
        <input 
            id="file-upload" 
            type="file" 
            className="hidden" 
            accept=".xlsx, .xls"
            onChange={handleFileChange}
        />
      </label>
    </div>
  );
};