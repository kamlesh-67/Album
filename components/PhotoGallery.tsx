'use client';

import * as React from 'react';
import { Heart, X, ChevronLeft, ChevronRight, Play } from 'lucide-react';

type MediaType = 'image' | 'video';

interface MediaItem {
  id: string;
  src: string;
  type: MediaType;
  caption: string;
  album: string;
  albumEmoji: string;
}

const GALLERY: MediaItem[] = [
  // Dancing Queen
  {
    id: 'dq1',
    src: '/assets/images/dance.mp4',
    type: 'video',
    caption: 'Our dance moment together 💃',
    album: 'Dancing Queen',
    albumEmoji: '💃',
  },
  {
    id: 'dq2',
    src: '/assets/images/document_6104686542519803679.mp4',
    type: 'video',
    caption: 'Moving with joy 🎶',
    album: 'Dancing Queen',
    albumEmoji: '💃',
  },

  // Initial Kisses
  {
    id: 'ik1',
    src: '/assets/images/initial kises/document_6104686542519803672.mp4',
    type: 'video',
    caption: 'Our very first kiss 💋',
    album: 'Initial Kisses',
    albumEmoji: '💋',
  },
  {
    id: 'ik2',
    src: '/assets/images/initial kises/document_6104686542519803671.mp4',
    type: 'video',
    caption: 'Sweet beginning kisses 😘',
    album: 'Initial Kisses',
    albumEmoji: '💋',
  },
  {
    id: 'ik3',
    src: '/assets/images/initial kises/document_6104686542519803670.mp4',
    type: 'video',
    caption: 'Those magical starting days 💖',
    album: 'Initial Kisses',
    albumEmoji: '💋',
  },

  // Saree
  {
    id: 'sa1',
    src: '/assets/images/saree/photo_6104686542979797101_y.jpg',
    type: 'image',
    caption: 'Adorable beauty in saree 🌸',
    album: 'Adorable Beauty in Saree',
    albumEmoji: '🥻',
  },
  {
    id: 'sa2',
    src: '/assets/images/saree/photo_6104686542979797102_y.jpg',
    type: 'image',
    caption: 'Grace personified 🌺',
    album: 'Adorable Beauty in Saree',
    albumEmoji: '🥻',
  },
  {
    id: 'sa3',
    src: '/assets/images/saree/photo_6104686542979797103_y.jpg',
    type: 'image',
    caption: 'She is poetry in fabric 💐',
    album: 'Adorable Beauty in Saree',
    albumEmoji: '🥻',
  },
  {
    id: 'sa4',
    src: '/assets/images/saree/photo_6104686542979797104_y.jpg',
    type: 'image',
    caption: 'My beautiful Sunita 🌹',
    album: 'Adorable Beauty in Saree',
    albumEmoji: '🥻',
  },
  {
    id: 'sa5',
    src: '/assets/images/saree/photo_6104686542979797105_y.jpg',
    type: 'image',
    caption: 'Radiant as always ✨',
    album: 'Adorable Beauty in Saree',
    albumEmoji: '🥻',
  },

  // First Love
  {
    id: 'fl1',
    src: '/assets/images/first love/photo_6104686542979797076_y.jpg',
    type: 'image',
    caption: 'The day we made love 🔥',
    album: 'First Day We Make Love',
    albumEmoji: '🔥',
  },
  {
    id: 'fl2',
    src: '/assets/images/first love/photo_6104686542979797077_y.jpg',
    type: 'image',
    caption: 'Lost in each other 💞',
    album: 'First Day We Make Love',
    albumEmoji: '🔥',
  },
  {
    id: 'fl3',
    src: '/assets/images/first love/photo_6104686542979797078_y.jpg',
    type: 'image',
    caption: 'A moment only ours 🌙',
    album: 'First Day We Make Love',
    albumEmoji: '🔥',
  },

  // First day we meet
  {
    id: 'fd1',
    src: '/assets/images/first day we meet/photo_6104686542979797075_y.jpg',
    type: 'image',
    caption: 'First day in person — truly remarkable 🌟',
    album: 'First Day We Meet in Person',
    albumEmoji: '🌟',
  },

  // Hands
  {
    id: 'hand1',
    src: '/assets/images/hand.jpg',
    type: 'image',
    caption: 'Our hands, one warmth 🤝',
    album: 'Hands of Ours',
    albumEmoji: '🤝',
  },

  // Cuteness in every frame
  {
    id: 'cu1',
    src: '/assets/images/document_6104686542519803677.mp4',
    type: 'video',
    caption: 'Cuteness overload 🥰',
    album: 'Cuteness in Every Frame',
    albumEmoji: '🥰',
  },
  {
    id: 'cu2',
    src: '/assets/images/document_6104686542519803680.mp4',
    type: 'video',
    caption: 'Every frame a treasure 🎀',
    album: 'Cuteness in Every Frame',
    albumEmoji: '🥰',
  },

  // Eyes
  {
    id: 'eye1',
    src: '/assets/images/eye.jpg',
    type: 'image',
    caption: 'One soul, two bodies — our eyes tell it all 👁️',
    album: 'Eyes Like One Soul',
    albumEmoji: '👁️',
  },

  // Fun together
  {
    id: 'fun1',
    src: '/assets/images/document_6104686542519803676.mp4',
    type: 'video',
    caption: 'Scooty ride — memorable fun time 🛵',
    album: 'Fun Together',
    albumEmoji: '🛵',
  },

  // Sleeping Beauty
  {
    id: 'sl1',
    src: '/assets/images/photo_6104686542979797085_y.jpg',
    type: 'image',
    caption: 'Sleeping beauty 😴✨',
    album: 'Sleeping Beauty',
    albumEmoji: '😴',
  },
  {
    id: 'sl2',
    src: '/assets/images/photo_6104686542979797081_y.jpg',
    type: 'image',
    caption: 'Peaceful as an angel 🕊️',
    album: 'Sleeping Beauty',
    albumEmoji: '😴',
  },

  // Devi Maa
  {
    id: 'dev1',
    src: '/assets/images/photo_6104686542979797084_y.jpg',
    type: 'image',
    caption: 'Devi Maa 🫣🫣🫣',
    album: 'Devi Maa',
    albumEmoji: '🙏',
  },

  // Do Gaye
  {
    id: 'dog1',
    src: '/assets/images/photo_6104686542979797086_y.jpg',
    type: 'image',
    caption: 'Do gaye ek photo me 🫣🫣🫣',
    album: 'Together Captured',
    albumEmoji: '📸',
  },

  // Remaining images
  {
    id: 'r1',
    src: '/assets/images/photo_6104686542979797090_y.jpg',
    type: 'image',
    caption: 'A beautiful memory 💗',
    album: 'More Memories',
    albumEmoji: '💗',
  },
  {
    id: 'r2',
    src: '/assets/images/photo_6104686542979797089_y.jpg',
    type: 'image',
    caption: 'Cherished forever 💝',
    album: 'More Memories',
    albumEmoji: '💗',
  },
  {
    id: 'r3',
    src: '/assets/images/photo_6104686542979797079_y.jpg',
    type: 'image',
    caption: 'Every moment with you 🌷',
    album: 'More Memories',
    albumEmoji: '💗',
  },
];

const ALBUMS = Array.from(new Set(GALLERY.map((m) => m.album)));

function VideoThumbnail({ src, className }: { src: string; className?: string }) {
  const ref = React.useRef<HTMLVideoElement>(null);
  return (
    <video
      ref={ref}
      src={src}
      className={className}
      muted
      playsInline
      preload="metadata"
      onMouseEnter={() => ref.current?.play()}
      onMouseLeave={() => { if (ref.current) { ref.current.pause(); ref.current.currentTime = 0; } }}
    />
  );
}

function LightboxMedia({ item }: { item: MediaItem }) {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (item.type === 'video' && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    };
  }, [item.src, item.type]);

  if (item.type === 'video') {
    return (
      <video
        ref={videoRef}
        key={item.src}
        src={item.src}
        autoPlay
        playsInline
        loop
        className="max-w-full max-h-full object-contain"
        style={{ pointerEvents: 'none' }}
      />
    );
  }
  return (
    <img
      src={item.src}
      alt={item.caption}
      className="max-w-full max-h-full object-contain"
    />
  );
}

export default function PhotoGallery() {
  const [activeAlbum, setActiveAlbum] = React.useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);

  const filtered = activeAlbum === 'All' ? GALLERY : GALLERY.filter((m) => m.album === activeAlbum);

  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex(lightboxIndex === 0 ? filtered.length - 1 : lightboxIndex - 1);
  };

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex(lightboxIndex === filtered.length - 1 ? 0 : lightboxIndex + 1);
  };

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowLeft') setLightboxIndex((i) => (i === null || i === 0 ? filtered.length - 1 : i - 1));
      if (e.key === 'ArrowRight') setLightboxIndex((i) => (i === null ? 0 : i === filtered.length - 1 ? 0 : i + 1));
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex, filtered.length]);

  return (
    <div className="w-full flex flex-col gap-6" id="photo-gallery-section">

      {/* Album filter strip */}
      <div className="flex flex-wrap gap-2 bg-white/50 p-4 rounded-2xl border border-pink-100/65 glass-morphism shadow-sm">
        <button
          onClick={() => setActiveAlbum('All')}
          className={`px-3 py-1.5 text-xs rounded-full font-semibold transition-all cursor-pointer ${
            activeAlbum === 'All'
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-white hover:bg-rose-50 text-rose-800 border border-pink-100'
          }`}
        >
          All Memories
        </button>
        {ALBUMS.map((album) => {
          const item = GALLERY.find((m) => m.album === album);
          return (
            <button
              key={album}
              onClick={() => setActiveAlbum(album)}
              className={`px-3 py-1.5 text-xs rounded-full font-semibold transition-all cursor-pointer ${
                activeAlbum === album
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-white hover:bg-rose-50 text-rose-800 border border-pink-100'
              }`}
            >
              {item?.albumEmoji} {album}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filtered.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => openLightbox(idx)}
            className="group relative aspect-square bg-neutral-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:scale-[1.03] transition-all duration-300 cursor-pointer border border-pink-50"
          >
            {item.type === 'video' ? (
              <>
                <VideoThumbnail
                  src={item.src}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/40 rounded-full p-2.5 group-hover:bg-rose-500/80 transition-colors">
                    <Play className="h-5 w-5 text-white fill-white" />
                  </div>
                </div>
              </>
            ) : (
              <img
                src={item.src}
                alt={item.caption}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}

            {/* Caption overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <p className="text-white text-[10px] font-semibold leading-snug line-clamp-2">{item.caption}</p>
            </div>

            {/* Album badge */}
            <div className="absolute top-2 left-2 bg-white/80 backdrop-blur-sm text-rose-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-pink-100 opacity-0 group-hover:opacity-100 transition-opacity">
              {item.albumEmoji} {item.album}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && filtered[lightboxIndex] && (
        <div
          className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/25 p-2.5 rounded-full text-white transition-colors cursor-pointer z-10"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 p-3 rounded-full text-white transition-colors cursor-pointer z-10"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div
            className="max-w-4xl w-full flex flex-col md:flex-row items-stretch bg-white rounded-3xl overflow-hidden shadow-2xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Media panel */}
            <div className="w-full md:w-2/3 bg-black flex items-center justify-center min-h-[300px] max-h-[70vh] md:max-h-[90vh]">
              <LightboxMedia item={filtered[lightboxIndex]} />
            </div>

            {/* Info panel */}
            <div className="w-full md:w-1/3 p-6 flex flex-col justify-between bg-[#fffcfb]">
              <div className="space-y-3">
                <span className="text-[10px] text-pink-500 font-mono tracking-widest block uppercase border-b border-pink-50 pb-2">
                  {filtered[lightboxIndex].albumEmoji} {filtered[lightboxIndex].album}
                </span>
                <p className="font-cursive text-rose-950 text-xl font-bold italic leading-relaxed">
                  {filtered[lightboxIndex].caption}
                </p>
                <div className="flex items-center gap-1.5 text-rose-400">
                  <Heart className="h-4 w-4 fill-rose-300" />
                  <span className="text-xs font-semibold text-rose-700">Kamlesh ❤️ Sunita</span>
                </div>
              </div>
              <div className="pt-4 border-t border-pink-50">
                <p className="text-[10px] text-gray-400 font-mono">
                  {lightboxIndex + 1} / {filtered.length}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 p-3 rounded-full text-white transition-colors cursor-pointer z-10"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  );
}
