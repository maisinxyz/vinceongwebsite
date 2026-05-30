"use client";

import { useEffect } from "react";

export default function AsciiEasterEgg() {
  useEffect(() => {
    // Only run this once in the browser
    if (typeof window !== "undefined") {
      const asciiArt = [
        "  __     __ _____  _   _  _____  ______ ",
        "  \\ \\   / /|_   _|| \\ | |/ ____||  ____|",
        "   \\ \\_/ /   | |  |  \\| | |     | |__   ",
        "    \\   /    | |  | . ` | |     |  __|  ",
        "     | |    _| |_ | |\\  | |____ | |____ ",
        "     |_|   |_____||_| \\_|\\_____||______|",
        "",
        "   PORTFOLIO /// MECHATRONICS /// SYSTEMS",
        "   Welcome to the source code."
      ].join("\\n");
      
      console.log(
        "%c" + asciiArt,
        "color: #D4AF37; font-family: monospace; font-size: 14px; font-weight: bold;"
      );
    }
  }, []);

  return null; // This component doesn't render any visible UI
}
