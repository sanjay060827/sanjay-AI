import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Moon, Sun, Music, VolumeX, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";

export const Navbar = () => {
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Check dark mode
    const dark = localStorage.getItem("darkMode") === "true";
    setIsDark(dark);
    if (dark) {
      document.documentElement.classList.add("dark");
    }

    // Check music state
    const musicMuted = localStorage.getItem("musicMuted") === "true";
    setIsMusicPlaying(!musicMuted);

    // Update cart count
    const updateCartCount = () => {
      const cart = JSON.parse(sessionStorage.getItem("cartArray") || "[]");
      setCartCount(cart.reduce((sum: number, item: any) => sum + item.qty, 0));
    };
    updateCartCount();

    // Listen for cart changes
    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  const toggleDarkMode = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem("darkMode", String(newDark));
    document.documentElement.classList.toggle("dark");
  };

  const toggleMusic = () => {
    const audio = document.getElementById("backgroundMusic") as HTMLAudioElement;
    if (audio) {
      if (isMusicPlaying) {
        audio.pause();
        localStorage.setItem("musicMuted", "true");
      } else {
        audio.play();
        localStorage.setItem("musicMuted", "false");
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl">🍴</span>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            MEC Canteen
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-1">
          <Link to="/">
            <Button variant={isActive("/") ? "default" : "ghost"} size="sm">
              Home
            </Button>
          </Link>
          <Link to="/menu">
            <Button variant={isActive("/menu") ? "default" : "ghost"} size="sm">
              Menu
            </Button>
          </Link>
          <Link to="/offers">
            <Button variant={isActive("/offers") ? "default" : "ghost"} size="sm">
              Offers
            </Button>
          </Link>
          <Link to="/student">
            <Button variant={isActive("/student") ? "default" : "ghost"} size="sm">
              Student
            </Button>
          </Link>
          <Link to="/complaints">
            <Button variant={isActive("/complaints") ? "default" : "ghost"} size="sm">
              Complaints
            </Button>
          </Link>
          <Link to="/about">
            <Button variant={isActive("/about") ? "default" : "ghost"} size="sm">
              About
            </Button>
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          <Link to="/chatbot">
            <Button variant="ghost" size="icon" title="AI Assistant">
              <MessageSquare className="h-5 w-5" />
            </Button>
          </Link>

          <Button variant="ghost" size="icon" onClick={toggleMusic} title="Toggle Music">
            {isMusicPlaying ? <Music className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </Button>

          <Button variant="ghost" size="icon" onClick={toggleDarkMode} title="Toggle Theme">
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs font-bold text-primary-foreground flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};
