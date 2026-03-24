import { useState, useEffect } from "react";

export function useTypewriter(text: string, isActive: boolean, speed = 40): string {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!isActive) return;
    setDisplayed("");
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [isActive, text, speed]);

  return displayed;
}
