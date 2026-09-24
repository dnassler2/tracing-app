export type GridType = 'none' | 'thirds' | 'dense' | 'diagonal' | 'golden';
export type GridColor = 'white' | 'black' | 'cyan' | 'yellow' | 'red';
export type FilterMode = 'normal' | 'grayscale' | 'high-contrast' | 'edge-outline';
export type BlendMode = 'normal' | 'multiply' | 'screen' | 'difference';

export interface ImageTransform {
  scale: number;
  x: number;
  y: number;
  rotation: number; // degrees
  flipH: boolean;
  flipV: boolean;
}

export interface GridConfig {
  type: GridType;
  denseDivisions: number; // e.g. 4, 6, 8, 12
  color: GridColor;
  opacity: number; // 0.1 to 1
  thickness: number; // 1, 2, 3
  showCoordinates: boolean; // A-H, 1-8
  showCenterCross: boolean;
}

export interface ImageAdjustments {
  opacity: number; // 0 to 1
  brightness: number; // 0.2 to 2.0
  contrast: number; // 0.5 to 2.5
  invert: boolean;
  filterMode: FilterMode;
  blendMode: BlendMode;
}

export interface ReferenceImage {
  id: string;
  name: string;
  url: string;
  source: 'upload' | 'sample';
}
