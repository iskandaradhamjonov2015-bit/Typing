import { KeyDef, FingerType } from '../types';

export const FINGER_COLORS: Record<FingerType, { bg: string; dot: string; labelUz: string; labelEn: string }> = {
  'left-pinky': { bg: 'border-pink-500/40', dot: '#ec4899', labelUz: 'Chap jimjiloq', labelEn: 'Left Pinky' },
  'left-ring': { bg: 'border-orange-500/40', dot: '#f97316', labelUz: 'Chap nomsiz', labelEn: 'Left Ring' },
  'left-middle': { bg: 'border-amber-500/40', dot: '#f59e0b', labelUz: 'Chap o\'rta', labelEn: 'Left Middle' },
  'left-index': { bg: 'border-emerald-500/40', dot: '#10b981', labelUz: 'Chap ko\'rsatkich', labelEn: 'Left Index' },
  'thumb': { bg: 'border-cyan-500/40', dot: '#06b6d4', labelUz: 'Bosh barmoq', labelEn: 'Thumb' },
  'right-index': { bg: 'border-blue-500/40', dot: '#3b82f6', labelUz: 'O\'ng ko\'rsatkich', labelEn: 'Right Index' },
  'right-middle': { bg: 'border-indigo-500/40', dot: '#6366f1', labelUz: 'O\'ng o\'rta', labelEn: 'Right Middle' },
  'right-ring': { bg: 'border-purple-500/40', dot: '#a855f7', labelUz: 'O\'ng nomsiz', labelEn: 'Right Ring' },
  'right-pinky': { bg: 'border-rose-500/40', dot: '#f43f5e', labelUz: 'O\'ng jimjiloq', labelEn: 'Right Pinky' },
};

export const QWERTY_ROWS: KeyDef[][] = [
  // Row 1: Number Row
  [
    { code: 'Backquote', label: '`', shiftLabel: '~', finger: 'left-pinky' },
    { code: 'Digit1', label: '1', shiftLabel: '!', finger: 'left-pinky' },
    { code: 'Digit2', label: '2', shiftLabel: '@', finger: 'left-ring' },
    { code: 'Digit3', label: '3', shiftLabel: '#', finger: 'left-middle' },
    { code: 'Digit4', label: '4', shiftLabel: '$', finger: 'left-index' },
    { code: 'Digit5', label: '5', shiftLabel: '%', finger: 'left-index' },
    { code: 'Digit6', label: '6', shiftLabel: '^', finger: 'right-index' },
    { code: 'Digit7', label: '7', shiftLabel: '&', finger: 'right-index' },
    { code: 'Digit8', label: '8', shiftLabel: '*', finger: 'right-middle' },
    { code: 'Digit9', label: '9', shiftLabel: '(', finger: 'right-ring' },
    { code: 'Digit0', label: '0', shiftLabel: ')', finger: 'right-pinky' },
    { code: 'Minus', label: '-', shiftLabel: '_', finger: 'right-pinky' },
    { code: 'Equal', label: '=', shiftLabel: '+', finger: 'right-pinky' },
    { code: 'Backspace', label: 'backspace', width: 2, finger: 'right-pinky' },
  ],
  // Row 2: Top letter row
  [
    { code: 'Tab', label: 'tab', width: 1.5, finger: 'left-pinky' },
    { code: 'KeyQ', label: 'q', shiftLabel: 'Q', finger: 'left-pinky' },
    { code: 'KeyW', label: 'w', shiftLabel: 'W', finger: 'left-ring' },
    { code: 'KeyE', label: 'e', shiftLabel: 'E', finger: 'left-middle' },
    { code: 'KeyR', label: 'r', shiftLabel: 'R', finger: 'left-index' },
    { code: 'KeyT', label: 't', shiftLabel: 'T', finger: 'left-index' },
    { code: 'KeyY', label: 'y', shiftLabel: 'Y', finger: 'right-index' },
    { code: 'KeyU', label: 'u', shiftLabel: 'U', finger: 'right-index' },
    { code: 'KeyI', label: 'i', shiftLabel: 'I', finger: 'right-middle' },
    { code: 'KeyO', label: 'o', shiftLabel: 'O', finger: 'right-ring' },
    { code: 'KeyP', label: 'p', shiftLabel: 'P', finger: 'right-pinky' },
    { code: 'BracketLeft', label: '[', shiftLabel: '{', finger: 'right-pinky' },
    { code: 'BracketRight', label: ']', shiftLabel: '}', finger: 'right-pinky' },
    { code: 'Backslash', label: '\\', shiftLabel: '|', width: 1.5, finger: 'right-pinky' },
  ],
  // Row 3: Home row (contains 'G'!)
  [
    { code: 'CapsLock', label: 'caps lock', width: 1.75, finger: 'left-pinky' },
    { code: 'KeyA', label: 'a', shiftLabel: 'A', finger: 'left-pinky' },
    { code: 'KeyS', label: 's', shiftLabel: 'S', finger: 'left-ring' },
    { code: 'KeyD', label: 'd', shiftLabel: 'D', finger: 'left-middle' },
    { code: 'KeyF', label: 'f', shiftLabel: 'F', finger: 'left-index', isHomeRow: true },
    { code: 'KeyG', label: 'g', shiftLabel: 'G', finger: 'left-index' },
    { code: 'KeyH', label: 'h', shiftLabel: 'H', finger: 'right-index' },
    { code: 'KeyJ', label: 'j', shiftLabel: 'J', finger: 'right-index', isHomeRow: true },
    { code: 'KeyK', label: 'k', shiftLabel: 'K', finger: 'right-middle' },
    { code: 'KeyL', label: 'l', shiftLabel: 'L', finger: 'right-ring' },
    { code: 'Semicolon', label: ';', shiftLabel: ':', finger: 'right-pinky' },
    { code: 'Quote', label: "'", shiftLabel: '"', finger: 'right-pinky' },
    { code: 'Enter', label: 'enter', width: 2.25, finger: 'right-pinky' },
  ],
  // Row 4: Bottom letter row
  [
    { code: 'ShiftLeft', label: 'shift', width: 2.25, finger: 'left-pinky' },
    { code: 'KeyZ', label: 'z', shiftLabel: 'Z', finger: 'left-pinky' },
    { code: 'KeyX', label: 'x', shiftLabel: 'X', finger: 'left-ring' },
    { code: 'KeyC', label: 'c', shiftLabel: 'C', finger: 'left-middle' },
    { code: 'KeyV', label: 'v', shiftLabel: 'V', finger: 'left-index' },
    { code: 'KeyB', label: 'b', shiftLabel: 'B', finger: 'left-index' },
    { code: 'KeyN', label: 'n', shiftLabel: 'N', finger: 'right-index' },
    { code: 'KeyM', label: 'm', shiftLabel: 'M', finger: 'right-index' },
    { code: 'Comma', label: ',', shiftLabel: '<', finger: 'right-middle' },
    { code: 'Period', label: '.', shiftLabel: '>', finger: 'right-ring' },
    { code: 'Slash', label: '/', shiftLabel: '?', finger: 'right-pinky' },
    { code: 'ShiftRight', label: 'shift', width: 2.75, finger: 'right-pinky' },
  ],
  // Row 5: Spacebar & Modifiers
  [
    { code: 'ControlLeft', label: 'ctrl', width: 1.35, finger: 'left-pinky' },
    { code: 'MetaLeft', label: 'win', width: 1.25, finger: 'thumb' },
    { code: 'AltLeft', label: 'alt', width: 1.25, finger: 'thumb' },
    { code: 'Space', label: 'space', width: 6.3, finger: 'thumb' },
    { code: 'AltRight', label: 'alt', width: 1.25, finger: 'thumb' },
    { code: 'MetaRight', label: 'fn', width: 1.25, finger: 'thumb' },
    { code: 'ControlRight', label: 'ctrl', width: 1.35, finger: 'right-pinky' },
  ],
];

/**
 * Normalizes a key event code or character to matching virtual key code
 */
export function normalizeKeyCode(eventCode: string, keyChar: string): string {
  if (eventCode) return eventCode;
  
  const char = keyChar.toLowerCase();
  if (char === ' ') return 'Space';
  if (char === 'enter') return 'Enter';
  if (char === 'backspace') return 'Backspace';
  if (char === 'tab') return 'Tab';
  if (char === 'shift') return 'ShiftLeft';
  if (char === 'capslock') return 'CapsLock';
  if (char === 'control') return 'ControlLeft';
  if (char === 'alt') return 'AltLeft';
  
  if (char >= 'a' && char <= 'z') {
    return `Key${char.toUpperCase()}`;
  }
  if (char >= '0' && char <= '9') {
    return `Digit${char}`;
  }
  
  // Symbols mapping
  const symbolMap: Record<string, string> = {
    '`': 'Backquote', '~': 'Backquote',
    '-': 'Minus', '_': 'Minus',
    '=': 'Equal', '+': 'Equal',
    '[': 'BracketLeft', '{': 'BracketLeft',
    ']': 'BracketRight', '}': 'BracketRight',
    '\\': 'Backslash', '|': 'Backslash',
    ';': 'Semicolon', ':': 'Semicolon',
    "'": 'Quote', '"': 'Quote',
    ',': 'Comma', '<': 'Comma',
    '.': 'Period', '>': 'Period',
    '/': 'Slash', '?': 'Slash',
    '!': 'Digit1', '@': 'Digit2', '#': 'Digit3',
    '$': 'Digit4', '%': 'Digit5', '^': 'Digit6',
    '&': 'Digit7', '*': 'Digit8', '(': 'Digit9', ')': 'Digit0'
  };
  
  return symbolMap[char] || eventCode;
}
