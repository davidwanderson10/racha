import { useEffect, useState } from "react";

const KEY = "racha-theme";

const initialTheme = () => {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch { /* ignora storage indisponível */ }
  return "dark";
};

export const useTheme = () => {
  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(KEY, theme); } catch { /* ignora */ }
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  return [theme, toggle];
};
