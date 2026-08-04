import { useState, useEffect } from "react";

export type Theme = "rockytree" | "ferrari" | "raycast" | "supabase" | "linear" | "cyberpunk" | "stripe" | "nvidia";

export interface ThemeOption {
  id: Theme;
  name: string;
  badge: string;
  color: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  { id: "rockytree", name: "Executive Emerald", badge: "🌲 Rockytree", color: "#10b981" },
  { id: "ferrari", name: "Rosso Corsa Scuderia", badge: "🏎️ Scuderia", color: "#ef4444" },
  { id: "raycast", name: "Sunset Neon Pro", badge: "⚡ Raycast", color: "#ff6363" },
  { id: "supabase", name: "Studio Emerald Pro", badge: "💎 Supabase", color: "#3ecf8e" },
  { id: "linear", name: "Electric Violet & Blue", badge: "🌌 Linear", color: "#8b5cf6" },
  { id: "cyberpunk", name: "Night City 2077 Cyber", badge: "🤖 Cyberpunk", color: "#ec4899" },
  { id: "stripe", name: "Fintech Aurora Iris", badge: "💳 Stripe", color: "#635bff" },
  { id: "nvidia", name: "Titanium RTX AI", badge: "🎮 NVIDIA", color: "#76b900" },
];

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("rockytree-theme") as Theme | null;
      return saved || "rockytree";
    }
    return "rockytree";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("rockytree-theme", theme);
    }
  }, [theme]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
  };

  return { theme, setTheme, THEME_OPTIONS };
}
