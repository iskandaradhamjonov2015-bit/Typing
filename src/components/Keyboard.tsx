import React, { useMemo } from 'react';
import { ThemeOption, FingerType } from '../types';
import { QWERTY_ROWS, FINGER_COLORS } from '../utils/keyboardLayout';

interface KeyboardProps {
  activeKeys: Set<string>;
  lastPressedKey: string | null;
  keyPressCounts: Record<string, number>;
  theme: ThemeOption;
  showFingerGuide: boolean;
  showHeatmap: boolean;
  showKeyCounts: boolean;
  capsLockActive: boolean;
  nextExpectedChar?: string | null;
  onVirtualKeyPress: (key: string, code: string) => void;
}

export const Keyboard: React.FC<KeyboardProps> = ({
  activeKeys,
  lastPressedKey,
  keyPressCounts,
  theme,
  showFingerGuide,
  showHeatmap,
  showKeyCounts,
  capsLockActive,
  nextExpectedChar,
  onVirtualKeyPress,
}) => {
  // Compute max press count for heat normalization
  const maxPressCount = useMemo(() => {
    const counts = Object.values(keyPressCounts);
    return counts.length > 0 ? Math.max(...counts, 1) : 1;
  }, [keyPressCounts]);

  // Determine active finger for tooltip or helper
  const activeFingerLabel = useMemo(() => {
    if (!lastPressedKey) return null;
    for (const row of QWERTY_ROWS) {
      for (const k of row) {
        if (
          k.code.toLowerCase() === lastPressedKey.toLowerCase() ||
          k.label.toLowerCase() === lastPressedKey.toLowerCase() ||
          (k.shiftLabel && k.shiftLabel.toLowerCase() === lastPressedKey.toLowerCase())
        ) {
          if (k.finger) {
            return {
              key: k.label.toUpperCase(),
              finger: FINGER_COLORS[k.finger].labelUz,
              color: FINGER_COLORS[k.finger].dot,
            };
          }
        }
      }
    }
    return null;
  }, [lastPressedKey]);

  // Normalize next expected char for highlighting target key
  const normalizedNext = useMemo(() => {
    if (!nextExpectedChar) return null;
    if (nextExpectedChar === ' ') return 'space';
    if (nextExpectedChar === '\n') return 'enter';
    return nextExpectedChar.toLowerCase();
  }, [nextExpectedChar]);

  return (
    <div
      className="w-full max-w-4xl mx-auto rounded-2xl p-4 sm:p-5 transition-all duration-300 select-none shadow-xl border"
      style={{
        backgroundColor: theme.surface,
        borderColor: theme.border,
      }}
    >
      {/* Keyboard Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b text-xs" style={{ borderColor: theme.border }}>
        <div className="flex items-center gap-3">
          <span className="font-semibold uppercase tracking-wider text-[11px]" style={{ color: theme.textSecondary }}>
            Standart QWERTY Klaviatura
          </span>
          {activeFingerLabel && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-xs transition-all duration-150" style={{ backgroundColor: theme.bg }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeFingerLabel.color }} />
              <span style={{ color: theme.textSecondary }}>Bosildi:</span>
              <span className="font-bold font-mono" style={{ color: theme.accent }}>{activeFingerLabel.key}</span>
              <span style={{ color: theme.textSecondary }}>({activeFingerLabel.finger})</span>
            </div>
          )}
        </div>

        {/* Indicators */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full transition-colors ${
                capsLockActive ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-stone-600'
              }`}
            />
            <span style={{ color: capsLockActive ? theme.textPrimary : theme.textSecondary }}>CAPS</span>
          </div>

          {normalizedNext && (
            <div className="flex items-center gap-1.5 font-mono" style={{ color: theme.textSecondary }}>
              <span>Keyingi:</span>
              <span className="px-1.5 py-0.5 rounded font-bold border" style={{ color: theme.accent, borderColor: theme.accent, backgroundColor: `${theme.accent}15` }}>
                {normalizedNext === 'space' ? 'Space' : normalizedNext.toUpperCase()}
              </span>
            </div>
          )}

          {lastPressedKey && (
            <div className="font-mono" style={{ color: theme.accent }}>
              Oxirgi: <span className="font-bold underline">{lastPressedKey}</span>
            </div>
          )}
        </div>
      </div>

      {/* Keyboard Grid */}
      <div className="flex flex-col gap-1.5 sm:gap-2">
        {QWERTY_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1 sm:gap-1.5 justify-center">
            {row.map((keyDef) => {
              const isPressed =
                activeKeys.has(keyDef.code) ||
                (keyDef.label && activeKeys.has(keyDef.label.toLowerCase())) ||
                (keyDef.shiftLabel && activeKeys.has(keyDef.shiftLabel.toLowerCase()));

              const isNextTarget =
                Boolean(normalizedNext) &&
                (keyDef.label.toLowerCase() === normalizedNext ||
                  (keyDef.shiftLabel && keyDef.shiftLabel.toLowerCase() === normalizedNext) ||
                  (normalizedNext === 'space' && keyDef.code === 'Space') ||
                  (normalizedNext === 'enter' && keyDef.code === 'Enter'));

              const pressCount = keyPressCounts[keyDef.code] || keyPressCounts[keyDef.label] || 0;
              const heatRatio = showHeatmap ? Math.min(pressCount / maxPressCount, 1) : 0;
              const fingerColor = keyDef.finger ? FINGER_COLORS[keyDef.finger] : null;

              // Key width multiplier (1 = flex 1, 2 = flex 2, etc.)
              const flexGrow = keyDef.width || 1;
              const minWidthClass =
                keyDef.width && keyDef.width > 2.5
                  ? 'min-w-[120px] sm:min-w-[200px]'
                  : keyDef.width && keyDef.width > 1.8
                  ? 'min-w-[55px] sm:min-w-[70px]'
                  : keyDef.width && keyDef.width > 1.3
                  ? 'min-w-[45px] sm:min-w-[55px]'
                  : 'min-w-[28px] sm:min-w-[38px]';

              return (
                <button
                  key={keyDef.code}
                  type="button"
                  onClick={() => onVirtualKeyPress(keyDef.label, keyDef.code)}
                  style={{
                    flex: `${flexGrow} 1 0%`,
                    backgroundColor: isPressed
                      ? theme.accent
                      : isNextTarget
                      ? `${theme.accent}25`
                      : showHeatmap && heatRatio > 0
                      ? `color-mix(in srgb, ${theme.accent} ${Math.round(heatRatio * 75)}%, ${theme.keyBg})`
                      : theme.keyBg,
                    color: isPressed ? '#000000' : isNextTarget ? theme.accent : theme.keyText,
                    borderColor: isPressed
                      ? theme.accent
                      : isNextTarget
                      ? theme.accent
                      : showFingerGuide && fingerColor
                      ? fingerColor.dot + '66'
                      : theme.border,
                    transform: isPressed ? 'translateY(3px) scale(0.95)' : isNextTarget ? 'translateY(-1px)' : 'translateY(0)',
                    boxShadow: isPressed
                      ? `0 0 20px ${theme.accent}88, inset 0 2px 4px rgba(0,0,0,0.5)`
                      : isNextTarget
                      ? `0 0 10px ${theme.accent}40, 0 3px 0 rgba(0,0,0,0.3)`
                      : '0 3px 0 rgba(0,0,0,0.3), 0 4px 6px rgba(0,0,0,0.1)',
                  }}
                  className={`relative flex flex-col items-center justify-center p-1 sm:p-2 rounded-lg border text-xs sm:text-sm font-mono font-medium transition-all duration-75 cursor-pointer active:translate-y-1 active:scale-95 ${minWidthClass} h-10 sm:h-12`}
                  title={`${keyDef.shiftLabel ? keyDef.shiftLabel + ' / ' : ''}${keyDef.label.toUpperCase()}${
                    keyDef.finger ? ` • ${FINGER_COLORS[keyDef.finger].labelUz}` : ''
                  }${pressCount > 0 ? ` (${pressCount} marta)` : ''}`}
                >
                  {/* Home row tactile bump (F and J keys) */}
                  {keyDef.isHomeRow && (
                    <span
                      className="absolute bottom-1 w-2.5 sm:w-3.5 h-[2px] rounded-full transition-colors"
                      style={{
                        backgroundColor: isPressed ? '#000000' : theme.textSecondary,
                        opacity: 0.8,
                      }}
                    />
                  )}

                  {/* Finger guide dot */}
                  {showFingerGuide && fingerColor && (
                    <span
                      className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full pointer-events-none"
                      style={{ backgroundColor: fingerColor.dot }}
                    />
                  )}

                  {/* Keycap content */}
                  {keyDef.shiftLabel ? (
                    <div className="flex flex-col items-center justify-between leading-tight w-full pointer-events-none">
                      <span className="text-[9px] sm:text-[10px] opacity-60">
                        {keyDef.shiftLabel}
                      </span>
                      <span className="text-xs sm:text-sm font-bold">
                        {keyDef.label.toUpperCase()}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs sm:text-sm uppercase font-bold tracking-tight pointer-events-none">
                      {keyDef.label}
                    </span>
                  )}

                  {/* Key Press Count overlay */}
                  {showKeyCounts && pressCount > 0 && (
                    <span
                      className="absolute bottom-0.5 right-1 text-[8px] font-sans font-semibold opacity-70 pointer-events-none"
                      style={{ color: isPressed ? '#000000' : theme.textSecondary }}
                    >
                      {pressCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Finger guide legend footer */}
      {showFingerGuide && (
        <div className="mt-3 pt-3 border-t flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px]" style={{ borderColor: theme.border }}>
          <span style={{ color: theme.textSecondary }}>Barmoqlar:</span>
          {(Object.keys(FINGER_COLORS) as FingerType[]).map((f) => (
            <div key={f} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: FINGER_COLORS[f].dot }} />
              <span style={{ color: theme.textSecondary }}>{FINGER_COLORS[f].labelUz}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
