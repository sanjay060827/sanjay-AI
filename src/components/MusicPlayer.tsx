import { useEffect, useRef } from "react";

export const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    const startMusic = () => {
      if (hasStarted.current || !audioRef.current) return;
      
      const musicMuted = localStorage.getItem("musicMuted") === "true";
      if (!musicMuted) {
        audioRef.current.play().catch(err => {
          console.log("Music autoplay prevented:", err);
        });
      }
      hasStarted.current = true;
      
      // Remove listener after first interaction
      document.removeEventListener("click", startMusic);
      document.removeEventListener("keydown", startMusic);
    };

    // Start music on first user interaction
    document.addEventListener("click", startMusic);
    document.addEventListener("keydown", startMusic);

    return () => {
      document.removeEventListener("click", startMusic);
      document.removeEventListener("keydown", startMusic);
    };
  }, []);

  return (
    <audio
      id="backgroundMusic"
      ref={audioRef}
      loop
      preload="auto"
    >
      <source src="https://assets.mixkit.co/music/preview/mixkit-coffee-shop-relaxing-guitar-112.mp3" type="audio/mpeg" />
    </audio>
  );
};
