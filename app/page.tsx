'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Stars, Sparkles, Calendar, BookOpen, Music, ShieldAlert, Settings, Camera, Flame } from 'lucide-react';
import SparklesBackground from '@/components/Sparkles';
import MusicPlayer from '@/components/MusicPlayer';
import Timeline from '@/components/Timeline';
import PhotoGallery from '@/components/PhotoGallery';
import SecretNotes from '@/components/SecretNotes';

// Pastel theme sets
interface Palette {
  id: string;
  name: string;
  bgClass: string;
  accentClass: string;
  badgeClass: string;
  cardBorder: string;
  highlightText: string;
}

const PALETTES: Palette[] = [
  {
    id: 'blushing',
    name: 'Blushing Rosé',
    bgClass: 'bg-[#fffbfb]',
    accentClass: 'from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600',
    badgeClass: 'text-rose-600 bg-rose-50 border-rose-100',
    cardBorder: 'border-pink-100',
    highlightText: 'text-rose-900',
  },
  {
    id: 'honey',
    name: 'Apricot Honey',
    bgClass: 'bg-[#fffdf8]',
    accentClass: 'from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600',
    badgeClass: 'text-amber-800 bg-amber-50 border-amber-100',
    cardBorder: 'border-amber-100',
    highlightText: 'text-amber-900',
  },
  {
    id: 'lavender',
    name: 'Wisteria Dusk',
    bgClass: 'bg-[#faf8ff]',
    accentClass: 'from-purple-400 to-indigo-500 hover:from-purple-500 hover:to-indigo-600',
    badgeClass: 'text-purple-600 bg-purple-50 border-purple-100',
    cardBorder: 'border-purple-100',
    highlightText: 'text-purple-900',
  }
];

export default function Home() {
  const [unlocked, setUnlocked] = React.useState(false);
  const [showWelcomeDialog, setShowWelcomeDialog] = React.useState(false);
  const userName = 'Kamlesh';
  const loveName = 'Sunita';
  const [anniversary, setAnniversary] = React.useState('');
  const [dateError, setDateError] = React.useState('');
  const [activePaletteIndex, setActivePaletteIndex] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState<'timeline' | 'gallery' | 'notes' | 'music'>('timeline');

  const CORRECT_DATE = '2024-12-25';

  // Live timer States
  const [daysOfLove, setDaysOfLove] = React.useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Show welcome dialog on very first visit
  React.useEffect(() => {
    const seen = localStorage.getItem('love_welcome_seen');
    if (!seen) setShowWelcomeDialog(true);
  }, []);

  // Load configuration from local storage
  React.useEffect(() => {
    const savedAnniv = localStorage.getItem('love_anniversary');
    const savedPal = localStorage.getItem('love_theme_idx');
    const savedUnlock = localStorage.getItem('love_unlocked');

    const timer = setTimeout(() => {
      if (savedAnniv) setAnniversary(savedAnniv);
      if (savedPal) setActivePaletteIndex(Number(savedPal));
      if (savedUnlock === 'true') setUnlocked(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

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
      setDateError('Hmm, that date doesn\'t feel right. Remember the first time we made love? 💕');
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
      setUnlocked(false);
    }
  };

  const currentPalette = PALETTES[activePaletteIndex];

  return (
    <main className={`min-h-screen relative flex flex-col items-center transition-colors duration-500 py-6 sm:py-12 px-4 select-none ${currentPalette.bgClass}`}>

      {/* Welcome dialog — best experience hint */}
      <AnimatePresence>
        {showWelcomeDialog && (
          <motion.div
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full px-8 py-10 flex flex-col items-center text-center overflow-hidden"
              initial={{ scale: 0.85, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            >
              {/* soft pink glow blob */}
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-rose-100 blur-3xl opacity-60 pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-pink-100 blur-3xl opacity-60 pointer-events-none" />

              {/* icons row */}
              <div className="flex items-center gap-4 mb-5 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center shadow-sm">
                  <span className="text-2xl">💻</span>
                </div>
                <Heart className="h-5 w-5 text-rose-300 fill-rose-200 animate-pulse shrink-0" />
                <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center shadow-sm">
                  <span className="text-2xl">🎧</span>
                </div>
              </div>

              {/* heading */}
              <h2 className="font-serif font-bold text-rose-900 text-xl leading-snug mb-2 relative z-10">
                For the best experience
              </h2>

              {/* tips */}
              <div className="flex flex-col gap-2.5 w-full mt-1 mb-6 relative z-10">
                <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-2xl px-4 py-3 text-left">
                  <span className="text-lg shrink-0">💻</span>
                  <p className="text-sm text-rose-800 leading-snug">
                    <span className="font-semibold">Open on a laptop</span> — this album is designed for a wider screen so every memory looks its best.
                  </p>
                </div>
                <div className="flex items-start gap-3 bg-purple-50 border border-purple-100 rounded-2xl px-4 py-3 text-left">
                  <span className="text-lg shrink-0">🎧</span>
                  <p className="text-sm text-purple-800 leading-snug">
                    <span className="font-semibold">Wear headphones</span> — there is music and video audio that feels much more intimate when you listen closely.
                  </p>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => {
                  localStorage.setItem('love_welcome_seen', 'true');
                  setShowWelcomeDialog(false);
                }}
                className="relative z-10 w-full bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white font-semibold text-sm py-3 rounded-2xl shadow-md transition-all duration-200 cursor-pointer"
              >
                I&apos;m ready 💕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Absolute particle / spark background layout */}
      <SparklesBackground />

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
                <label className="block text-[10px] font-bold text-rose-900 uppercase tracking-widest mb-1.5 font-sans">The date we first made love</label>
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
                      className={`text-[10px] font-bold py-2 rounded-xl border transition-all ${
                        activePaletteIndex === i
                          ? 'border-rose-400 bg-rose-50 text-rose-700 shadow-inner ring-1 ring-rose-300'
                          : 'border-pink-50 hover:bg-rose-50/40 text-rose-950 bg-white/50'
                      }`}
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
              className={`w-full flex items-center justify-center gap-1.5 py-4 rounded-2xl bg-gradient-to-r text-white font-serif font-bold text-sm shadow-xl transition-all active:scale-95 duration-300 cursor-pointer ${currentPalette.accentClass}`}
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
            <div className="bg-gradient-to-r from-rose-400 via-pink-400 to-rose-400 p-6 rounded-3xl text-white shadow-lg relative overflow-hidden text-center sm:text-left select-none animate-gradient">
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
            <div className="flex items-center justify-center bg-white/60 p-2 rounded-2xl border border-pink-100/60 shadow-sm glass-morphism justify-between sm:justify-center gap-1.5 sm:gap-4 overflow-x-auto" id="scrapbook-tabs">
              <button
                onClick={() => setActiveTab('timeline')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-serif font-black transition-all cursor-pointer truncate ${
                  activeTab === 'timeline'
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                    : 'text-rose-950 hover:bg-rose-50'
                }`}
              >
                📖 Timeline
              </button>
              <button
                onClick={() => setActiveTab('gallery')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-serif font-black transition-all cursor-pointer truncate ${
                  activeTab === 'gallery'
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                    : 'text-rose-950 hover:bg-rose-50'
                }`}
              >
                📸 Polaroid Deck
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-serif font-black transition-all cursor-pointer truncate ${
                  activeTab === 'notes'
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                    : 'text-rose-950 hover:bg-rose-50'
                }`}
              >
                🔒 Secret Chest
              </button>
              <button
                onClick={() => setActiveTab('music')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-serif font-black transition-all cursor-pointer truncate ${
                  activeTab === 'music'
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                    : 'text-rose-950 hover:bg-rose-50'
                }`}
              >
                🎵 Love Harmony
              </button>
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
            <div className={`mt-8 text-center border-t ${currentPalette.cardBorder} pt-6 pb-2 select-none`}>
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
  );
}
