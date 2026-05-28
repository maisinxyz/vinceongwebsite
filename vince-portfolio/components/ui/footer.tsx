"use client";

import Link from "next/link";
import { Mail, ArrowUp, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const navigation = {
  categories: [
    {
      id: "sitemap",
      name: "Sitemap",
      sections: [
        {
          id: "pages",
          name: "Pages",
          items: [
            { name: "Home", href: "/" },
            { name: "About", href: "/about" },
            { name: "Projects", href: "/projects" },
            { name: "Experience", href: "/experience" },
          ],
        },
      ],
    },
  ],
};

function handleScrollTop() {
  window.scroll({
    top: 0,
    behavior: "smooth",
  });
}

function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center rounded-full border border-steel/20 border-dotted p-1">
        <button
          onClick={() => setTheme("light")}
          className={`mr-2 rounded-full p-2 transition-colors ${theme !== 'dark' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-silver hover:text-chalk'}`}
        >
          <Sun className="h-4 w-4" strokeWidth={1.5} />
          <span className="sr-only">Light Mode</span>
        </button>
        <button type="button" onClick={handleScrollTop} className="hover:text-chalk text-silver transition-colors px-2">
          <ArrowUp className="h-4 w-4" strokeWidth={1.5} />
          <span className="sr-only">Scroll to Top</span>
        </button>
        <button
          onClick={() => setTheme("dark")}
          className={`ml-2 rounded-full p-2 transition-colors ${theme === 'dark' ? 'bg-white text-black dark:bg-white dark:text-black' : 'text-silver hover:text-chalk'}`}
        >
          <Moon className="h-4 w-4" strokeWidth={1.5} />
          <span className="sr-only">Dark Mode</span>
        </button>
      </div>
    </div>
  );
}

const Underline = `hover:-translate-y-1 border border-steel/20 border-dotted rounded-xl p-2.5 transition-transform text-silver hover:text-chalk hover:border-steel/40 flex items-center justify-center`;

const GithubIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedinIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="border-steel/15 mx-auto w-full border-t px-2 mt-24">
      <div className="relative mx-auto grid max-w-7xl items-start justify-between gap-6 p-10 pb-0 md:flex">
        <div className="max-w-md">
          <Link href="/">
            <h2 className="font-[family-name:var(--font-syne-family)] font-bold text-chalk text-2xl tracking-tight mb-4">
              Vince Ong
            </h2>
          </Link>
          <p className="bg-transparent text-center text-xs leading-[1.8] text-silver/60 md:text-left font-[family-name:var(--font-ibm-plex-mono-family)]">
            Mechatronic Systems Engineering student at Simon Fraser University based in Vancouver, B.C. 
            I specialize in bridging hardware and software—from custom PCB design and embedded firmware to deploying full-stack SaaS platforms.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="border-b border-steel/15 border-dotted"></div>
        <div className="py-10">
          {navigation.categories.map((category) => (
            <div
              key={category.name}
              className="grid grid-cols-1 flex-row justify-between gap-6 leading-6 md:flex font-[family-name:var(--font-ibm-plex-mono-family)]"
            >
              {category.sections.map((section) => (
                <div key={section.name}>
                  <ul
                    role="list"
                    className="flex flex-col space-y-4"
                  >
                    {section.items.map((item) => (
                      <li key={item.name} className="flow-root">
                        <Link
                          href={item.href}
                          className="text-sm text-silver/60 hover:text-chalk transition-colors"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="border-b border-steel/15 border-dotted"></div>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-y-6 max-w-7xl mx-auto px-6 mt-6">
        <div className="flex flex-wrap items-center gap-6 gap-y-4">
          <a
            aria-label="Email"
            href="mailto:vinceong2020@gmail.com"
            rel="noreferrer"
            target="_blank"
            className={Underline}
          >
            <Mail strokeWidth={1.5} className="h-5 w-5" />
          </a>
          <a
            aria-label="GitHub"
            href="https://github.com/maisinxyz"
            rel="noreferrer"
            target="_blank"
            className={Underline}
          >
            <GithubIcon className="h-5 w-5" />
          </a>
          <a
            aria-label="LinkedIn"
            href="https://linkedin.com/in/vinceong"
            rel="noreferrer"
            target="_blank"
            className={Underline}
          >
            <LinkedinIcon className="h-5 w-5" />
          </a>
        </div>
        <ThemeToggle />
      </div>

      <div className="mx-auto mb-10 mt-10 flex flex-col justify-between text-center text-[10px] md:max-w-7xl font-[family-name:var(--font-space-mono-family)] tracking-[0.1em]">
        <div className="flex flex-row items-center justify-center gap-1 text-silver/40">
          <span>VINCE ONG</span>
          <span> © </span>
          <span>{new Date().getFullYear()}</span>
          <span className="mx-2">•</span>
          <span>BUILT WITH PRECISION</span>
        </div>
      </div>
    </footer>
  );
}
