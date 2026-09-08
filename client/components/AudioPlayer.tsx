"use client";

import { useEffect, useRef, useState } from "react";

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMinimized, setIsMinimized] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;

    // Attempt auto-start on mount
    const startPlayback = () => {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setAutoplayBlocked(false);
          })
          .catch(() => {
            // Autoplay blocked by browser policy; wait for first interaction
            setAutoplayBlocked(true);
            setIsPlaying(false);

            const handleFirstInteraction = () => {
              if (audioRef.current) {
                audioRef.current
                  .play()
                  .then(() => {
                    setIsPlaying(true);
                    setAutoplayBlocked(false);
                  })
                  .catch(() => {});
              }
              cleanupListeners();
            };

            const cleanupListeners = () => {
              window.removeEventListener("pointerdown", handleFirstInteraction);
              window.removeEventListener("click", handleFirstInteraction);
              window.removeEventListener("keydown", handleFirstInteraction);
              window.removeEventListener("touchstart", handleFirstInteraction);
            };

            window.addEventListener("pointerdown", handleFirstInteraction, { once: true });
            window.addEventListener("click", handleFirstInteraction, { once: true });
            window.addEventListener("keydown", handleFirstInteraction, { once: true });
            window.addEventListener("touchstart", handleFirstInteraction, { once: true });
          });
      }
    };

    startPlayback();

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setAutoplayBlocked(false);
        })
        .catch((e) => {
          console.error("Playback failed:", e);
        });
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextMuted = !isMuted;
    audio.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      if (val === 0) {
        audioRef.current.muted = true;
        setIsMuted(true);
      } else if (isMuted) {
        audioRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/images/on-my-way.mp3"
        loop
        preload="auto"
      >
        <source src="/images/on-my-way.mp3" type="audio/mpeg" />
        <source src="/images/On%20My%20Way%20(PenduJatt.dev).mp3" type="audio/mpeg" />
      </audio>

      {/* Floating Audio Widget */}
      <div
        className="fixed bottom-5 right-5 z-50 transition-all duration-300 ease-out select-none"
        style={{ maxWidth: "calc(100vw - 2.5rem)" }}
      >
        {isMinimized ? (
          <button
            onClick={() => setIsMinimized(false)}
            aria-label="Expand Music Player"
            className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-slate-900/90 text-white shadow-xl border border-slate-700/80 backdrop-blur-md hover:bg-slate-800 hover:scale-105 transition-all cursor-pointer"
          >
            {isPlaying ? (
              <span className="relative flex h-5 w-5 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
                <span className="relative text-sm">🎵</span>
              </span>
            ) : (
              <span className="text-sm">🔇</span>
            )}
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isPlaying ? "bg-emerald-400" : "bg-amber-400"
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-3 w-3 ${
                  isPlaying ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
            </span>
          </button>
        ) : (
          <div className="relative overflow-hidden rounded-2xl bg-slate-900/95 text-white shadow-2xl border border-slate-700/80 backdrop-blur-md p-3 sm:p-3.5 min-w-[280px] sm:min-w-[320px]">
            {/* Ambient background glow */}
            <div
              className={`absolute -top-12 -left-12 w-32 h-32 rounded-full blur-2xl pointer-events-none transition-opacity duration-700 ${
                isPlaying ? "bg-blue-500/20 opacity-100" : "bg-gray-500/10 opacity-30"
              }`}
            />

            {/* Top row: Track info & buttons */}
            <div className="flex items-center justify-between gap-3 relative z-10">
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Vinyl / Cover icon with spinning animation when playing */}
                <button
                  onClick={togglePlay}
                  className={`relative flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm shadow-inner transition-transform cursor-pointer ${
                    isPlaying
                      ? "bg-gradient-to-tr from-blue-600 to-indigo-500 ring-2 ring-blue-400/40"
                      : "bg-slate-800 ring-1 ring-slate-700"
                  }`}
                  aria-label={isPlaying ? "Pause music" : "Play music"}
                >
                  <span className={isPlaying ? "animate-spin" : ""} style={{ animationDuration: "3s" }}>
                    💿
                  </span>
                </button>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-semibold truncate text-slate-100">
                      On My Way
                    </h4>
                    {isPlaying && (
                      <div className="flex items-end gap-[2px] h-3 px-1">
                        <span className="w-[2px] h-2.5 bg-emerald-400 rounded-full animate-pulse" />
                        <span
                          className="w-[2px] h-3 bg-emerald-400 rounded-full animate-pulse"
                          style={{ animationDelay: "150ms" }}
                        />
                        <span
                          className="w-[2px] h-1.5 bg-emerald-400 rounded-full animate-pulse"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">
                    {autoplayBlocked
                      ? "Tap anywhere to play"
                      : isPlaying
                      ? "Playing auto-started"
                      : "Music paused"}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {/* Play / Pause */}
                <button
                  onClick={togglePlay}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                  title={isPlaying ? "Pause" : "Play"}
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? "⏸" : "▶"}
                </button>

                {/* Mute */}
                <button
                  onClick={toggleMute}
                  className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition cursor-pointer"
                  title={isMuted ? "Unmute" : "Mute"}
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted || volume === 0 ? "🔇" : "🔊"}
                </button>

                {/* Minimize */}
                <button
                  onClick={() => setIsMinimized(true)}
                  className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs transition cursor-pointer"
                  title="Minimize player"
                  aria-label="Minimize player"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Bottom row: Progress & Volume Slider */}
            <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-3 text-[10px] text-slate-400 relative z-10">
              <div className="flex-1 flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-400">Vol</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 sm:w-24 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  aria-label="Volume slider"
                />
              </div>

              {autoplayBlocked && (
                <button
                  onClick={togglePlay}
                  className="text-[10px] font-medium text-emerald-400 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>▶ Click to start</span>
                </button>
              )}

              <span className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">
                Fleet BGM
              </span>
            </div>

            {/* Subtle bottom progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-800">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
