import React from 'react';
import { ThemeOption, TypingMode, SoundType } from '../types';
import { Keyboard, Volume2, VolumeX, Palette, Zap } from 'lucide-react';

interface HeaderProps {
  mode: TypingMode;
  onSelectMode: (mode: TypingMode) => void;
  theme: ThemeOption;
  soundType: SoundType;
  onCycleSound: () => void;
  onOpenThemeModal: () => void;
  onOpenSettingsModal: () => void;
  showFingerGuide: boolean;
  onToggleFingerGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onSelectMode,
  theme,
  soundType,
  onCycleSound,
  onOpenThemeModal,
  onOpenSettingsModal,
  showFingerGuide,
  onToggleFingerGuide,
}) => {
  return (
    <header
      className="w-full border-b px-4 sm:px-8 py-3.5 transition-colors"
      style={{
        backgroundColor: theme.surface,
        borderColor: theme.border,
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-6 sm:gap-8">
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
            style={{
              backgroundColor: theme.accent,
              color: '#000000',
            }}
          >
            <Keyboard className="w-4 h-4" />
          </div>
          <span
            className="text-lg font-bold tracking-tight whitespace-nowrap font-mono"
            style={{ color: theme.textPrimary }}
          >
            type<span style={{ color: theme.accent }}>flow</span>
          </span>
        </div>

        {/* Zone 2: Concise navigation links for modes */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => onSelectMode('free')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
              mode === 'free' ? 'font-semibold' : 'hover:opacity-80'
            }`}
            style={{
              backgroundColor: mode === 'free' ? theme.accent : 'transparent',
              color: mode === 'free' ? '#000000' : theme.textSecondary,
            }}
          >
            Erkin Matn
          </button>

          <button
            type="button"
            onClick={() => onSelectMode('custom')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
              mode === 'custom' ? 'font-semibold' : 'hover:opacity-80'
            }`}
            style={{
              backgroundColor: mode === 'custom' ? theme.accent : 'transparent',
              color: mode === 'custom' ? '#000000' : theme.textSecondary,
            }}
          >
            Shaxsiy Matn
          </button>

          <button
            type="button"
            onClick={() => onSelectMode('preset')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
              mode === 'preset' ? 'font-semibold' : 'hover:opacity-80'
            }`}
            style={{
              backgroundColor: mode === 'preset' ? theme.accent : 'transparent',
              color: mode === 'preset' ? '#000000' : theme.textSecondary,
            }}
          >
            Mashqlar
          </button>
        </nav>

        {/* Zone 3: Controls (Sound, Finger Guide, Theme) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Sound switch button */}
          <button
            type="button"
            onClick={onCycleSound}
            title={`Ovoz: ${soundType.toUpperCase()}`}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all"
            style={{
              backgroundColor: theme.bg,
              borderColor: theme.border,
              color: soundType !== 'off' ? theme.accent : theme.textSecondary,
            }}
          >
            {soundType !== 'off' ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline capitalize">{soundType}</span>
          </button>

          {/* Finger guide toggle */}
          <button
            type="button"
            onClick={onToggleFingerGuide}
            title="Barmoq qo'llanmasini yoqish/o'chirish"
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all"
            style={{
              backgroundColor: showFingerGuide ? `${theme.accent}15` : theme.bg,
              borderColor: showFingerGuide ? theme.accent : theme.border,
              color: showFingerGuide ? theme.accent : theme.textSecondary,
            }}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Barmoqlar</span>
          </button>

          {/* Theme switcher */}
          <button
            type="button"
            onClick={onOpenThemeModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
            style={{
              backgroundColor: theme.bg,
              borderColor: theme.border,
              color: theme.textPrimary,
            }}
          >
            <Palette className="w-3.5 h-3.5" style={{ color: theme.accent }} />
            <span className="hidden sm:inline">Mavzu</span>
          </button>
        </div>
      </div>
    </header>
  );
};
