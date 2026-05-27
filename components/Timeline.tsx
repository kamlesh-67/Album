'use client';

import * as React from 'react';
import { Heart, MessageSquare, Eye, Sparkles, Star, Flame, Bike, X, Play, Expand } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

function SecretNoteButton({ isRight, onClick }: { isRight: boolean; onClick: () => void }) {
  const { palette: p } = useTheme();
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-2 rounded-xl border transition-colors cursor-pointer ${isRight ? 'self-end' : 'self-start'}`}
      style={{ background: p.badgeBg, borderColor: p.badgeBorder, color: p.textSecondary }}
    >
      <MessageSquare className="h-3.5 w-3.5" />
      My secret thought...
      <Eye className="h-3.5 w-3.5 animate-pulse" />
    </button>
  );
}

interface Memory {
  id: string;
  date: string;
  displayDate: string;
  title: string;
  subtitle: string;
  description: string;
  secretNote: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  icon: React.ReactNode;
  accentFrom: string;
  accentTo: string;
  badgeBg: string;
  badgeText: string;
}

const MEMORIES: Memory[] = [
  {
    id: '1',
    date: '2024-11-08',
    displayDate: '8 November 2024',
    title: 'The Day We Found Love',
    subtitle: 'The beginning of everything',
    description:
      'The day we said "I love you" to each other was not a beautiful day in the ordinary sense. We were not lovers, and not just ordinary friends either — we had already assumed each other as husband and wife. That is what made it so different. That is what made it ours.',
    secretNote:
      'I never truly felt love at that moment — you were the one who loved me. But as time passed and we spent days together, as I started knowing you more and more, something shifted quietly inside me. That is when I fell in love with you.',
    mediaUrl: '/assets/images/hand.jpg',
    mediaType: 'image',
    icon: <Heart className="h-5 w-5 fill-white text-white" />,
    accentFrom: 'from-rose-400',
    accentTo: 'to-pink-500',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-600',
  },
  {
    id: '2',
    date: '2024-12-14',
    displayDate: '14 December 2024',
    title: 'First Day in Person',
    subtitle: 'Truly remarkable day',
    description:
      'The first time we truly met in person. Every second felt like a dream I never wanted to wake from. Seeing you standing there — my heart forgot how to behave. You were even more beautiful, more real, more everything than I imagined.',
    secretNote:
      'I kept replaying every second of that day for weeks after. The way you smiled when you saw me — I will carry that forever.',
    mediaUrl: '/assets/images/first day we meet/photo_6104686542979797075_y.jpg',
    mediaType: 'image',
    icon: <Star className="h-5 w-5 fill-white text-white" />,
    accentFrom: 'from-amber-400',
    accentTo: 'to-orange-500',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700',
  },
  {
    id: '3',
    date: '2024-12-25',
    displayDate: '25 December 2024',
    title: 'First Day We Make Love',
    subtitle: 'A chapter only ours',
    description:
      'A day that belongs only to us. The most intimate, tender, and beautiful chapter of our story. Every touch, every breath, every moment is etched into my soul forever. You gave me all of you — and I gave you all of me.',
    secretNote:
      'I will carry this day inside me always. You trusted me completely, and that means everything in this world to me.',
    mediaUrl: '/assets/images/first love/photo_6104686542979797078_y.jpg',
    mediaType: 'image',
    icon: <Flame className="h-5 w-5 fill-white text-white" />,
    accentFrom: 'from-red-400',
    accentTo: 'to-rose-600',
    badgeBg: 'bg-red-50',
    badgeText: 'text-red-600',
  },
  {
    id: '4',
    date: '2025-07-12',
    displayDate: '12 July 2025',
    title: 'Scooty Ride Together',
    subtitle: 'Memorable fun time',
    description:
      'A free, joyful ride together — wind in our faces, laughter in the air, no destination but each other. Just us, the open road, and the feeling that life is perfectly, completely right when we are together like this.',
    secretNote:
      'Holding on to you on that ride — arms around you, the wind loud, your laugh in my ear — I never wanted it to end.',
    mediaUrl: '/assets/images/document_6104686542519803676.mp4',
    mediaType: 'video',
    icon: <Bike className="h-5 w-5 fill-white text-white" />,
    accentFrom: 'from-purple-400',
    accentTo: 'to-indigo-500',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-700',
  },
];


/* Fullscreen lightbox — image or video, video autoplays, no controls */
function Lightbox({ memory, onClose }: { memory: Memory; onClose: () => void }) {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  React.useEffect(() => {
    if (memory.mediaType === 'video' && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    };
  }, [memory.mediaType]);

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-200 cursor-pointer"
      onClick={onClose}
    >
      <button
        className="absolute top-5 right-5 bg-white/10 hover:bg-white/25 p-2.5 rounded-full text-white transition-colors z-10"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </button>

      <div
        className="relative max-w-5xl w-full flex items-center justify-center animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {memory.mediaType === 'video' ? (
          <video
            ref={videoRef}
            src={memory.mediaUrl}
            autoPlay
            playsInline
            loop
            className="max-w-full max-h-[88vh] rounded-2xl shadow-2xl object-contain"
            style={{ pointerEvents: 'none' }}
          />
        ) : (
          <img
            src={memory.mediaUrl}
            alt={memory.title}
            className="max-w-full max-h-[88vh] object-contain rounded-2xl shadow-2xl"
          />
        )}
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <p className="text-white font-serif italic text-base">{memory.title}</p>
        <p className="text-white/50 font-mono text-[10px] tracking-widest mt-1">{memory.displayDate}</p>
      </div>
    </div>
  );
}

/* Image/video thumbnail panel with click-to-expand */
function MediaPanel({ memory, align }: { memory: Memory; align: 'left' | 'right' }) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <>
      <div className="w-full h-full animate-in fade-in duration-500">
        <div
          className="relative rounded-3xl overflow-hidden shadow-lg border-4 border-white group cursor-pointer"
          onClick={() => memory.mediaUrl && setExpanded(true)}
        >
          {memory.mediaUrl && memory.mediaType ? (
            <>
              {memory.mediaType === 'video' ? (
                <video
                  src={memory.mediaUrl}
                  muted
                  playsInline
                  preload="metadata"
                  className="w-full object-cover max-h-72 pointer-events-none"
                />
              ) : (
                <img
                  src={memory.mediaUrl}
                  alt={memory.title}
                  className="w-full object-cover max-h-72 group-hover:scale-105 transition-transform duration-500"
                />
              )}

              {/* Hover overlay — play icon for video, expand for image */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                <div className="bg-black/50 rounded-full p-4 backdrop-blur-sm">
                  {memory.mediaType === 'video'
                    ? <Play className="h-7 w-7 text-white fill-white" />
                    : <Expand className="h-6 w-6 text-white" />
                  }
                </div>
              </div>
            </>
          ) : (
            <div className={`w-full min-h-[180px] bg-gradient-to-br ${memory.accentFrom} ${memory.accentTo} flex flex-col items-center justify-center gap-3 py-14`}>
              <Heart className="h-10 w-10 fill-white/40 text-white animate-pulse" />
              <span className="text-[10px] text-white/70 font-mono tracking-widest uppercase">Photo coming soon</span>
            </div>
          )}

          {/* Label overlay — bottom gradient */}
          <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-4 py-4 flex flex-col ${align === 'right' ? 'items-end text-right' : 'items-start text-left'}`}>
            <span className={`inline-block text-[9px] font-bold px-2.5 py-1 rounded-full mb-1.5 ${memory.badgeBg} ${memory.badgeText}`}>
              {memory.subtitle}
            </span>
            <span className="text-[10px] font-mono text-white/80 tracking-widest uppercase">{memory.displayDate}</span>
          </div>
        </div>
      </div>

      {expanded && <Lightbox memory={memory} onClose={() => setExpanded(false)} />}
    </>
  );
}

/* Fullscreen letter modal for secret note */
function SecretLetterModal({ memory, onClose }: { memory: Memory; onClose: () => void }) {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 animate-in fade-in duration-300"
      style={{ background: 'rgba(30,10,20,0.82)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      {/* Letter paper */}
      <div
        className="relative max-w-lg w-full animate-in zoom-in-95 fade-in duration-300"
        style={{
          background: 'linear-gradient(160deg, #fffaf6 0%, #fff5f7 60%, #fdf0f4 100%)',
          borderRadius: '4px',
          boxShadow: '0 8px 60px rgba(180,60,80,0.18), 0 2px 8px rgba(0,0,0,0.10)',
          border: '1px solid rgba(255,200,210,0.5)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top fold crease line */}
        <div style={{ height: '3px', background: 'linear-gradient(90deg, transparent, rgba(220,100,120,0.15), transparent)', borderRadius: '4px 4px 0 0' }} />

        <div className="px-10 py-10 flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col items-center gap-2 select-none">
            <Heart className="h-5 w-5 fill-rose-300 text-rose-400 animate-pulse" />
            <span
              className="text-[10px] tracking-[0.22em] uppercase text-rose-400 font-mono"
            >
              My Secret Thought
            </span>
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-rose-200 to-transparent" />
            <p
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontSize: '11px',
                color: '#c97a8a',
                letterSpacing: '0.05em',
              }}
            >
              {memory.displayDate} &mdash; {memory.title}
            </p>
          </div>

          {/* Letter body */}
          <p
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontSize: '17px',
              lineHeight: '1.85',
              color: '#4a1525',
              fontStyle: 'italic',
              letterSpacing: '0.01em',
              textAlign: 'center',
            }}
          >
            &ldquo;{memory.secretNote}&rdquo;
          </p>

          {/* Signature line */}
          <div className="flex flex-col items-center gap-1 select-none">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-rose-200 to-transparent" />
            <span
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontSize: '13px',
                color: '#c97a8a',
                fontStyle: 'italic',
              }}
            >
              — Kamlesh
            </span>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full text-rose-300 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* Text panel — sits on opposite side with title + description + secret note */
function TextPanel({ memory, align }: { memory: Memory; align: 'left' | 'right' }) {
  const [open, setOpen] = React.useState(false);
  const isRight = align === 'right';

  return (
    <div className={`w-full flex flex-col gap-3 animate-in fade-in duration-500 ${isRight ? 'items-end text-right' : 'items-start text-left'}`}>

      {/* Title */}
      <div className={`flex items-center gap-2 ${isRight ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${memory.accentFrom} ${memory.accentTo} flex items-center justify-center shadow-md shrink-0`}>
          {memory.icon}
        </div>
        <h3 className="font-serif font-bold text-rose-950 text-lg leading-tight">{memory.title}</h3>
      </div>

      {/* Divider */}
      <div className={`h-px w-16 bg-gradient-to-r ${memory.accentFrom} ${memory.accentTo} rounded-full`} />

      {/* Description */}
      <p className="text-sm text-gray-600 leading-relaxed font-sans">{memory.description}</p>

      {/* Secret note button */}
      <SecretNoteButton isRight={isRight} onClick={() => setOpen(true)} />

      {open && <SecretLetterModal memory={memory} onClose={() => setOpen(false)} />}
    </div>
  );
}

export default function Timeline() {
  const { palette: p } = useTheme();
  return (
    <div className="w-full flex flex-col gap-0" id="timeline-section">

      {/* Header */}
      <div className="flex items-center gap-3 mb-10 select-none">
        <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${p.accentMid})` }} />
        <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm" style={{ border: `1px solid ${p.accentLight}` }}>
          <Sparkles className="h-3.5 w-3.5 animate-spin" style={{ color: p.accentStrong }} />
          <span className="text-[11px] font-bold uppercase tracking-widest font-mono" style={{ color: p.textSecondary }}>Our Story So Far</span>
          <Heart className="h-3.5 w-3.5 animate-pulse" style={{ color: p.accentStrong, fill: p.accentMid }} />
        </div>
        <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${p.accentMid})` }} />
      </div>

      {/* Timeline — center rope, alternating cards */}
      <div className="relative">

        {/* Center vertical rope */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 pointer-events-none" style={{ background: `linear-gradient(to bottom, ${p.accentLight}, ${p.accentMid}, ${p.accentStrong})` }} />

        <div className="space-y-16">
          {MEMORIES.map((memory, idx) => {
            // even idx → image LEFT, text RIGHT
            // odd idx  → text LEFT, image RIGHT
            const imageOnLeft = idx % 2 === 0;

            return (
              <div key={memory.id} className="relative flex items-center gap-0">

                {/* LEFT slot */}
                <div className="w-1/2 pr-10 flex justify-end items-center">
                  {imageOnLeft
                    ? <MediaPanel memory={memory} align="right" />
                    : <TextPanel memory={memory} align="right" />
                  }
                </div>

                {/* Center node on the rope */}
                <div className="absolute left-1/2 -translate-x-1/2 z-10">
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${memory.accentFrom} ${memory.accentTo} shadow-lg flex items-center justify-center ring-4 ring-white`}>
                    {memory.icon}
                  </div>
                </div>

                {/* RIGHT slot */}
                <div className="w-1/2 pl-10 flex justify-start items-center">
                  {imageOnLeft
                    ? <TextPanel memory={memory} align="left" />
                    : <MediaPanel memory={memory} align="left" />
                  }
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Footer — end of timeline so far */}
      <div className="mt-14 flex flex-col items-center gap-3 select-none">
        <div className="flex items-center gap-2">
          <div className="h-px w-16" style={{ background: p.accentMid }} />
          <Heart className="h-5 w-5 animate-pulse" style={{ fill: p.accentMid, color: p.accentStrong }} />
          <div className="h-px w-16" style={{ background: p.accentMid }} />
        </div>
        <p className="text-[11px] font-mono tracking-widest uppercase" style={{ color: p.accentStrong }}>
          To be continued... always
        </p>
        <p className="text-xs font-serif italic" style={{ color: p.textMuted }}>Kamlesh &amp; Sunita — writing our forever</p>
      </div>

    </div>
  );
}
