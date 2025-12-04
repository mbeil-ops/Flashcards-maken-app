import * as XLSX from 'xlsx';
import { Flashcard } from '../types';

export const parseExcelFile = async (file: File): Promise<Flashcard[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        
        // Assume first sheet
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        
        // Convert to JSON (array of arrays to handle headers easily or no headers)
        // header: 1 returns array of arrays
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

        const cards: Flashcard[] = [];
        
        // Filter out empty rows and map
        // We assume Column A is Front, Column B is Back.
        // We skip the first row if it looks like a header (optional, but simple heuristic: non-empty)
        // Let's just treat all rows as data unless user says otherwise, 
        // but typically row 1 is header. We'll skip row 1 if total rows > 1.
        
        const startRow = jsonData.length > 1 ? 1 : 0;

        for (let i = startRow; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (row && (row[0] || row[1])) {
            cards.push({
              id: `card-${i}`,
              front: row[0] ? String(row[0]) : '',
              back: row[1] ? String(row[1]) : '',
            });
          }
        }

        resolve(cards);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
};