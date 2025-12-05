import jsPDF from 'jspdf';
import { Flashcard, MirrorMode, FontName } from '../types';

interface GeneratePDFParams {
  cards: Flashcard[];
  mirrorMode: MirrorMode;
  showCutLines: boolean;
  font: FontName;
}

export const generateFlashcardPDF = ({ cards, mirrorMode, showCutLines, font }: GeneratePDFParams) => {
  // Switch to Landscape
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  // A4 Landscape Dimensions
  const PAGE_WIDTH = 297;
  const PAGE_HEIGHT = 210;
  
  // Exact 3x3 Grid as requested
  const ROWS = 3;
  const COLS = 3;
  
  // Calculate cell size
  const MARGIN = 10;
  const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN * 2);
  const CONTENT_HEIGHT = PAGE_HEIGHT - (MARGIN * 2);
  const CELL_WIDTH = CONTENT_WIDTH / COLS;
  const CELL_HEIGHT = CONTENT_HEIGHT / ROWS;

  // Map Google Font to Standard PDF Font
  let pdfFont = 'helvetica';
  if (font === 'Playfair Display' || font === 'Merriweather') {
    pdfFont = 'times';
  } else if (font === 'Inter' || font === 'Roboto' || font === 'Montserrat' || font === 'Open Sans') {
    pdfFont = 'helvetica';
  }

  const itemsPerPage = ROWS * COLS;
  const totalPages = Math.ceil(cards.length / itemsPerPage);

  for (let pageIdx = 0; pageIdx < totalPages; pageIdx++) {
    const pageStartIndex = pageIdx * itemsPerPage;
    const pageItems = cards.slice(pageStartIndex, pageStartIndex + itemsPerPage);

    // --- PAGE 1: FRONTS (CONCEPTS) ---
    if (pageIdx > 0) doc.addPage();
    
    // Draw Fronts
    pageItems.forEach((card, index) => {
      const row = Math.floor(index / COLS);
      const col = index % COLS;
      
      const x = MARGIN + (col * CELL_WIDTH);
      const y = MARGIN + (row * CELL_HEIGHT);

      drawCard(doc, x, y, CELL_WIDTH, CELL_HEIGHT, card.front, showCutLines, pdfFont, true);
    });

    // --- PAGE 2: BACKS (DEFINITIONS) ---
    doc.addPage();
    
    // Create a reordered array for the back page based on mirroring logic
    const fullPageSlots = Array(itemsPerPage).fill(null).map((_, i) => pageItems[i] || null);
    
    // Apply mirroring transformation
    const mirroredSlots = getMirroredLayout(fullPageSlots, mirrorMode, ROWS, COLS);

    mirroredSlots.forEach((card, index) => {
        if (!card) return; // Empty slot
        
        const row = Math.floor(index / COLS);
        const col = index % COLS;
        
        const x = MARGIN + (col * CELL_WIDTH);
        const y = MARGIN + (row * CELL_HEIGHT);

        drawCard(doc, x, y, CELL_WIDTH, CELL_HEIGHT, card.back, showCutLines, pdfFont, false);
    });
  }

  doc.save('flashcards-landscape.pdf');
};

const drawCard = (
  doc: jsPDF, 
  x: number, 
  y: number, 
  w: number, 
  h: number, 
  text: string, 
  showCutLines: boolean,
  fontName: string,
  isFront: boolean
) => {
  // --- Graphic Design Background ---
  
  // 1. Base Pastel Color
  if (isFront) {
    doc.setFillColor(248, 250, 252); // Slate-50
  } else {
    doc.setFillColor(240, 253, 244); // Green-50
  }
  
  doc.rect(x, y, w, h, 'F');

  // 2. Abstract Geometric Pattern (Simple Circle corner)
  if (isFront) {
    doc.setFillColor(224, 231, 255); // Indigo-100
    doc.circle(x + w, y, 15, 'F'); // Top right corner circle
  } else {
    doc.setFillColor(209, 250, 229); // Emerald-100
    doc.circle(x, y, 15, 'F'); // Top left corner circle
  }

  // --- Cut Lines (Dashed) ---
  if (showCutLines) {
    doc.setDrawColor(203, 213, 225); // Slate-300
    doc.setLineWidth(0.1);
    doc.setLineDash([2, 2], 0);
    doc.rect(x, y, w, h); // Draw border on top of fills
    doc.setLineDash([], 0); // Reset
  }

  // --- Text with Auto-Fit ---
  if (text) {
    doc.setFont(fontName);
    doc.setTextColor(30, 41, 59); // Slate-800
    
    const textPadding = 6;
    const maxTextWidth = w - (textPadding * 2);
    const maxTextHeight = h - (textPadding * 2);

    // Initial settings
    let fontSize = 14; 
    const minFontSize = 6;
    const lineSpacingFactor = 1.2;
    const ptToMm = 0.3528; // 1 pt = ~0.3528 mm

    let textLines: string[] = [];
    let totalBlockHeight = 0;

    // Iteratively reduce font size until text fits vertically
    while (fontSize >= minFontSize) {
        doc.setFontSize(fontSize);
        textLines = doc.splitTextToSize(text, maxTextWidth);
        
        const lineHeightMm = fontSize * ptToMm * lineSpacingFactor;
        totalBlockHeight = textLines.length * lineHeightMm;

        if (totalBlockHeight <= maxTextHeight) {
            break; 
        }
        
        fontSize -= 0.5;
    }

    // Apply final calculated font size
    doc.setFontSize(fontSize);
    
    // Recalculate lines one last time to be sure (splitTextToSize uses current font size)
    textLines = doc.splitTextToSize(text, maxTextWidth);
    const lineHeightMm = fontSize * ptToMm * lineSpacingFactor;
    totalBlockHeight = textLines.length * lineHeightMm;

    // Calculate Vertical Center
    // StartY = BoxCenterY - HalfBlockHeight + BaselineCorrection
    // Baseline correction for jsPDF text is roughly fontSize * 0.8 (ascent)
    const startY = y + ((h - totalBlockHeight) / 2) + (fontSize * ptToMm * 0.8);

    doc.text(textLines, x + (w / 2), startY, { align: 'center', lineHeightFactor: lineSpacingFactor });
  }
};

const getMirroredLayout = (
  items: (Flashcard | null)[], 
  mode: MirrorMode, 
  rows: number, 
  cols: number
): (Flashcard | null)[] => {
    const result = new Array(items.length).fill(null);

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const originalIndex = (r * cols) + c;
            const item = items[originalIndex];
            
            let targetIndex = originalIndex;

            if (mode === 'vertical') {
                // VERTICAL FLIP (Mirror Rows)
                // Front Row 1 -> Back Row 3
                const newRow = (rows - 1) - r;
                targetIndex = (newRow * cols) + c;
            } else if (mode === 'horizontal') {
                // HORIZONTAL FLIP (Mirror Columns)
                // Front Row 1: D1, D2, D3 -> Back Row 1: D3, D2, D1
                const newCol = (cols - 1) - c;
                targetIndex = (r * cols) + newCol;
            }
            
            result[targetIndex] = item;
        }
    }
    return result;
};