'use client';

import * as React from 'react';
import { Play, Square, Music, Volume2, Sparkles, Heart } from 'lucide-react';
import { motion } from 'motion/react';

// Frequencies for our gorgeous piano/harp system
const SCALES = {
  C: [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25], // C Major notes (C4 to C5)
};

const CHORDS = [
  { name: 'C Maj9 (Warm Embrace)', roots: [261.63, 329.63, 392.00, 493.88, 587.33], color: 'bg-rose-100 dark:text-rose-800' },
  { name: 'F Maj7 (First Glance)', roots: [349.23, 440.00, 523.25, 659.25, 783.99], color: 'bg-pink-100 dark:text-pink-800' },
  { name: 'Am9 (Shared Secret)', roots: [220.00, 329.63, 392.00, 523.25, 659.25], color: 'bg-amber-100 dark:text-amber-800' },
  { name: 'G6 (Pure Bliss)', roots: [293.66, 392.00, 493.88, 587.33, 783.99], color: 'bg-orange-100 dark:text-orange-800' },
  { name: 'E Sublim (Sweet Dream)', roots: [329.63, 415.30, 493.88, 659.25, 830.61], color: 'bg-violet-100 dark:text-violet-800' }
];

// Romantic composition tracks: [frequency index list, duration multiples]
const MELODIES = [
  {
    title: 'Canon in D (True Love)',
    notes: [329.63, 293.66, 261.63, 246.94, 220.00, 196.00, 220.00, 246.94, 261.63, 329.63, 293.66, 261.63, 246.94, 220.00, 196.00, 246.94],
    durations: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  },
  {
    title: 'La Vie En Rose (True Romance)',
    notes: [392.00, 440.00, 493.88, 523.25, 523.25, 493.88, 440.00, 392.00, 349.23, 392.00, 440.00, 493.88, 493.88, 440.00, 392.00, 349.23],
    durations: [1.5, 0.5, 1, 2, 1.5, 0.5, 1, 2, 1.5, 0.5, 1, 2, 1.5, 0.5, 1, 2]
  }
];

interface MusicPlayerProps {
  isMinimized?: boolean;
  onNavigateToMusicTab?: () => void;
  unlocked?: boolean;
}

export default function MusicPlayer({ isMinimized = false, onNavigateToMusicTab, unlocked = false }: MusicPlayerProps) {
  const [audioCtx, setAudioCtx] = React.useState<AudioContext | null>(null);
  const [isPlayingSeq, setIsPlayingSeq] = React.useState(false);
  const [selectedMelodyIndex, setSelectedMelodyIndex] = React.useState(0);
  const [instrument, setInstrument] = React.useState<'music_box' | 'harp' | 'chime'>('music_box');
  const [activeNote, setActiveNote] = React.useState<number | null>(null);
  const [volume, setVolume] = React.useState(0.5);
  const [sequencerTimer, setSequencerTimer] = React.useState<NodeJS.Timeout | null>(null);
  const [currentStep, setCurrentStep] = React.useState(0);

  // Initialize Web Audio
  const initAudio = () => {
    if (audioCtx) return audioCtx;
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    setAudioCtx(ctx);
    return ctx;
  };

  const playOscillator = (frequencies: number[], durationSec: number = 0.8) => {
    const ctx = initAudio();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Master Gain node
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume * 0.4, ctx.currentTime);
    masterGain.connect(ctx.destination);

    // Filter to sweeten high frequencies (vintage music-box style)
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(instrument === 'chime' ? 3000 : 1800, ctx.currentTime);
    filter.Q.setValueAtTime(1, ctx.currentTime);
    filter.connect(masterGain);

    // Play all notes in chord
    frequencies.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(filter);

      // Instrument settings
      if (instrument === 'music_box') {
        osc.type = 'sine';
        // music box click sound / short attack
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(1.0, ctx.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSec * 0.9);
      } else if (instrument === 'chime') {
        osc.type = 'triangle';
        // slow chime bloom
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSec * 1.5);
      } else {
        // Harp / warm bell
        osc.type = 'triangle';
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(1.0, ctx.currentTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSec * 1.4);
      }

      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.start(ctx.currentTime + index * 0.03); // tiny strum effect
      osc.stop(ctx.currentTime + durationSec * 1.6);
    });
  };

  // Trigger manually tapped chord
  const triggerChord = (notes: number[]) => {
    playOscillator(notes, 1.8);
    // Visual ripple
    setActiveNote(notes[0]);
    setTimeout(() => {
      setActiveNote(null);
    }, 700);
  };

  // Stop current loops
  const stopSequencer = React.useCallback(() => {
    if (sequencerTimer) {
      clearInterval(sequencerTimer);
      setSequencerTimer(null);
    }
    setIsPlayingSeq(false);
    setCurrentStep(0);
  }, [sequencerTimer]);

  // Start sequenced auto-plays
  const startSequencer = () => {
    const ctx = initAudio();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    stopSequencer();
    setIsPlayingSeq(true);

    const activeMelody = MELODIES[selectedMelodyIndex];
    let step = 0;

    const interval = setInterval(() => {
      const freq = activeMelody.notes[step];
      const dur = activeMelody.durations[step] * 0.8;

      playOscillator([freq], dur);
      setCurrentStep(step);
      setActiveNote(freq);

      setTimeout(() => {
        setActiveNote(null);
      }, dur * 500);

      step = (step + 1) % activeMelody.notes.length;
    }, 450);

    setSequencerTimer(interval);
  };

  // Cleanup on dismount
  React.useEffect(() => {
    return () => {
      if (sequencerTimer) clearInterval(sequencerTimer);
    };
  }, [sequencerTimer]);


  if (isMinimized) {
    if (!unlocked) return null;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-white/95 backdrop-blur-md rounded-2xl border border-pink-200/80 shadow-2xl p-2.5 sm:p-3 pr-4 flex items-center gap-3 select-none"
        style={{ pointerEvents: 'auto' }}
        id="mini-soundtrack-player"
      >
        <button
          onClick={onNavigateToMusicTab}
          className="relative h-10 w-10 flex items-center justify-center rounded-full bg-rose-50 hover:bg-rose-100 border border-pink-100 shrink-0 group transition-all duration-300 active:scale-95 cursor-pointer"
          id="mini-open-harmony"
          title="Customize Soundtrack Melody"
        >
          {isPlayingSeq && (
            <span className="absolute inset-0 rounded-full bg-rose-200/50 animate-ping opacity-70" />
          )}
          <Music className={`h-4.5 w-4.5 text-rose-500 relative z-10 transition-transform ${isPlayingSeq ? 'animate-spin' : 'group-hover:scale-115'}`} style={{ animationDuration: isPlayingSeq ? '6s' : '0s' }} />
        </button>

        <div className="flex flex-col min-w-[100px] max-w-[150px]">
          <span className="text-[8px] uppercase tracking-widest text-rose-500 font-bold font-mono">Soundtrack</span>
          <span className="text-[11px] font-serif font-bold text-rose-950 truncate animate-in fade-in" title={MELODIES[selectedMelodyIndex].title}>
            {MELODIES[selectedMelodyIndex].title}
          </span>
          <span className="text-[9px] text-gray-500 italic truncate capitalize">
            {instrument.replace('_', ' ')}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!isPlayingSeq ? (
            <button
              onClick={startSequencer}
              className="h-8 w-8 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center transition-transform active:scale-90 cursor-pointer shadow-md select-none"
              id="mini-play-btn"
              title="Play soundtrack loop"
            >
              <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
            </button>
          ) : (
            <button
              onClick={stopSequencer}
              className="h-8 w-8 rounded-full bg-gray-500 hover:bg-gray-600 text-white flex items-center justify-center transition-transform active:scale-90 cursor-pointer shadow-md select-none"
              id="mini-stop-btn"
              title="Silence background"
            >
              <Square className="h-3 w-3 fill-current" />
            </button>
          )}

          <div className="flex items-center gap-1 bg-rose-50/70 p-1 rounded-lg border border-pink-100/30">
            <Volume2 className="h-3 w-3 text-rose-400 shrink-0" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-12 sm:w-16 h-0.5 accent-rose-400 bg-pink-100 cursor-pointer"
              title="Soundtrack Volume"
              id="mini-volume-slider"
            />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div
      id="love-synthesizer-card"
      className="rounded-3xl border border-pink-200 p-6 shadow-xl transition-all hover:shadow-2xl bg-white/70 glass-morphism-dark relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-3 text-pink-300 pointer-events-none">
        <Heart className="h-20 w-20 opacity-10 rotate-12" />
      </div>

      {/* Header */}
      <div className="flex flex-col gap-1.5 mb-5 select-none text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <Music className="h-5 w-5 text-rose-500 animate-bounce" />
          <h3 className="font-serif text-xl font-bold tracking-tight text-rose-950">Interactive Music Generator</h3>
        </div>
        <p className="text-xs text-rose-600/80">
          Create melodic loops or listen to preset romantic lullabyes. Powered natively inside your space.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        
        {/* Left Control Panel */}
        <div className="md:col-span-4 flex flex-col gap-4 bg-white/60 p-4 rounded-2xl border border-pink-100">
          <div>
            <label className="block text-[11px] font-bold text-rose-900 uppercase tracking-wider mb-2">Instrument Voice</label>
            <div className="grid grid-cols-3 gap-1" id="voice-selector">
              <button
                onClick={() => setInstrument('music_box')}
                className={`text-xs py-2 rounded-xl border transition-all ${
                  instrument === 'music_box'
                    ? 'border-rose-400 bg-rose-50 text-rose-700 font-semibold shadow-inner'
                    : 'border-pink-50 hover:bg-rose-50 text-rose-950'
                }`}
              >
                Music Box
              </button>
              <button
                onClick={() => setInstrument('chime')}
                className={`text-xs py-2 rounded-xl border transition-all ${
                  instrument === 'chime'
                    ? 'border-rose-400 bg-rose-50 text-rose-700 font-semibold shadow-inner'
                    : 'border-pink-50 hover:bg-rose-50 text-rose-950'
                }`}
              >
                Soft Chime
              </button>
              <button
                onClick={() => setInstrument('harp')}
                className={`text-xs py-2 rounded-xl border transition-all ${
                  instrument === 'harp'
                    ? 'border-rose-400 bg-rose-50 text-rose-700 font-semibold shadow-inner'
                    : 'border-pink-50 hover:bg-rose-50 text-rose-950'
                }`}
              >
                Lover Harp
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-rose-900 uppercase tracking-wider mb-2">Preprogrammed Tune</label>
            <select
              value={selectedMelodyIndex}
              onChange={(e) => {
                setSelectedMelodyIndex(Number(e.target.value));
                if (isPlayingSeq) {
                  // restart with new melody
                  setTimeout(() => startSequencer(), 50);
                }
              }}
              className="w-full rounded-xl border border-pink-200 bg-white p-2 text-xs text-rose-950 focus:outline-none focus:ring-1 focus:ring-rose-400"
              id="melody-dropdown"
            >
              {MELODIES.map((mel, i) => (
                <option key={i} value={i}>
                  {mel.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <Volume2 className="h-4 w-4 text-rose-500 shrink-0" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full accent-rose-400 h-1 rounded-lg bg-pink-100 cursor-pointer"
              id="volume-slider"
              title="Volume"
            />
          </div>

          <div className="mt-2 flex gap-2">
            {!isPlayingSeq ? (
              <button
                onClick={startSequencer}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white font-serif font-semibold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                id="composer-play-btn"
              >
                <Play className="h-3.5 w-3.5 fill-current" /> Play Love Composer
              </button>
            ) : (
              <button
                onClick={stopSequencer}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-gray-500 hover:bg-gray-600 text-white font-semibold text-xs shadow-md transition-all active:scale-95 cursor-pointer animate-pulse"
                id="composer-stop-btn"
              >
                <Square className="h-3.5 w-3.5 fill-current" /> Stop Sequencer
              </button>
            )}
          </div>
        </div>

        {/* Right Active Harmony Board */}
        <div className="md:col-span-8 flex flex-col justify-between bg-white/70 p-4 rounded-2xl border border-pink-100 min-h-[220px]">
          
          {/* Virtual Visualizer Bar */}
          <div className="flex justify-between items-end h-16 px-4 mb-4" id="audio-viz-bars">
            {Array.from({ length: 16 }).map((_, i) => {
              const active = isPlayingSeq && currentStep % 16 === i;
              const hasSoundNode = activeNote !== null && Math.sin(i * 123) > -0.3;
              // Pure, deterministic trigonometric height formula to comply with React render purity
              const deterministicHeight = active || hasSoundNode 
                ? `${Math.floor((Math.sin(i * 2.3) + 1.1) * 20) + 12}px` 
                : '6px';
              return (
                <div
                  key={i}
                  className="w-2.5 rounded-full bg-rose-200 transition-all duration-300"
                  style={{
                    height: deterministicHeight,
                    backgroundColor: active ? '#f43f5e' : hasSoundNode ? '#ec4899' : '#fecdd3'
                  }}
                />
              );
            })}
          </div>

          <div>
            <span className="block text-[11px] font-bold text-rose-900 uppercase tracking-wider mb-2.5 text-center sm:text-left">
              Heart Harmony Board (Click a chord button to strum)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2" id="chord-board">
              {CHORDS.map((chord, i) => {
                const isActive = activeNote !== null && chord.roots.includes(activeNote);
                return (
                  <button
                    key={i}
                    onClick={() => triggerChord(chord.roots)}
                    className={`relative overflow-hidden flex flex-col items-center justify-center gap-1 p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      isActive
                        ? 'border-rose-500 bg-rose-200 scale-105 shadow-md shadow-rose-200 ring-2 ring-rose-400'
                        : 'border-pink-100 bg-rose-50/50 hover:bg-rose-50 hover:scale-102 hover:border-pink-300 text-rose-950'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${isActive ? 'text-rose-600 fill-rose-600 scale-125' : 'text-pink-400'} transition-transform duration-300`} />
                    <span className="text-[10px] font-serif font-bold leading-none mt-1 break-words max-w-full">
                      {chord.name.split(' ')[0]}
                    </span>
                    <span className="text-[9px] text-gray-500 font-sans italic truncate max-w-full">
                      {chord.name.substring(chord.name.indexOf('('))}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-[9px] text-rose-500/80 font-sans italic text-center mt-3 flex items-center justify-center gap-1">
            <Sparkles className="h-3 w-3 animate-spin text-pink-400" />
            Tip: Keep your sound on, select a voice, and tap a chord above to synthesize romantic resonance.
          </div>
        </div>

      </div>
    </div>
  );
}
