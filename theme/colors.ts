export const COLORS = {
  light: {
    primary: "#2563EB",
    secondary: "#06B6D4",
    background: "#F8FAFC",
    surface: "#FFFFFF",
    text: "#0F172A",
    textSecondary: "#475569",
    border: "#E2E8F0",
    error: "#DC2626",
    success: "#16A34A",
    warning: "#EA580C",
  },
  dark: {
    primary: "#0A84FF",
    secondary: "#30B0C5",
    background: "#000000",
    surface: "#1C1C1E",
    text: "#FFFFFF",
    textSecondary: "#999999",
    border: "#3A3A3C",
    error: "#FF453A",
    success: "#32D74B",
    warning: "#FF9500",
  },
};

export type ThemeType = "light" | "dark";
export type ColorKey = keyof typeof COLORS.light;
