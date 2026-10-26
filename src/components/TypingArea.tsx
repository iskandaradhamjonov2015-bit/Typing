import React, { useRef, useEffect, useState } from 'react';
import { ThemeOption, TypingMode } from '../types';
import { RotateCcw, Copy, Download, Check, Sparkles, FileText, ArrowRight, Clipboard, Trash2, BookOpen } from 'lucide-react';

interface TypingAreaProps {
  mode: TypingMode;
  freeText: string;
  onFreeTextChange: (newText: string) => void;
  targetText: string;
  customInputPrompt: string;
  onCustomInputPromptChange: (text: string) => void;
  onApplyCustomText: (text: string) => void;
  typedChars: string;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  theme: ThemeOption;
  isFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  onReset: () => void;
  onFinishTest: () => void;
  isActive: boolean;
  timeRemaining: number | null;
  wpm: number;
  cpm: number;
  accuracy: number;
  onSwitchToCustom: () => void;
  onSwitchToFree: () => void;
}

export const TypingArea: React.FC<TypingAreaProps> = ({
  mode,
  freeText,
  onFreeTextChange,
  targetText,
  customInputPrompt,
  onCustomInputPromptChange,
  onApplyCustomText,
  typedChars,
  inputRef,
  theme,
  isFocused,
  onFocus,
  onBlur,
  onReset,
  onFinishTest,
  isActive,
  timeRemaining,
  wpm,
  cpm,
  accuracy,
  onSwitchToCustom,
  onSwitchToFree,
}) => {
  const [copied, setCopied] = useState(false);
  const [isInputBoxOpen, setIsInputBoxOpen] = useState(false);
  const [draftCustomText, setDraftCustomText] = useState(customInputPrompt);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync draft when customInputPrompt changes
  useEffect(() => {
    setDraftCustomText(customInputPrompt);
  }, [customInputPrompt]);

  // Handle click on container to refocus hidden textarea
  const handleContainerClick = () => {
    if (!isInputBoxOpen && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleCopy = () => {
    const textToCopy = mode === 'free' ? freeText : typedChars;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const textToSave = mode === 'free' ? freeText : typedChars;
    if (!textToSave) return;
    const blob = new Blob([textToSave], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `typeflow-${mode === 'free' ? 'erkin' : 'shaxsiy'}-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setDraftCustomText(text);
        onCustomInputPromptChange(text);
      }
    } catch {
      // Clipboard read fallback
    }
  };

  const handleLoadSampleText = () => {
    const sample = 'Zamonaviy kompyuter klaviaturasida tez yozish har qanday kasb egasiga vaqtni tejashga yordam beradi. Teginib yozish usuli barmoqlarning xotirasiga asoslanadi.';
    setDraftCustomText(sample);
    onCustomInputPromptChange(sample);
  };

  const handleSubmitCustomText = () => {
    const trimmed = draftCustomText.trim();
    if (!trimmed) return;
    onApplyCustomText(trimmed);
    setIsInputBoxOpen(false);
    onSwitchToCustom();
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  // Scroll cursor smoothly into view
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [freeText, typedChars]);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-3">
      {/* Top Banner / Mode Controller & Custom Text Trigger */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1 text-sm">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSwitchToFree}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              mode === 'free'
                ? 'font-bold shadow-sm'
                : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: mode === 'free' ? theme.accent : 'transparent',
              color: mode === 'free' ? '#000000' : theme.textPrimary,
              border: `1px solid ${mode === 'free' ? theme.accent : theme.border}`,
            }}
          >
            Erkin Yozish (Matnsiz)
          </button>

          <button
            type="button"
            onClick={() => {
              onSwitchToCustom();
              setIsInputBoxOpen(true);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              mode === 'custom'
                ? 'font-bold shadow-sm'
                : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: mode === 'custom' ? theme.accent : 'transparent',
              color: mode === 'custom' ? '#000000' : theme.textPrimary,
              border: `1px solid ${mode === 'custom' ? theme.accent : theme.border}`,
            }}
          >
            <FileText className="w-3.5 h-3.5" />
            Shaxsiy Matn Kiritish
          </button>

          <span className="text-xs font-mono ml-1" style={{ color: theme.textSecondary }}>
            {mode === 'free'
              ? `${freeText.split(/\s+/).filter(Boolean).length} so'z · ${freeText.length} belgi`
              : `${typedChars.length} / ${targetText.length} belgi`}
          </span>
        </div>

        {/* Live Mini Counters */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1">
            <span style={{ color: theme.textSecondary }}>WPM:</span>
            <span className="font-bold text-sm" style={{ color: theme.accent }}>{wpm}</span>
          </div>
          <div className="flex items-center gap-1">
            <span style={{ color: theme.textSecondary }}>CPM:</span>
            <span className="font-bold text-sm" style={{ color: theme.textPrimary }}>{cpm}</span>
          </div>
          <div className="flex items-center gap-1">
            <span style={{ color: theme.textSecondary }}>Aniqlik:</span>
            <span className="font-bold text-sm" style={{ color: accuracy >= 95 ? '#10b981' : theme.accent }}>
              {accuracy}%
            </span>
          </div>
          {timeRemaining !== null && (
            <div className="flex items-center gap-1">
              <span style={{ color: theme.textSecondary }}>Vaqt:</span>
              <span className="font-bold text-sm" style={{ color: timeRemaining <= 5 ? '#ef4444' : theme.textPrimary }}>
                {timeRemaining}s
              </span>
            </div>
          )}
        </div>
      </div>

      {/* CUSTOM TEXT INPUT PANEL (Expanded when user wants to paste/type their custom text) */}
      {isInputBoxOpen && (
        <div
          className="p-4 sm:p-5 rounded-2xl border flex flex-col gap-3 shadow-lg transition-all animate-fadeIn"
          style={{ backgroundColor: theme.surface, borderColor: theme.accent }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" style={{ color: theme.accent }} />
              <span className="text-sm font-bold font-mono" style={{ color: theme.textPrimary }}>
                Mashq qilish uchun o'z matningizni kiriting:
              </span>
            </div>
            <span className="text-xs font-mono" style={{ color: theme.textSecondary }}>
              {draftCustomText.trim().split(/\s+/).filter(Boolean).length} so'z · {draftCustomText.length} belgi
            </span>
          </div>

          <textarea
            value={draftCustomText}
            onChange={(e) => {
              setDraftCustomText(e.target.value);
              onCustomInputPromptChange(e.target.value);
            }}
            placeholder="Mashq qilmoqchi bo'lgan matningizni shu yerga yozing yoki nusxalab qo'ying (istalgan tilda)..."
            className="w-full h-32 p-3.5 rounded-xl border font-mono text-sm resize-none focus:outline-none transition-colors"
            style={{
              backgroundColor: theme.bg,
              borderColor: theme.border,
              color: theme.textPrimary,
            }}
            autoFocus
          />

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePasteFromClipboard}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all"
                style={{ backgroundColor: theme.bg, borderColor: theme.border, color: theme.textPrimary }}
                title="Vaqtinchalik xotiradan (Clipboard) qo'yish"
              >
                <Clipboard className="w-3.5 h-3.5" style={{ color: theme.accent }} />
                Nusxadan qo'yish
              </button>

              <button
                type="button"
                onClick={handleLoadSampleText}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all"
                style={{ backgroundColor: theme.bg, borderColor: theme.border, color: theme.textSecondary }}
                title="Tayyor namuna matn yuklash"
              >
                <BookOpen className="w-3.5 h-3.5" />
                Namuna matn
              </button>

              {draftCustomText && (
                <button
                  type="button"
                  onClick={() => {
                    setDraftCustomText('');
                    onCustomInputPromptChange('');
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all hover:text-rose-400"
                  style={{ backgroundColor: theme.bg, borderColor: theme.border, color: theme.textSecondary }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Tozalash
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsInputBoxOpen(false)}
                className="px-3 py-1.5 rounded-lg border text-xs font-medium"
                style={{ borderColor: theme.border, color: theme.textSecondary }}
              >
                Yopish
              </button>

              <button
                type="button"
                onClick={handleSubmitCustomText}
                disabled={!draftCustomText.trim()}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md disabled:opacity-50"
                style={{
                  backgroundColor: theme.accent,
                  color: '#000000',
                }}
              >
                <ArrowRight className="w-3.5 h-3.5" />
                Matnni yuklash va boshlash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Interactive Typing Canvas */}
      <div
        ref={containerRef}
        onClick={handleContainerClick}
        style={{
          backgroundColor: theme.surface,
          borderColor: isFocused ? theme.accent : theme.border,
          boxShadow: isFocused ? `0 0 20px ${theme.accent}15` : 'none',
        }}
        className="relative min-h-[180px] sm:min-h-[220px] max-h-[300px] overflow-y-auto p-5 sm:p-6 rounded-2xl border transition-all duration-200 cursor-text flex flex-col justify-between"
      >
        {/* Hidden active textarea to capture all physical keystrokes naturally */}
        <textarea
          ref={inputRef}
          value={mode === 'free' ? freeText : typedChars}
          onChange={(e) => {
            if (mode === 'free') {
              onFreeTextChange(e.target.value);
            }
          }}
          onFocus={onFocus}
          onBlur={onBlur}
          className="absolute inset-0 opacity-0 pointer-events-auto resize-none cursor-text w-full h-full"
          autoFocus
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
        />

        {/* FREE TYPING MODE: No pre-defined text at all! User types freely */}
        {mode === 'free' && (
          <div className="w-full flex-1">
            {freeText.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-6 select-none pointer-events-none">
                <p className="text-lg sm:text-xl font-mono mb-2" style={{ color: theme.textSecondary }}>
                  Klaviatura orqali xohlagan matningizni yozavering...
                </p>
                <p className="text-xs sm:text-sm font-sans" style={{ color: theme.textSecondary, opacity: 0.85 }}>
                  Kompyuteringizdan istalgan harfni (masalan <span className="font-mono font-bold px-1.5 py-0.5 rounded border" style={{ color: theme.accent, borderColor: theme.border }}>G</span>) bosing — ekrandagi klaviatura jonlanadi!
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs animate-pulse" style={{ color: theme.accent }}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.accent }} />
                  Kursor tayyor, erkin yozishni boshlang
                </div>
              </div>
            ) : (
              <div className="text-lg sm:text-xl font-mono leading-relaxed break-words whitespace-pre-wrap select-text pointer-events-none">
                <span style={{ color: theme.textPrimary }}>{freeText}</span>
                {/* Blinking Caret */}
                <span
                  className="inline-block w-2.5 h-6 sm:h-7 ml-0.5 align-middle animate-pulse rounded-sm"
                  style={{ backgroundColor: theme.accent }}
                />
              </div>
            )}
          </div>
        )}

        {/* CUSTOM TEXT PRACTICE MODE: Display the user's custom inputted text */}
        {mode === 'custom' && (
          <div className="w-full flex-1">
            <div className="text-lg sm:text-xl font-mono leading-relaxed break-words whitespace-pre-wrap select-none pointer-events-none">
              {targetText.split('').map((char, index) => {
                let charColor = theme.textSecondary;
                let bgStyle = 'transparent';
                let isCurrent = index === typedChars.length;
                let isPast = index < typedChars.length;

                if (isPast) {
                  const typedChar = typedChars[index];
                  if (typedChar === char) {
                    charColor = theme.textPrimary;
                  } else {
                    charColor = '#ef4444';
                    bgStyle = 'rgba(239, 68, 68, 0.22)';
                  }
                }

                return (
                  <span key={index} className="relative inline-block" style={{ backgroundColor: bgStyle }}>
                    {/* Caret before current character */}
                    {isCurrent && isFocused && (
                      <span
                        className="absolute -left-[2px] top-1 bottom-1 w-[2.5px] rounded-full animate-pulse pointer-events-none"
                        style={{ backgroundColor: theme.accent }}
                      />
                    )}
                    <span
                      style={{
                        color: charColor,
                        textDecoration: isPast && typedChars[index] !== char ? 'underline' : 'none',
                      }}
                    >
                      {char}
                    </span>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Focus prompt if user clicks outside */}
        {!isFocused && !isInputBoxOpen && (
          <div
            className="absolute inset-0 backdrop-blur-[1.5px] rounded-2xl flex items-center justify-center transition-all cursor-pointer pointer-events-none"
            style={{ backgroundColor: `${theme.surface}cc` }}
          >
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium border shadow-lg"
              style={{ backgroundColor: theme.bg, borderColor: theme.border, color: theme.accent }}
            >
              <Sparkles className="w-4 h-4" />
              Yozishni davom ettirish uchun shu yerga bosing
            </div>
          </div>
        )}
      </div>

      {/* Typing Action Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            title="Qayta boshlash (Esc)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all hover:opacity-85"
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.border,
              color: theme.textSecondary,
            }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Qayta boshlash
          </button>

          {mode === 'custom' && (
            <button
              type="button"
              onClick={() => setIsInputBoxOpen((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all hover:opacity-85"
              style={{
                backgroundColor: isInputBoxOpen ? `${theme.accent}15` : theme.surface,
                borderColor: isInputBoxOpen ? theme.accent : theme.border,
                color: theme.accent,
              }}
            >
              <FileText className="w-3.5 h-3.5" />
              {isInputBoxOpen ? 'Matn maydonini yashirish' : 'Boshqa matn kiritish'}
            </button>
          )}

          {(freeText.length > 0 || typedChars.length > 0) && (
            <>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all hover:opacity-85"
                style={{
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  color: theme.textSecondary,
                }}
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Nusxa olindi!' : 'Nusxalash'}
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all hover:opacity-85"
                style={{
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  color: theme.textSecondary,
                }}
              >
                <Download className="w-3.5 h-3.5" />
                Yuklab olish
              </button>
            </>
          )}
        </div>

        {/* Complete test button */}
        {(freeText.length >= 10 || typedChars.length >= 10) && (
          <button
            type="button"
            onClick={onFinishTest}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all hover:scale-102"
            style={{
              backgroundColor: theme.accent,
              color: '#000000',
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Natijani ko'rish
          </button>
        )}
      </div>
    </div>
  );
};
