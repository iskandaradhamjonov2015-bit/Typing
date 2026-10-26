import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ThemeOption, TypingMode, SoundType, TypingStats, SpeedHistoryPoint } from './types';
import { THEMES } from './utils/themes';
import { playKeySound } from './utils/sound';
import { normalizeKeyCode } from './utils/keyboardLayout';
import { PRESET_CATEGORIES } from './data/presets';
import { Header } from './components/Header';
import { Keyboard } from './components/Keyboard';
import { TypingArea } from './components/TypingArea';
import { ResultsModal } from './components/ResultsModal';
import { ThemeModal } from './components/ThemeModal';
import { Clock, SlidersHorizontal, ShieldCheck, Sparkles, Flame, HelpCircle } from 'lucide-react';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<ThemeOption>(() => {
    const saved = localStorage.getItem('typeflow_theme');
    if (saved) {
      const found = THEMES.find((t) => t.id === saved);
      if (found) return found;
    }
    return THEMES[0];
  });

  // Sound preference
  const [soundType, setSoundType] = useState<SoundType>(() => {
    return (localStorage.getItem('typeflow_sound') as SoundType) || 'thock';
  });

  // Mode: free (default, no preset text, user types freely), custom, or preset
  const [mode, setMode] = useState<TypingMode>('free');

  // Free typing state
  const [freeText, setFreeText] = useState<string>('');

  // Custom text mode state
  const [customInputPrompt, setCustomInputPrompt] = useState<string>(
    'Har qanday matnni shu yerga kiritib, o\'z tezligingizni sinab ko\'rishingiz mumkin. Klaviaturada teginib yozish harflarni qidirishga sarflanadigan vaqtni tejaydi.'
  );
  const [targetText, setTargetText] = useState<string>(
    'Har qanday matnni shu yerga kiritib, o\'z tezligingizni sinab ko\'rishingiz mumkin.'
  );
  const [typedChars, setTypedChars] = useState<string>('');

  // Preset categories
  const [selectedCategory, setSelectedCategory] = useState<string>(PRESET_CATEGORIES[0].id);

  // Keyboard active states
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [lastPressedKey, setLastPressedKey] = useState<string | null>(null);
  const [keyPressCounts, setKeyPressCounts] = useState<Record<string, number>>({});
  const [capsLockActive, setCapsLockActive] = useState<boolean>(false);

  // Keyboard options
  const [showFingerGuide, setShowFingerGuide] = useState<boolean>(true);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(false);
  const [showKeyCounts, setShowKeyCounts] = useState<boolean>(false);

  // Duration limit (null = unlimited stopwatch, or 15, 30, 60, 120 seconds)
  const [timeLimit, setTimeLimit] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  // Test progression state
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(true);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [backspaceCount, setBackspaceCount] = useState<number>(0);
  const [history, setHistory] = useState<SpeedHistoryPoint[]>([]);

  // Modals
  const [isResultsOpen, setIsResultsOpen] = useState<boolean>(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false);

  // Hidden textarea ref for typing capture
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Save preferences
  useEffect(() => {
    localStorage.setItem('typeflow_theme', theme.id);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('typeflow_sound', soundType);
  }, [soundType]);

  // Reset test state
  const handleReset = useCallback(() => {
    setFreeText('');
    setTypedChars('');
    setIsActive(false);
    setStartTime(null);
    setElapsedSeconds(0);
    setTimeRemaining(timeLimit);
    setBackspaceCount(0);
    setHistory([]);
    setIsResultsOpen(false);
    setActiveKeys(new Set());
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [timeLimit]);

  // Finish test
  const handleFinishTest = useCallback(() => {
    setIsActive(false);
    setIsResultsOpen(true);
  }, []);

  // Compute live statistics
  const stats: TypingStats = React.useMemo(() => {
    const elapsed = Math.max(elapsedSeconds, 1);
    const minutes = elapsed / 60;

    if (mode === 'free') {
      const charCount = freeText.length;
      const wpm = minutes > 0.03 ? Math.round((charCount / 5) / minutes) : 0;
      const cpm = minutes > 0.03 ? Math.round(charCount / minutes) : 0;
      const totalAttempts = charCount + backspaceCount;
      const accuracy = totalAttempts > 0 ? Math.min(100, Math.round((charCount / totalAttempts) * 100)) : 100;

      return {
        wpm,
        rawWpm: wpm,
        cpm,
        accuracy,
        correctChars: charCount,
        incorrectChars: 0,
        totalChars: charCount,
        backspaces: backspaceCount,
        elapsedSeconds: elapsed,
        durationLimit: timeLimit,
      };
    } else {
      let correct = 0;
      let incorrect = 0;
      for (let i = 0; i < typedChars.length; i++) {
        if (typedChars[i] === targetText[i]) {
          correct++;
        } else {
          incorrect++;
        }
      }
      const total = typedChars.length;
      const wpm = minutes > 0.03 ? Math.round((correct / 5) / minutes) : 0;
      const rawWpm = minutes > 0.03 ? Math.round((total / 5) / minutes) : 0;
      const cpm = minutes > 0.03 ? Math.round(total / minutes) : 0;
      const accuracy = total > 0 ? Math.round((correct / total) * 100) : 100;

      return {
        wpm,
        rawWpm,
        cpm,
        accuracy,
        correctChars: correct,
        incorrectChars: incorrect,
        totalChars: total,
        backspaces: backspaceCount,
        elapsedSeconds: elapsed,
        durationLimit: timeLimit,
      };
    }
  }, [mode, freeText, typedChars, targetText, elapsedSeconds, backspaceCount, timeLimit]);

  // Timer tick interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && startTime) {
      interval = setInterval(() => {
        const now = performance.now();
        const secondsPassed = Math.floor((now - startTime) / 1000);
        setElapsedSeconds(secondsPassed);

        // Record speed history point every second
        const currentMins = Math.max(secondsPassed / 60, 0.02);
        const charCount = mode === 'free' ? freeText.length : typedChars.length;
        const currentWpm = Math.round((charCount / 5) / currentMins);

        setHistory((prev) => [
          ...prev,
          {
            second: secondsPassed,
            wpm: currentWpm,
            rawWpm: currentWpm,
            errors: mode === 'free' ? 0 : stats.incorrectChars,
          },
        ]);

        // Countdown timer check
        if (timeLimit !== null) {
          const remaining = Math.max(0, timeLimit - secondsPassed);
          setTimeRemaining(remaining);
          if (remaining <= 0) {
            handleFinishTest();
          }
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, startTime, timeLimit, mode, freeText.length, typedChars.length, stats.incorrectChars, handleFinishTest]);

  // Start timer on first user input if not active
  const triggerTypingStart = useCallback(() => {
    if (!isActive) {
      setIsActive(true);
      setStartTime(performance.now());
      if (timeLimit !== null) {
        setTimeRemaining(timeLimit);
      }
    }
  }, [isActive, timeLimit]);

  // Global Physical Keyboard Event Listener (CRITICAL USER REQUIREMENT:
  // "agar kampyuter klaveturasidan g bosilsa ekranda ham klabvetura bolsin va shu kampyuterdagi klaveturadan g bosilsa ekrandagi klaveturadan ham g bosilsin")
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check CapsLock status
      setCapsLockActive(e.getModifierState('CapsLock'));

      // Special shortcut: Tab + Enter or Escape resets test
      if (e.key === 'Escape') {
        e.preventDefault();
        handleReset();
        return;
      }

      // Update active on-screen key immediately
      const code = e.code;
      const keyChar = e.key;
      const normalizedCode = normalizeKeyCode(code, keyChar);

      setActiveKeys((prev) => {
        const next = new Set(prev);
        if (code) next.add(code);
        if (normalizedCode) next.add(normalizedCode);
        if (keyChar) next.add(keyChar.toLowerCase());
        return next;
      });

      // Show user-friendly last pressed key label
      setLastPressedKey(keyChar === ' ' ? 'Space' : keyChar.length === 1 ? keyChar.toUpperCase() : keyChar);

      // Increment heatmap count
      setKeyPressCounts((prev) => ({
        ...prev,
        [normalizedCode]: (prev[normalizedCode] || 0) + 1,
        [keyChar.toLowerCase()]: (prev[keyChar.toLowerCase()] || 0) + 1,
      }));

      // Play authentic mechanical switch sound
      playKeySound(soundType, keyChar);

      // Start timer on valid typing key
      if (!isActive && keyChar.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        triggerTypingStart();
      }

      // Handle custom/preset mode character-by-character validation
      if (mode !== 'free') {
        if (e.key === 'Backspace') {
          setBackspaceCount((b) => b + 1);
          setTypedChars((prev) => prev.slice(0, -1));
        } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          triggerTypingStart();
          setTypedChars((prev) => {
            const next = prev + e.key;
            if (next.length >= targetText.length) {
              setTimeout(handleFinishTest, 200);
            }
            return next;
          });
        }
      } else {
        // Free mode: track backspaces
        if (e.key === 'Backspace') {
          setBackspaceCount((b) => b + 1);
        }
      }

      // If hidden textarea isn't focused, refocus it seamlessly
      if (document.activeElement !== inputRef.current && !isThemeModalOpen && !isResultsOpen) {
        inputRef.current?.focus();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setCapsLockActive(e.getModifierState('CapsLock'));
      const code = e.code;
      const keyChar = e.key;
      const normalizedCode = normalizeKeyCode(code, keyChar);

      setActiveKeys((prev) => {
        const next = new Set(prev);
        if (code) next.delete(code);
        if (normalizedCode) next.delete(normalizedCode);
        if (keyChar) next.delete(keyChar.toLowerCase());
        return next;
      });
    };

    const handleWindowBlur = () => {
      // Clear all stuck active keys on window blur
      setActiveKeys(new Set());
    };

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', handleKeyUp, true);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [
    soundType,
    mode,
    isActive,
    targetText.length,
    handleReset,
    handleFinishTest,
    triggerTypingStart,
    isThemeModalOpen,
    isResultsOpen,
  ]);

  // Virtual key press handler (when clicking on-screen keys with mouse or finger)
  const handleVirtualKeyPress = useCallback(
    (label: string, code: string) => {
      triggerTypingStart();
      playKeySound(soundType, label);

      // Flash active key state
      setActiveKeys((prev) => new Set(prev).add(code).add(label.toLowerCase()));
      setTimeout(() => {
        setActiveKeys((prev) => {
          const next = new Set(prev);
          next.delete(code);
          next.delete(label.toLowerCase());
          return next;
        });
      }, 140);

      setLastPressedKey(label === 'space' ? 'Space' : label.toUpperCase());
      setKeyPressCounts((prev) => ({
        ...prev,
        [code]: (prev[code] || 0) + 1,
      }));

      // Apply key to text
      if (mode === 'free') {
        if (label === 'backspace') {
          setBackspaceCount((b) => b + 1);
          setFreeText((prev) => prev.slice(0, -1));
        } else if (label === 'space') {
          setFreeText((prev) => prev + ' ');
        } else if (label === 'enter') {
          setFreeText((prev) => prev + '\n');
        } else if (label.length === 1) {
          setFreeText((prev) => prev + (capsLockActive ? label.toUpperCase() : label));
        }
      } else {
        if (label === 'backspace') {
          setBackspaceCount((b) => b + 1);
          setTypedChars((prev) => prev.slice(0, -1));
        } else if (label === 'space') {
          setTypedChars((prev) => prev + ' ');
        } else if (label.length === 1) {
          setTypedChars((prev) => {
            const next = prev + (capsLockActive ? label.toUpperCase() : label);
            if (next.length >= targetText.length) {
              setTimeout(handleFinishTest, 200);
            }
            return next;
          });
        }
      }

      if (inputRef.current) {
        inputRef.current.focus();
      }
    },
    [soundType, mode, capsLockActive, targetText.length, triggerTypingStart, handleFinishTest]
  );

  // Cycle mechanical sound
  const handleCycleSound = () => {
    const list: SoundType[] = ['thock', 'clicky', 'tactile', 'bubble', 'off'];
    const nextIdx = (list.indexOf(soundType) + 1) % list.length;
    const nextSound = list[nextIdx];
    setSoundType(nextSound);
    playKeySound(nextSound, 'g');
  };

  // Switch mode
  const handleSelectMode = (newMode: TypingMode) => {
    setMode(newMode);
    handleReset();
    if (newMode === 'preset') {
      const cat = PRESET_CATEGORIES.find((c) => c.id === selectedCategory) || PRESET_CATEGORIES[0];
      setTargetText(cat.texts[0]);
    }
  };

  // Change preset category
  const handleSelectPresetCategory = (catId: string) => {
    setSelectedCategory(catId);
    const cat = PRESET_CATEGORIES.find((c) => c.id === catId);
    if (cat && cat.texts.length > 0) {
      setTargetText(cat.texts[Math.floor(Math.random() * cat.texts.length)]);
      handleReset();
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col font-sans transition-colors duration-200 selection:bg-amber-400 selection:text-black"
      style={{
        backgroundColor: theme.bg,
        color: theme.textPrimary,
      }}
    >
      {/* Top Bar Header */}
      <Header
        mode={mode}
        onSelectMode={handleSelectMode}
        theme={theme}
        soundType={soundType}
        onCycleSound={handleCycleSound}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        onOpenSettingsModal={() => setIsThemeModalOpen(true)}
        showFingerGuide={showFingerGuide}
        onToggleFingerGuide={() => setShowFingerGuide((v) => !v)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col justify-between gap-6">
        {/* Top Controls Strip: Timer & Features */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Time Limit Selector */}
          <div
            className="flex items-center gap-1 p-1 rounded-xl border"
            style={{ backgroundColor: theme.surface, borderColor: theme.border }}
          >
            <div className="flex items-center gap-1 px-2 font-mono text-[11px]" style={{ color: theme.textSecondary }}>
              <Clock className="w-3.5 h-3.5" />
              <span>Vaqt:</span>
            </div>
            {[
              { label: 'Cheksiz', val: null },
              { label: '15s', val: 15 },
              { label: '30s', val: 30 },
              { label: '60s', val: 60 },
              { label: '120s', val: 120 },
            ].map((item) => {
              const isSelected = timeLimit === item.val;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setTimeLimit(item.val);
                    setTimeRemaining(item.val);
                    handleReset();
                  }}
                  className={`px-2.5 py-1 rounded-lg font-mono font-medium transition-all ${
                    isSelected ? 'font-bold' : 'hover:opacity-80'
                  }`}
                  style={{
                    backgroundColor: isSelected ? theme.accent : 'transparent',
                    color: isSelected ? '#000000' : theme.textSecondary,
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Preset Categories selector if preset mode */}
          {mode === 'preset' && (
            <div
              className="flex items-center gap-1 p-1 rounded-xl border overflow-x-auto"
              style={{ backgroundColor: theme.surface, borderColor: theme.border }}
            >
              {PRESET_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelectPresetCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                      isSelected ? 'font-bold' : 'hover:opacity-80'
                    }`}
                    style={{
                      backgroundColor: isSelected ? theme.accent : 'transparent',
                      color: isSelected ? '#000000' : theme.textSecondary,
                    }}
                  >
                    {cat.title}
                  </button>
                );
              })}
            </div>
          )}

          {/* Visual Toggles Strip */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowHeatmap((v) => !v)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all"
              style={{
                backgroundColor: showHeatmap ? `${theme.accent}20` : theme.surface,
                borderColor: showHeatmap ? theme.accent : theme.border,
                color: showHeatmap ? theme.accent : theme.textSecondary,
              }}
              title="Eng ko'p bosilgan tugmalar intensivligi"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Issiqlik xaritasi</span>
            </button>

            <button
              type="button"
              onClick={() => setShowKeyCounts((v) => !v)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all"
              style={{
                backgroundColor: showKeyCounts ? `${theme.accent}20` : theme.surface,
                borderColor: showKeyCounts ? theme.accent : theme.border,
                color: showKeyCounts ? theme.accent : theme.textSecondary,
              }}
              title="Har bir tugma necha marta bosilgani"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Sanoqlar</span>
            </button>
          </div>
        </div>

        {/* Section 1: Typing Area (Free text canvas or Custom text prompt) */}
        <TypingArea
          mode={mode}
          freeText={freeText}
          onFreeTextChange={(newText) => {
            triggerTypingStart();
            setFreeText(newText);
          }}
          targetText={targetText}
          customInputPrompt={customInputPrompt}
          onCustomInputPromptChange={setCustomInputPrompt}
          onApplyCustomText={(newText) => {
            if (newText.trim()) {
              setTargetText(newText.trim());
              setMode('custom');
              handleReset();
            }
          }}
          onSwitchToCustom={() => {
            setMode('custom');
            handleReset();
          }}
          onSwitchToFree={() => {
            setMode('free');
            handleReset();
          }}
          typedChars={typedChars}
          inputRef={inputRef}
          theme={theme}
          isFocused={isFocused}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onReset={handleReset}
          onFinishTest={handleFinishTest}
          isActive={isActive}
          timeRemaining={timeRemaining}
          wpm={stats.wpm}
          cpm={stats.cpm}
          accuracy={stats.accuracy}
        />

        {/* Section 2: Virtual Interactive Keyboard */}
        <div className="w-full flex flex-col items-center">
          <Keyboard
            activeKeys={activeKeys}
            lastPressedKey={lastPressedKey}
            keyPressCounts={keyPressCounts}
            theme={theme}
            showFingerGuide={showFingerGuide}
            showHeatmap={showHeatmap}
            showKeyCounts={showKeyCounts}
            capsLockActive={capsLockActive}
            nextExpectedChar={mode === 'custom' ? targetText[typedChars.length] || null : null}
            onVirtualKeyPress={handleVirtualKeyPress}
          />
        </div>

        {/* Quiet human-friendly footer hint */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-2 border-t" style={{ borderColor: theme.border }}>
          <div className="flex items-center gap-2" style={{ color: theme.textSecondary }}>
            <span className="font-mono px-1.5 py-0.5 rounded border" style={{ borderColor: theme.border, backgroundColor: theme.surface }}>
              Esc
            </span>
            <span>qayta boshlash</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono px-1.5 py-0.5 rounded border" style={{ borderColor: theme.border, backgroundColor: theme.surface }}>
              Tab
            </span>
            <span>+</span>
            <span className="font-mono px-1.5 py-0.5 rounded border" style={{ borderColor: theme.border, backgroundColor: theme.surface }}>
              Enter
            </span>
            <span>tezkor restart</span>
          </div>

          <div className="flex items-center gap-2 text-[11px]" style={{ color: theme.textSecondary }}>
            <span>Haqiqiy klaviatura bilan 100% sinxronlashgan</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>
      </main>

      {/* Eng tagidagi mualliflik qatori */}
      <footer
        className="w-full py-3.5 text-center border-t text-xs select-none transition-colors"
        style={{
          borderColor: theme.border,
          backgroundColor: theme.surface,
        }}
      >
        <p className="font-mono text-xs flex items-center justify-center gap-1.5" style={{ color: theme.textSecondary }}>
          <span>Muallif:</span>
          <span className="font-bold tracking-wide px-2 py-0.5 rounded text-xs border" style={{ color: theme.accent, borderColor: theme.border, backgroundColor: theme.bg }}>
            Iskandar
          </span>
        </p>
      </footer>

      {/* Results Modal */}
      <ResultsModal
        isOpen={isResultsOpen}
        onClose={() => setIsResultsOpen(false)}
        onRestart={handleReset}
        stats={stats}
        history={history}
        theme={theme}
      />

      {/* Theme and Settings Modal */}
      <ThemeModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentTheme={theme}
        onSelectTheme={setTheme}
        soundType={soundType}
        onSelectSound={setSoundType}
        showFingerGuide={showFingerGuide}
        onToggleFingerGuide={() => setShowFingerGuide((v) => !v)}
        showHeatmap={showHeatmap}
        onToggleHeatmap={() => setShowHeatmap((v) => !v)}
        showKeyCounts={showKeyCounts}
        onToggleKeyCounts={() => setShowKeyCounts((v) => !v)}
      />
    </div>
  );
}
