export type TypingMode = 'free' | 'custom' | 'preset';

export type SoundType = 'thock' | 'clicky' | 'tactile' | 'bubble' | 'off';

export type KeyboardLayoutType = 'qwerty' | 'dvorak' | 'colemak';

export type FingerType = 'left-pinky' | 'left-ring' | 'left-middle' | 'left-index' | 'thumb' | 'right-index' | 'right-middle' | 'right-ring' | 'right-pinky';

export interface KeyDef {
  code: string;
  label: string;
  shiftLabel?: string;
  width?: number; // relative width, 1 is standard key
  finger?: FingerType;
  isHomeRow?: boolean;
}

export interface TypingStats {
  wpm: number;
  rawWpm: number;
  cpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  backspaces: number;
  elapsedSeconds: number;
  durationLimit: number | null; // null for stopwatch / unlimited
}

export interface SpeedHistoryPoint {
  second: number;
  wpm: number;
  rawWpm: number;
  errors: number;
}

export interface ThemeOption {
  id: string;
  name: string;
  bg: string;
  surface: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  accentSubtle: string;
  keyBg: string;
  keyActive: string;
  keyText: string;
}
