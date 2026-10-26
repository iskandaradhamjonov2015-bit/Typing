import React, { useEffect } from 'react';
import { ThemeOption, TypingStats, SpeedHistoryPoint } from '../types';
import confetti from 'canvas-confetti';
import { RotateCcw, Share2, Award, Zap, CheckCircle2, XCircle, X } from 'lucide-react';

interface ResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
  stats: TypingStats;
  history: SpeedHistoryPoint[];
  theme: ThemeOption;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  isOpen,
  onClose,
  onRestart,
  stats,
  history,
  theme,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Fire subtle celebratory confetti
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.65 },
        colors: [theme.accent, '#10b981', '#3b82f6', '#f59e0b'],
      });
    }
  }, [isOpen, theme.accent]);

  if (!isOpen) return null;

  // Build SVG path for speed chart
  const maxWpm = Math.max(...history.map((h) => h.wpm), stats.wpm, 40);
  const chartHeight = 120;
  const chartWidth = 520;

  const pointsString = history.length > 1
    ? history
        .map((pt, idx) => {
          const x = (idx / (history.length - 1)) * chartWidth;
          const y = chartHeight - (pt.wpm / maxWpm) * (chartHeight - 20) - 10;
          return `${x.toFixed(1)},${y.toFixed(1)}`;
        })
        .join(' ')
    : `0,${chartHeight - 10} ${chartWidth},${chartHeight - (stats.wpm / maxWpm) * (chartHeight - 20) - 10}`;

  const copyResult = () => {
    const text = `🚀 TypeFlow Natijam:\nTezlik: ${stats.wpm} WPM (${stats.cpm} CPM)\nAniqlik: ${stats.accuracy}%\nVaqt: ${stats.elapsedSeconds}s\nBelgilar: ${stats.correctChars}/${stats.totalChars}`;
    navigator.clipboard.writeText(text);
    alert('Natija nusxalandi!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-xl rounded-2xl border p-6 sm:p-8 shadow-2xl relative flex flex-col gap-6"
        style={{
          backgroundColor: theme.surface,
          borderColor: theme.border,
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg border transition-opacity hover:opacity-75"
          style={{ borderColor: theme.border, color: theme.textSecondary }}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${theme.accent}20`, color: theme.accent }}
          >
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-mono" style={{ color: theme.textPrimary }}>
              Yozish Natijasi
            </h3>
            <p className="text-xs" style={{ color: theme.textSecondary }}>
              Ajoyib natija! Mashq qilish tezlikni oshiradi.
            </p>
          </div>
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div
            className="p-3.5 rounded-xl border flex flex-col"
            style={{ backgroundColor: theme.bg, borderColor: theme.border }}
          >
            <span className="text-[11px] font-sans" style={{ color: theme.textSecondary }}>
              Tezlik (WPM)
            </span>
            <span className="text-3xl font-extrabold font-mono tabular-nums" style={{ color: theme.accent }}>
              {stats.wpm}
            </span>
            <span className="text-[10px] opacity-75" style={{ color: theme.textSecondary }}>
              So'z / daqiqa
            </span>
          </div>

          <div
            className="p-3.5 rounded-xl border flex flex-col"
            style={{ backgroundColor: theme.bg, borderColor: theme.border }}
          >
            <span className="text-[11px] font-sans" style={{ color: theme.textSecondary }}>
              Aniqlik
            </span>
            <span
              className="text-3xl font-extrabold font-mono tabular-nums"
              style={{ color: stats.accuracy >= 95 ? '#10b981' : theme.accent }}
            >
              {stats.accuracy}%
            </span>
            <span className="text-[10px] opacity-75" style={{ color: theme.textSecondary }}>
              To'g'ri bosish
            </span>
          </div>

          <div
            className="p-3.5 rounded-xl border flex flex-col"
            style={{ backgroundColor: theme.bg, borderColor: theme.border }}
          >
            <span className="text-[11px] font-sans" style={{ color: theme.textSecondary }}>
              Belgilar (CPM)
            </span>
            <span className="text-3xl font-extrabold font-mono tabular-nums" style={{ color: theme.textPrimary }}>
              {stats.cpm}
            </span>
            <span className="text-[10px] opacity-75" style={{ color: theme.textSecondary }}>
              Belgi / daqiqa
            </span>
          </div>

          <div
            className="p-3.5 rounded-xl border flex flex-col"
            style={{ backgroundColor: theme.bg, borderColor: theme.border }}
          >
            <span className="text-[11px] font-sans" style={{ color: theme.textSecondary }}>
              Sarflangan vaqt
            </span>
            <span className="text-3xl font-extrabold font-mono tabular-nums" style={{ color: theme.textPrimary }}>
              {stats.elapsedSeconds}s
            </span>
            <span className="text-[10px] opacity-75" style={{ color: theme.textSecondary }}>
              Sekund
            </span>
          </div>
        </div>

        {/* Speed Chart over time */}
        {history.length > 2 && (
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold" style={{ color: theme.textSecondary }}>
              Tezlik Grafigi (WPM dinamikasi)
            </span>
            <div
              className="w-full p-3 rounded-xl border overflow-hidden"
              style={{ backgroundColor: theme.bg, borderColor: theme.border }}
            >
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-24 overflow-visible">
                {/* Background gridlines */}
                <line x1="0" y1="20" x2={chartWidth} y2="20" stroke={theme.border} strokeDasharray="3 3" />
                <line x1="0" y1={chartHeight / 2} x2={chartWidth} y2={chartHeight / 2} stroke={theme.border} strokeDasharray="3 3" />
                <line x1="0" y1={chartHeight - 10} x2={chartWidth} y2={chartHeight - 10} stroke={theme.border} strokeDasharray="3 3" />

                {/* Polyline */}
                <polyline
                  fill="none"
                  stroke={theme.accent}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={pointsString}
                />
              </svg>
            </div>
          </div>
        )}

        {/* Secondary details breakdown */}
        <div className="flex items-center justify-between text-xs py-2 px-3 rounded-lg border font-mono"
             style={{ backgroundColor: theme.bg, borderColor: theme.border }}>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span style={{ color: theme.textSecondary }}>To'g'ri:</span>
            <span className="font-bold" style={{ color: theme.textPrimary }}>{stats.correctChars}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            <span style={{ color: theme.textSecondary }}>Xatolar:</span>
            <span className="font-bold" style={{ color: '#ef4444' }}>{stats.incorrectChars}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" style={{ color: theme.accent }} />
            <span style={{ color: theme.textSecondary }}>Backspace:</span>
            <span className="font-bold" style={{ color: theme.textPrimary }}>{stats.backspaces}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={copyResult}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-medium transition-all"
            style={{ backgroundColor: theme.bg, borderColor: theme.border, color: theme.textSecondary }}
          >
            <Share2 className="w-3.5 h-3.5" />
            Ulashish
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onRestart();
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md hover:scale-102"
            style={{
              backgroundColor: theme.accent,
              color: '#000000',
            }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Qayta boshlash
          </button>
        </div>
      </div>
    </div>
  );
};
