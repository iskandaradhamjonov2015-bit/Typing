import React from 'react';
import { ThemeOption, SoundType } from '../types';
import { THEMES } from '../utils/themes';
import { X, Check, Volume2, Sparkles, Sliders } from 'lucide-react';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeOption;
  onSelectTheme: (theme: ThemeOption) => void;
  soundType: SoundType;
  onSelectSound: (sound: SoundType) => void;
  showFingerGuide: boolean;
  onToggleFingerGuide: () => void;
  showHeatmap: boolean;
  onToggleHeatmap: () => void;
  showKeyCounts: boolean;
  onToggleKeyCounts: () => void;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
  soundType,
  onSelectSound,
  showFingerGuide,
  onToggleFingerGuide,
  showHeatmap,
  onToggleHeatmap,
  showKeyCounts,
  onToggleKeyCounts,
}) => {
  if (!isOpen) return null;

  const soundOptions: { id: SoundType; name: string; desc: string }[] = [
    { id: 'thock', name: 'Thock (Creamy)', desc: 'Chuqur mexanik Gateron Ink / Holy Panda tovushi' },
    { id: 'clicky', name: 'Clicky (Crisp)', desc: 'Aniq va jarangdor Cherry MX Blue tovushi' },
    { id: 'tactile', name: 'Tactile (Punch)', desc: 'Cherry MX Brown uslubidagi bosish sezgisi' },
    { id: 'bubble', name: 'Bubble Pop', desc: 'Mayin va yoqimli pufakcha tovushi' },
    { id: 'off', name: 'O\'chiq (Silent)', desc: 'Tovushsiz tinch rejim' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border p-6 shadow-2xl relative flex flex-col gap-6"
        style={{
          backgroundColor: currentTheme.surface,
          borderColor: currentTheme.border,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5" style={{ color: currentTheme.accent }} />
            <h3 className="text-lg font-bold font-mono" style={{ color: currentTheme.textPrimary }}>
              Mavzu va Klaviatura Sozlamalari
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg border transition-opacity hover:opacity-75"
            style={{ borderColor: currentTheme.border, color: currentTheme.textSecondary }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section 1: Themes */}
        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: currentTheme.textSecondary }}>
            Rang Mavzusi (Monkeytype Themes)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {THEMES.map((theme) => {
              const isSelected = theme.id === currentTheme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => onSelectTheme(theme)}
                  className={`p-3 rounded-xl border text-left transition-all relative flex flex-col gap-2 ${
                    isSelected ? 'ring-2' : 'hover:scale-[1.02]'
                  }`}
                  style={{
                    backgroundColor: theme.bg,
                    borderColor: isSelected ? theme.accent : theme.border,
                    outlineColor: theme.accent,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium truncate" style={{ color: theme.textPrimary }}>
                      {theme.name}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5" style={{ color: theme.accent }} />}
                  </div>

                  {/* Color dots preview */}
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: theme.bg }} />
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: theme.surface }} />
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: theme.accent }} />
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: theme.keyBg }} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Mechanical Switch Sound */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4" style={{ color: currentTheme.accent }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: currentTheme.textSecondary }}>
              Mexanik Klaviatura Ovozi
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {soundOptions.map((opt) => {
              const isSelected = soundType === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onSelectSound(opt.id)}
                  className="p-3 rounded-xl border text-left transition-all flex flex-col gap-0.5"
                  style={{
                    backgroundColor: isSelected ? `${currentTheme.accent}15` : currentTheme.bg,
                    borderColor: isSelected ? currentTheme.accent : currentTheme.border,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold" style={{ color: isSelected ? currentTheme.accent : currentTheme.textPrimary }}>
                      {opt.name}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5" style={{ color: currentTheme.accent }} />}
                  </div>
                  <span className="text-[11px] leading-tight" style={{ color: currentTheme.textSecondary }}>
                    {opt.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Keyboard Visual Features */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" style={{ color: currentTheme.accent }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: currentTheme.textSecondary }}>
              Klaviatura Vizual Qo'shimchalari
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {/* Finger guide switch */}
            <label
              className="flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors"
              style={{ backgroundColor: currentTheme.bg, borderColor: currentTheme.border }}
            >
              <div className="flex flex-col">
                <span className="text-xs font-medium" style={{ color: currentTheme.textPrimary }}>
                  Barmoqlar Qo'llanmasi (Touch Typing Guide)
                </span>
                <span className="text-[11px]" style={{ color: currentTheme.textSecondary }}>
                  Har bir harfni qaysi barmoq bilan bosish kerakligini rangli nuqtalar bilan ko'rsatish
                </span>
              </div>
              <input
                type="checkbox"
                checked={showFingerGuide}
                onChange={onToggleFingerGuide}
                className="w-4 h-4 accent-amber-500 cursor-pointer"
              />
            </label>

            {/* Heatmap switch */}
            <label
              className="flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors"
              style={{ backgroundColor: currentTheme.bg, borderColor: currentTheme.border }}
            >
              <div className="flex flex-col">
                <span className="text-xs font-medium" style={{ color: currentTheme.textPrimary }}>
                  Issiqlik Xaritasi (Key Heatmap)
                </span>
                <span className="text-[11px]" style={{ color: currentTheme.textSecondary }}>
                  Eng ko'p bosilgan tugmalarni o'ziga xos rang intensivligi bilan ajratib ko'rsatish
                </span>
              </div>
              <input
                type="checkbox"
                checked={showHeatmap}
                onChange={onToggleHeatmap}
                className="w-4 h-4 accent-amber-500 cursor-pointer"
              />
            </label>

            {/* Key counts switch */}
            <label
              className="flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors"
              style={{ backgroundColor: currentTheme.bg, borderColor: currentTheme.border }}
            >
              <div className="flex flex-col">
                <span className="text-xs font-medium" style={{ color: currentTheme.textPrimary }}>
                  Tugma Bosilish Sanoqchisi (Key Counters)
                </span>
                <span className="text-[11px]" style={{ color: currentTheme.textSecondary }}>
                  Har bir tugma necha marta bosilganligini kichik raqam bilan ko'rsatish
                </span>
              </div>
              <input
                type="checkbox"
                checked={showKeyCounts}
                onChange={onToggleKeyCounts}
                className="w-4 h-4 accent-amber-500 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold transition-all"
            style={{
              backgroundColor: currentTheme.accent,
              color: '#000000',
            }}
          >
            Tayyor
          </button>
        </div>
      </div>
    </div>
  );
};
