'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Stars, Sparkles, Calendar, BookOpen, Music, ShieldAlert, Settings, Camera, Flame, X, Monitor } from 'lucide-react';
import SparklesBackground from '@/components/Sparkles';
import MusicPlayer from '@/components/MusicPlayer';
import Timeline from '@/components/Timeline';
import PhotoGallery from '@/components/PhotoGallery';
import SecretNotes from '@/components/SecretNotes';
import { ThemeContext, PALETTES } from '@/lib/ThemeContext';

// ── Modal layer order ──────────────────────────────────────────────────────────
// 1. Desktop-only gate (if mobile)
// 2. "Do you love me?" gate (if not answered Yes)
// 3. Guidelines modal (once per session)
// 4. Main album content

export default function Home() {
  const [unlocked, setUnlocked] = React.useState(false);
  const userName = 'Kamlesh';
  const loveName = 'Sunita';
  const [anniversary, setAnniversary] = React.useState('');
  const [dateError, setDateError] = React.useState('');
  const [activePaletteIndex, setActivePaletteIndex] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState<'timeline' | 'gallery' | 'notes' | 'music'>('timeline');

  // ── Gate states ───────────────────────────────────────────────────────────────
  const [isMobile, setIsMobile] = React.useState(false);
  // null = not answered yet, 'yes' = accepted, 'no' = rejected
  const [loveAnswer, setLoveAnswer] = React.useState<'yes' | 'no' | null>(null);
  const [showGuidelines, setShowGuidelines] = React.useState(false);
  const [appReady, setAppReady] = React.useState(false);

  const CORRECT_DATE = '2024-11-08';

  // Live timer States
  const [daysOfLove, setDaysOfLove] = React.useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // ── Boot-time gate checks (runs once, client-only) ────────────────────────
  React.useEffect(() => {
    // 1. Mobile detection — block screens under 1024px
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // 2. Love answer — persisted in localStorage forever
    const storedLove = localStorage.getItem('love_gate_answer');
    if (storedLove === 'yes') {
      setLoveAnswer('yes');
    } else if (storedLove === 'no') {
      setLoveAnswer('no');
    }

    // 3. Guidelines — shown once per browser session (sessionStorage)
    const seenGuidelines = sessionStorage.getItem('seen_guidelines');
    if (!seenGuidelines && storedLove === 'yes') {
      setShowGuidelines(true);
    }

    // 4. Album unlock state
    const savedAnniv = localStorage.getItem('love_anniversary');
    const savedPal = localStorage.getItem('love_theme_idx');
    const savedUnlock = localStorage.getItem('love_unlocked');
    if (savedAnniv) setAnniversary(savedAnniv);
    if (savedPal) setActivePaletteIndex(Number(savedPal));
    if (savedUnlock === 'true') setUnlocked(true);

    setAppReady(true);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLoveYes = () => {
    localStorage.setItem('love_gate_answer', 'yes');
    setLoveAnswer('yes');
    const seenGuidelines = sessionStorage.getItem('seen_guidelines');
    if (!seenGuidelines) setShowGuidelines(true);
  };

  const handleLoveNo = () => {
    localStorage.setItem('love_gate_answer', 'no');
    setLoveAnswer('no');
  };

  const handleCloseGuidelines = () => {
    sessionStorage.setItem('seen_guidelines', 'true');
    setShowGuidelines(false);
  };

  // Load configuration from local storage (legacy effect kept for hot-reload safety)
  React.useEffect(() => {
    if (!appReady) return;
    const savedAnniv = localStorage.getItem('love_anniversary');
    const savedPal = localStorage.getItem('love_theme_idx');
    const savedUnlock = localStorage.getItem('love_unlocked');
    if (savedAnniv) setAnniversary(savedAnniv);
    if (savedPal) setActivePaletteIndex(Number(savedPal));
    if (savedUnlock === 'true') setUnlocked(true);
  }, [appReady]);

  // Anniversary Live Ticker update
  React.useEffect(() => {
    const calculateTime = () => {
      const start = new Date((anniversary || CORRECT_DATE) + 'T00:00:00').getTime();
      const now = new Date().getTime();
      const diff = now - start;

      if (diff <= 0) {
        setDaysOfLove({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const msecPerDay = 1000 * 60 * 60 * 24;
      const msecPerHour = 1000 * 60 * 60;
      const msecPerMin = 1000 * 60;

      const days = Math.floor(diff / msecPerDay);
      const hours = Math.floor((diff % msecPerDay) / msecPerHour);
      const minutes = Math.floor((diff % msecPerHour) / msecPerMin);
      const seconds = Math.floor((diff % msecPerMin) / 1000);

      setDaysOfLove({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [anniversary]);

  const handleUnlockAndSave = () => {
    if (anniversary !== CORRECT_DATE) {
      setDateError('Hmm, that date doesn\'t feel right. Remember the day we realised our love? 💕');
      return;
    }
    setDateError('');
    localStorage.setItem('love_anniversary', anniversary);
    localStorage.setItem('love_theme_idx', String(activePaletteIndex));
    localStorage.setItem('love_unlocked', 'true');
    setUnlocked(true);
  };

  const handleRelockAndClear = () => {
    if (confirm('Do you wish to lock this Memory Album binder again? This will close the album cover.')) {
      localStorage.removeItem('love_unlocked');
      localStorage.removeItem('love_anniversary');
      setAnniversary('');
      setDateError('');
      setUnlocked(false);
    }
  };

  const currentPalette = PALETTES[activePaletteIndex];
  const p = currentPalette;

  return (
    <ThemeContext.Provider value={{ palette: p, paletteIndex: activePaletteIndex, setPaletteIndex: setActivePaletteIndex }}>
    <main
      className="min-h-screen relative flex flex-col items-center transition-colors duration-500 py-6 sm:py-12 px-4 select-none"
      style={{ background: p.bg }}
    >

      {/* Absolute particle / spark background layout */}
      <SparklesBackground />

      {/* ── GATE 1: Mobile / small-screen block ──────────────────────────── */}
      <AnimatePresence>
        {appReady && isMobile && (
          <motion.div
            key="mobile-gate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-gradient-to-br from-rose-50 to-pink-100 px-8 text-center"
          >
            <div className="bg-white/90 rounded-3xl shadow-2xl p-10 max-w-sm border border-pink-200">
              <div className="mx-auto mb-5 h-16 w-16 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 flex items-center justify-center shadow-lg shadow-pink-200">
                <Monitor className="h-8 w-8 text-white" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-rose-900 mb-3">Open on a Laptop</h2>
              <p className="text-sm text-rose-700/80 leading-relaxed mb-2">
                This Memory Album is crafted for desktop browsers and requires a screen wider than 1024px.
              </p>
              <p className="text-xs text-gray-400 font-mono tracking-widest uppercase mt-4">
                Please open on a laptop or desktop computer
              </p>
              <div className="mt-6 flex items-center justify-center gap-1 text-rose-400">
                <Heart className="h-4 w-4 fill-rose-400 animate-pulse" />
                <Heart className="h-3 w-3 fill-rose-300 animate-pulse" style={{ animationDelay: '0.3s' }} />
                <Heart className="h-4 w-4 fill-rose-400 animate-pulse" style={{ animationDelay: '0.6s' }} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── GATE 2: "Do you love me?" modal ─────────────────────────────── */}
      <AnimatePresence>
        {appReady && !isMobile && loveAnswer === null && (
          <motion.div
            key="love-gate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[190] flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="bg-white/95 rounded-3xl shadow-2xl border border-pink-200 p-10 max-w-sm w-full text-center relative overflow-hidden"
            >
              {/* Soft blobs */}
              <div className="absolute -top-12 -left-12 h-36 w-36 rounded-full bg-pink-100 opacity-40 pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 h-36 w-36 rounded-full bg-rose-100 opacity-40 pointer-events-none" />

              <div className="relative z-10">
                <div className="mx-auto mb-5 h-20 w-20 rounded-full bg-gradient-to-r from-pink-400 to-rose-500 flex items-center justify-center shadow-xl shadow-pink-300 animate-pulse-slow">
                  <Heart className="h-10 w-10 text-white fill-white" />
                </div>

                <span className="text-[10px] uppercase font-bold tracking-widest text-rose-400 font-mono block mb-2">
                  Before You Enter
                </span>
                <h2 className="font-serif text-3xl font-bold text-rose-950 mb-2 leading-tight">
                  Do you love me?
                </h2>
                <p className="text-xs text-rose-600/70 mb-8 leading-relaxed">
                  This album was made with all my heart. Answer truly — it opens only for love.
                </p>

                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handleLoveYes}
                    className="flex-1 py-4 rounded-2xl text-white font-serif font-bold text-base shadow-xl transition-all active:scale-95 hover:scale-105 duration-200 cursor-pointer"
                    style={{ background: 'linear-gradient(to right, #f43f5e, #ec4899)' }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Heart className="h-5 w-5 fill-white animate-pulse" />
                      Yes
                    </span>
                  </button>
                  <button
                    onClick={handleLoveNo}
                    className="flex-1 py-4 rounded-2xl text-rose-400 font-serif font-bold text-base border-2 border-rose-200 bg-white hover:bg-rose-50 transition-all active:scale-95 duration-200 cursor-pointer"
                  >
                    No
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── GATE 2b: Rejected screen (No was chosen) ─────────────────────── */}
      <AnimatePresence>
        {appReady && !isMobile && loveAnswer === 'no' && (
          <motion.div
            key="rejected-gate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[190] flex items-center justify-center bg-gradient-to-br from-gray-50 to-rose-50 px-4"
          >
            <div className="bg-white/90 rounded-3xl shadow-xl border border-rose-100 p-12 max-w-sm w-full text-center">
              <div className="mx-auto mb-5 h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                <Heart className="h-8 w-8 text-gray-300" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-gray-400 mb-3">This album is not for you.</h2>
              <p className="text-xs text-gray-400 leading-relaxed">
                This space holds memories that belong only to those who love truly. Come back when you do.
              </p>
              <p className="mt-6 text-[10px] text-gray-300 font-mono tracking-widest uppercase">
                Access permanently closed in this browser
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── GATE 3: Guidelines modal (once per session) ───────────────────── */}
      <AnimatePresence>
        {appReady && !isMobile && loveAnswer === 'yes' && showGuidelines && (
          <motion.div
            key="guidelines-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[180] flex items-center justify-center bg-black/25 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.93, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="bg-white/97 rounded-3xl shadow-2xl border border-pink-200 p-8 max-w-md w-full relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-pink-50 opacity-50 pointer-events-none" />

              <button
                onClick={handleCloseGuidelines}
                className="absolute top-4 right-4 h-8 w-8 rounded-full bg-rose-50 hover:bg-rose-100 flex items-center justify-center text-rose-400 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 flex items-center justify-center shadow-md">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-rose-400 font-mono block">Welcome Back</span>
                    <h3 className="font-serif text-xl font-bold text-rose-900 leading-tight">How to use this Album</h3>
                  </div>
                </div>

                <ul className="space-y-3 mb-7 text-sm text-rose-800/80 leading-relaxed">
                  <li className="flex gap-2.5 items-start">
                    <span className="mt-0.5 text-rose-400">🔑</span>
                    <span>Enter the date we realised our love to unlock the album. The date is our secret.</span>
                  </li>
                  <li className="flex gap-2.5 items-start">
                    <span className="mt-0.5 text-rose-400">🎨</span>
                    <span>Pick your favourite pastel shade — it colours the whole experience just for you.</span>
                  </li>
                  <li className="flex gap-2.5 items-start">
                    <span className="mt-0.5 text-rose-400">📖</span>
                    <span>Explore Timeline, Polaroid Gallery, Secret Chest, and Love Harmony tabs inside.</span>
                  </li>
                  <li className="flex gap-2.5 items-start">
                    <span className="mt-0.5 text-rose-400">💾</span>
                    <span>Your settings are saved automatically. Close & Lock Book resets to the cover.</span>
                  </li>
                  <li className="flex gap-2.5 items-start">
                    <span className="mt-0.5 text-rose-400">🎵</span>
                    <span>Music keeps playing even when you switch tabs — a floating player appears in the corner.</span>
                  </li>
                </ul>

                <button
                  onClick={handleCloseGuidelines}
                  className="w-full py-3.5 rounded-2xl text-white font-serif font-bold text-sm shadow-lg transition-all active:scale-95 hover:opacity-90 duration-200 cursor-pointer"
                  style={{ background: 'linear-gradient(to right, #f43f5e, #ec4899)' }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Heart className="h-4 w-4 fill-white animate-pulse" />
                    Enter the Album
                  </span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Elegant whimsical butterflies floating on background boundaries (using standard CSS animations) */}
      <div className="absolute top-16 left-[5%] text-pink-400 pointer-events-none opacity-40 animate-flutter z-0">
        <Heart className="h-10 w-10 fill-pink-200" />
      </div>
      <div className="absolute bottom-24 right-[5%] text-rose-400 pointer-events-none opacity-40 animate-flutter z-0" style={{ animationDelay: '4s' }}>
        <Heart className="h-12 w-12 fill-rose-100 rotate-45" />
      </div>

      <AnimatePresence mode="wait">
        {!unlocked ? (
          // WELCOME/GATE SCREEN WITH NAME AND PALETTE CUSTOMIZER
          <motion.div
            key="welcome-gate"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            id="welcome-gate-card"
            className="w-full max-w-lg bg-white/90 rounded-3xl border border-pink-200 shadow-2xl p-6 sm:p-10 text-center relative overflow-hidden glass-morphism-dark z-20 mx-auto self-center my-auto"
          >
            {/* Soft background decor */}
            <div className="absolute -top-16 -left-16 h-40 w-40 rounded-full bg-pink-100 opacity-30 pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-rose-100 opacity-30 pointer-events-none" />

            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 flex items-center justify-center shadow-lg shadow-pink-200 animate-pulse-slow mb-4">
              <Heart className="h-8 w-8 text-white fill-white" />
            </div>

            <span className="text-[10px] uppercase font-bold tracking-widest text-rose-500 font-mono block mb-1">
              Sentimental Archive Lockbox
            </span>
            <h2 className="font-serif text-3xl font-bold text-rose-950 mb-3 leading-tight select-none">
              Memory Album of Love
            </h2>
            <p className="text-xs text-rose-700/80 max-w-sm mx-auto mb-8 leading-relaxed">
              Open the custom-tailored diary dedicated to our moments, starry nights, letters, and custom sweet memories.
            </p>

            {/* Input config ledger */}
            <div className="space-y-4 text-left mb-8">
              <div>
                <label className="block text-[10px] font-bold text-rose-900 uppercase tracking-widest mb-1.5 font-sans">Date we realise our love</label>
                <input
                  type="date"
                  value={anniversary}
                  onChange={(e) => { setAnniversary(e.target.value); setDateError(''); }}
                  className={`w-full rounded-xl border bg-rose-50/25 p-2.5 text-xs text-rose-950 font-medium focus:outline-none focus:ring-1 cursor-pointer ${dateError ? 'border-red-300 focus:ring-red-400' : 'border-pink-100 focus:ring-rose-400'}`}
                  id="gate-anniversary-date"
                />
                {dateError && (
                  <p className="mt-1.5 text-[10px] text-red-500 font-medium leading-snug">{dateError}</p>
                )}
              </div>

              {/* Theme palette select */}
              <div>
                <label className="block text-[10px] font-bold text-rose-900 uppercase tracking-widest mb-2 font-sans">Favorite Pastel Shade</label>
                <div className="grid grid-cols-3 gap-2" id="palette-choices">
                  {PALETTES.map((pal, i) => (
                    <button
                      key={pal.id}
                      type="button"
                      onClick={() => setActivePaletteIndex(i)}
                      className="text-[10px] font-bold py-2 rounded-xl border transition-all"
                      style={activePaletteIndex === i ? {
                        background: pal.badgeBg,
                        borderColor: pal.accentStrong,
                        color: pal.textSecondary,
                        boxShadow: `0 0 0 1px ${pal.accentMid}`,
                      } : {
                        background: 'rgba(255,255,255,0.5)',
                        borderColor: pal.accentLight,
                        color: pal.textPrimary,
                      }}
                    >
                      {pal.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Turn Key submit button */}
            <button
              onClick={handleUnlockAndSave}
              className="w-full flex items-center justify-center gap-1.5 py-4 rounded-2xl text-white font-serif font-bold text-sm shadow-xl transition-all active:scale-95 duration-300 cursor-pointer"
              style={{ background: `linear-gradient(to right, ${p.gradFrom}, ${p.gradTo})` }}
              id="unlock-vault-btn"
            >
              <Stars className="h-4 w-4 animate-spin text-white" />
              <span>Turn the Key & Open Album</span>
            </button>
          </motion.div>
        ) : (
          // MAIN CORE SCRAPBOOK AND ALBUM STRUCTURE
          <motion.div
            key="scrapbook-main"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-5xl z-20 flex flex-col gap-6"
            id="unlocked-diary-frame"
          >
            {/* Top Bar Header controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/75 p-5 rounded-3xl border border-pink-100/50 shadow-sm glass-morphism relative overflow-hidden">
              <div className="absolute top-0 left-0 p-1 text-pink-400/20 pointer-events-none">
                <Heart className="h-16 w-16 opacity-10 animate-bounce" />
              </div>

              {/* Names header display */}
              <div className="flex items-center gap-3 select-none text-center sm:text-left">
                <div className="h-11 w-11 rounded-full bg-pink-100/70 border border-pink-200 flex items-center justify-center text-rose-600">
                  <BookOpen className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <h1 className="font-serif font-bold text-rose-950 text-lg leading-tight flex items-center gap-1">
                    {userName} <Heart className="h-3 w-3 fill-rose-500 text-rose-500 animate-pulse mx-0.5" /> {loveName}
                  </h1>
                  <span className="text-[10px] text-gray-500/80 font-mono tracking-widest uppercase block mt-0.5">
                    Memory Sanctuary • Est. {new Date(anniversary).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Reset lock states */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setUnlocked(false)} // temporary edit toggle
                  className="rounded-full bg-rose-50 hover:bg-rose-100 text-rose-800 text-[10px] px-3 py-1.5 border border-pink-100 font-semibold transition-transform"
                >
                  Edit Settings
                </button>
                <button
                  onClick={handleRelockAndClear}
                  className="rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] px-3 py-1.5 border border-gray-200 font-semibold transition-transform cursor-pointer"
                  id="lock-vault-btn"
                >
                  Close & Lock Book
                </button>
              </div>
            </div>

            {/* Relationship Progress widget (Days of Love live ticker) */}
            <div
              className="p-6 rounded-3xl text-white shadow-lg relative overflow-hidden text-center sm:text-left select-none"
              style={{ background: `linear-gradient(to right, ${p.gradFrom}, ${p.gradTo}, ${p.gradFrom})` }}
            >
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-pink-100/90 block mb-1">
                    Days of Unbroken Devotion
                  </span>
                  <p className="font-cursive text-2xl font-bold tracking-wide select-none italic text-pink-50">
                    &ldquo;Every second with you is a constellation in my chest.&rdquo;
                  </p>
                </div>

                {/* Clock counters */}
                <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap" id="devotion-live-ticker">
                  <div className="flex flex-col items-center bg-white/15 px-3 py-2 rounded-2xl border border-white/10 min-w-[55px] backdrop-blur-sm">
                    <span className="text-xl sm:text-2xl font-bold font-serif leading-none">{daysOfLove.days}</span>
                    <span className="text-[8px] uppercase tracking-wider text-pink-100 font-bold mt-1">Days</span>
                  </div>
                  <div className="flex flex-col items-center bg-white/15 px-3 py-2 rounded-2xl border border-white/10 min-w-[55px] backdrop-blur-sm">
                    <span className="text-xl sm:text-2xl font-bold font-serif leading-none">{daysOfLove.hours}</span>
                    <span className="text-[8px] uppercase tracking-wider text-pink-100 font-bold mt-1">Hrs</span>
                  </div>
                  <div className="flex flex-col items-center bg-white/15 px-3 py-2 rounded-2xl border border-white/10 min-w-[55px] backdrop-blur-sm">
                    <span className="text-xl sm:text-2xl font-bold font-serif leading-none">{daysOfLove.minutes}</span>
                    <span className="text-[8px] uppercase tracking-wider text-pink-100 font-bold mt-1">Mins</span>
                  </div>
                  <div className="flex flex-col items-center bg-white/15 px-3 py-2 rounded-2xl border border-white/10 min-w-[55px] backdrop-blur-sm">
                    <span className="text-xl sm:text-2xl font-bold font-serif leading-none text-rose-200 animate-pulse">{daysOfLove.seconds}</span>
                    <span className="text-[8px] uppercase tracking-wider text-pink-100 font-bold mt-1">Secs</span>
                  </div>
                </div>
              </div>

              {/* Whimsical heart background */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white/5 opacity-10 pointer-events-none">
                <Heart className="h-60 w-60 animate-pulse" />
              </div>
            </div>

            {/* Navigation Tabs Scrapbook Lace Booklet selectors */}
            <div
              className="flex items-center justify-between sm:justify-center gap-1.5 sm:gap-4 overflow-x-auto p-2 rounded-2xl shadow-sm"
              style={{ background: 'rgba(255,255,255,0.65)', border: `1px solid ${p.accentLight}` }}
              id="scrapbook-tabs"
            >
              {(['timeline', 'gallery', 'notes', 'music'] as const).map((tab) => {
                const labels: Record<string, string> = { timeline: '📖 Timeline', gallery: '📸 Polaroid Deck', notes: '🔒 Secret Chest', music: '🎵 Love Harmony' };
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-serif font-black transition-all cursor-pointer truncate"
                    style={isActive ? {
                      background: `linear-gradient(to right, ${p.gradFrom}, ${p.gradTo})`,
                      color: '#fff',
                      boxShadow: `0 2px 12px ${p.gradFrom}55`,
                    } : {
                      color: p.textPrimary,
                    }}
                  >
                    {labels[tab]}
                  </button>
                );
              })}
            </div>

            {/* Active Content Frame Tab Panel */}
            <div className="min-h-[400px] flex flex-col justify-start" id="active-tab-panel">
              <AnimatePresence mode="wait">
                {activeTab === 'timeline' && (
                  <motion.div
                    key="timeline-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Timeline />
                  </motion.div>
                )}

                {activeTab === 'gallery' && (
                  <motion.div
                    key="gallery-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <PhotoGallery />
                  </motion.div>
                )}

                {activeTab === 'notes' && (
                  <motion.div
                    key="notes-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SecretNotes />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Music Player is kept permanently mounted inside the page to prevent sound unmount, but dynamically positioned based on minimized state */}
              <div className={activeTab === 'music' ? 'w-full block animate-in fade-in duration-300' : 'fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50'}>
                <MusicPlayer
                  isMinimized={activeTab !== 'music'}
                  onNavigateToMusicTab={() => setActiveTab('music')}
                  unlocked={unlocked}
                />
              </div>
            </div>

            {/* Whimsical Love Message board note */}
            <div className="mt-8 text-center pt-6 pb-2 select-none" style={{ borderTop: `1px solid ${p.accentLight}` }}>
              <div className="inline-flex items-center justify-center gap-1 text-[11px] font-cursive leading-none italic font-bold tracking-wide text-rose-500 mb-1.5 md:text-sm">
                <Heart className="h-3 w-3 fill-rose-500 animate-beat text-rose-500 animate-pulse" /> We are writers of our own legend.
              </div>
              <p className="text-[10px] text-gray-400 font-mono tracking-wide">
                MADE WITH UNCONDITIONAL LOVE FOR IMMERSIVE RECORD KEEPING • LOCALSTORAGE PERSISTENCE IS ACTIVE
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
    </ThemeContext.Provider>
  );
}
