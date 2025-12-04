export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export type MirrorMode = 'horizontal' | 'vertical' | 'none';

export type FontName = 'Inter' | 'Roboto' | 'Open Sans' | 'Montserrat' | 'Playfair Display' | 'Merriweather';

export interface PDFConfig {
  mirrorMode: MirrorMode;
  gridRows: number;
  gridCols: number;
  showCutLines: boolean;
  font: FontName;
}