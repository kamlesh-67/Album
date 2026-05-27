'use client';

import * as React from 'react';
import { Lock, Unlock, Mail, Calendar, Sparkles, Heart, Compass } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

interface SecretLetter {
  id: string;
  themeTitle: string;
  lockedUntil: string; // ISO date string "YYYY-MM-DD"
  previewHint: string;
  romanticMessage: string;
}

const SECRET_LETTERS: SecretLetter[] = [
  {
    id: 'l1',
    themeTitle: 'The Autumn Promise',
    lockedUntil: '2026-05-20', // Already past relative to May 27, 2026!
    previewHint: 'A vintage letter explaining the exact millisecond I grew certain we were meant to endure.',
    romanticMessage: `My Dearest,

If you are reading this, it means our milestone has finally arrived, and the timeline has opened this small capsule of my heart. 

I wrote this because words in spoken air can sometimes slip away, but letters on the page remain like anchors. From the very first week of knowing you, my thoughts shifted from "myself" to "us." I began to notice how your laughter felt like a safe harbor. 

Thank you for being the quiet constant in a noisy, fast-spinning world.

With all my heart,
Your Love`
  },
  {
    id: 'l2',
    themeTitle: 'Midnight Whispers',
    lockedUntil: '2026-06-15', // Near future
    previewHint: 'A secret lockbox detailing a silent promise made under the dim lights of midnight.',
    romanticMessage: `My Darling,

Welcome to the future, where this note has finally broken its digital lock. 

Do you remember that quiet night where we lay talking on the rug until 3:00 AM, guessing what the constellations would look like if we rearranged them? You said that love isn't about finding someone to live with—it's about finding the one you cannot imagine life without.

I lay awake long after you drifted to sleep that night, listening to the small rhythm of your chest rising and falling. I promised then to protect your peace with every fiber of my being.

Forever and a day,
Me`
  },
  {
    id: 'l3',
    themeTitle: 'The Valentine’s Epistle',
    lockedUntil: '2027-02-14', // Far future
    previewHint: 'Our very next Valentine’s celebration tribute. A heavy letter of deep, undying devotion.',
    romanticMessage: `My Eternal Partner,

On this Day of Hearts, my devotion only shines with a higher, brighter flame. 

Over months and semesters, the novelty of standard infatuation fades into something much grander: a real, sacred, indestructible partnership. I love the simple routines we have built—making toast, sharing half-parsed glances across a crowded room, holding your fingers in mine when we drive.

You are my high peak, my quiet valley, and my home.

Happy Valentine’s Day, my sweet love.`
  }
];

export default function SecretNotes() {
  const { palette: p } = useTheme();
  // Current local time from metadata is May 27, 2026
  const DEFAULT_CURRENT_DATE = '2026-05-27';
  const [simulatedDate, setSimulatedDate] = React.useState(DEFAULT_CURRENT_DATE);
  const [timeTravelOn, setTimeTravelOn] = React.useState(false);
  const [openLetterId, setOpenLetterId] = React.useState<string | null>(null);

  // Parse simulated date as midnight timestamp
  const getSimulatedTime = () => {
    return new Date(simulatedDate + 'T00:00:00').getTime();
  };

  // Helper: check if unlocked
  const isUnlocked = (lockDateStr: string) => {
    const lockTime = new Date(lockDateStr + 'T00:00:00').getTime();
    const curTime = getSimulatedTime();
    return curTime >= lockTime;
  };

  // Remaining days helper
  const getRemainingDays = (lockDateStr: string) => {
    const lockTime = new Date(lockDateStr + 'T00:00:00').getTime();
    const curTime = getSimulatedTime();
    const diff = lockTime - curTime;
    if (diff <= 0) return 0;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="w-full flex flex-col gap-6" id="secret-capsule-section">
      
      {/* Time Travel Simulator Control Box */}
      <div className="p-5 rounded-3xl shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ background: p.surface, border: `1px solid ${p.surfaceBorder}` }}>
        
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-1.5 text-rose-800">
            <Compass className="h-4.5 w-4.5 animate-spin text-rose-500" />
            <h4 className="font-serif font-bold text-sm tracking-tight">Time Travel Simulator</h4>
          </div>
          <p className="text-xs text-rose-900/70 select-none">
            Simulate a calendar date to test unlocking. Standard local date is set to{' '}
            <strong className="text-rose-950 font-semibold">May 27, 2026</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 flex-wrap shrink-0">
          <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-rose-950 select-none">
            <input
              type="checkbox"
              checked={timeTravelOn}
              onChange={(e) => {
                setTimeTravelOn(e.target.checked);
                if (!e.target.checked) {
                  // revert to actual date
                  setSimulatedDate(DEFAULT_CURRENT_DATE);
                }
              }}
              className="accent-rose-500 h-4 w-4 cursor-pointer rounded"
              id="time-travel-checkbox"
            />
            Activate Simulator
          </label>

          {timeTravelOn && (
            <div className="flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-200">
              <input
                type="date"
                value={simulatedDate}
                onChange={(e) => setSimulatedDate(e.target.value)}
                className="rounded-xl border border-pink-200 bg-white p-2 text-xs text-rose-950 focus:outline-none cursor-pointer text-center"
                id="simulator-date-input"
              />
              <button
                onClick={() => setSimulatedDate('2027-02-14')}
                className="px-2.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-[10px] transition-all shadow-sm cursor-pointer"
                id="travel-vday-btn"
              >
                Go Valentine’s Day
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grid of Letters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="secret-letters-grid">
        {SECRET_LETTERS.map((letter) => {
          const unlocked = isUnlocked(letter.lockedUntil);
          const daysLeft = getRemainingDays(letter.lockedUntil);

          return (
            <div
              key={letter.id}
              className={`rounded-3xl border p-5 relative flex flex-col justify-between transition-all duration-300 min-h-[260px] bg-white ${
                unlocked
                  ? 'border-pink-200 shadow-md hover:shadow-xl hover:scale-102 bg-white/80'
                  : 'border-pink-100 bg-neutral-50/50 shadow-inner'
              }`}
              id={`letter-node-${letter.id}`}
            >
              
              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Unlocks {new Date(letter.lockedUntil).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  
                  {unlocked ? (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      <Unlock className="h-3 w-3" /> Ready
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100 animate-pulse">
                      <Lock className="h-3 w-3" /> Locked
                    </span>
                  )}
                </div>

                <h4 className="font-serif font-bold text-rose-950 text-base mb-1.5">
                  {letter.themeTitle}
                </h4>

                <p className="text-xs text-gray-500 leading-relaxed font-sans mb-4">
                  {letter.previewHint}
                </p>
              </div>

              {/* Action Section */}
              <div className="border-t border-neutral-50 pt-4 flex flex-col gap-2.5">
                {unlocked ? (
                  <button
                    onClick={() => setOpenLetterId(letter.id)}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-white font-serif font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                    style={{ background: `linear-gradient(to right, ${p.gradFrom}, ${p.gradTo})` }}
                    id={`open-letter-btn-${letter.id}`}
                  >
                    <Mail className="h-3.5 w-3.5 fill-current" /> Read Secret Note
                  </button>
                ) : (
                  <div className="text-center bg-rose-50/50 py-3 rounded-xl border border-pink-100/50">
                    <p className="text-[18px] font-bold text-rose-950 font-serif leading-none tracking-tight">
                      {daysLeft}
                    </p>
                    <p className="text-[9px] text-rose-500 font-bold uppercase tracking-widest mt-1">
                      Days of Devotion Remaining
                    </p>
                  </div>
                )}
              </div>

              {/* Decorative motif layout corner */}
              <div className="absolute bottom-2 right-2 text-pink-200 pointer-events-none">
                <Heart className={`h-12 w-12 opacity-8 ${unlocked ? 'fill-rose-100 text-rose-300' : ''}`} />
              </div>

            </div>
          );
        })}
      </div>

      {/* Letter Reading Frame overlay */}
      {openLetterId !== null && (() => {
        const activeLetter = SECRET_LETTERS.find((l) => l.id === openLetterId);
        if (!activeLetter) return null;

        return (
          <div
            className="fixed inset-0 bg-rose-950/40 z-[120] backdrop-blur-md flex items-center justify-center p-4 cursor-default select-none animate-in fade-in duration-300"
            onClick={() => setOpenLetterId(null)}
            id="letter-fullview-backdrop"
          >
            <div
              className="bg-[#fffdfb] max-w-xl w-full rounded-3xl p-8 shadow-2xl relative border-2 border-pink-200 overflow-hidden text-center sm:text-left"
              onClick={(e) => e.stopPropagation()}
              id="letter-letterhead-container"
            >
              
              {/* Top flower details decoration */}
              <div className="absolute top-0 left-0 right-0 h-2" style={{ background: `linear-gradient(to right, ${p.gradFrom}, ${p.gradTo}, ${p.gradFrom})` }} />
              <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-pink-100/50 opacity-50 border border-pink-200" />
              
              <div className="flex justify-between items-start border-b border-pink-100 pb-3 mb-5">
                <div>
                  <span className="text-[10px] text-rose-500 font-mono block uppercase tracking-widest leading-none mb-1">
                    Romantic Ledger Scroll
                  </span>
                  <h3 className="font-serif text-lg font-bold text-rose-950">
                    {activeLetter.themeTitle}
                  </h3>
                </div>
                <button
                  onClick={() => setOpenLetterId(null)}
                  className="rounded-full bg-pink-50 hover:bg-rose-100 p-1.5 text-rose-900 font-semibold text-xs cursor-pointer"
                >
                  Close
                </button>
              </div>

              {/* Handwriting Body */}
              <div className="max-h-[380px] overflow-y-auto pr-2" id="scrollable-letter-content">
                <div className="font-cursive text-rose-900 text-xl leading-relaxed whitespace-pre-wrap italic tracking-wide">
                  {activeLetter.romanticMessage}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-pink-100 flex items-center justify-center gap-1 text-[11px] text-rose-500/80 font-serif italic">
                <Sparkles className="h-3.5 w-3.5 text-yellow-500 animate-spin" /> Written with eternal love on memory capsule lock.
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
}
