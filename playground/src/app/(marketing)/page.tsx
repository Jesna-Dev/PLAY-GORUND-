"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import "./landing.css";

/* ──────────────────────────────────────
   DATA
   ────────────────────────────────────── */
const FEATURES = [
  {
    icon: "⚡",
    iconClass: "feature-icon-purple",
    title: "Lightning Fast",
    description:
      "Built on Next.js with Turbopack for instant hot-reload and blazing fast builds.",
  },
  {
    icon: "🎨",
    iconClass: "feature-icon-pink",
    title: "Beautiful UI",
    description:
      "Tailwind CSS v4 with a curated design system — glassmorphism, gradients, and micro-animations.",
  },
  {
    icon: "🧩",
    iconClass: "feature-icon-green",
    title: "Modular Architecture",
    description:
      "Component-driven structure that scales from weekend hack to production-grade app.",
  },
  {
    icon: "🔒",
    iconClass: "feature-icon-teal",
    title: "Type-Safe",
    description:
      "End-to-end TypeScript with strict mode enabled for bulletproof developer experience.",
  },
];

const STATS = [
  { value: "< 50ms", label: "Build Time" },
  { value: "100%", label: "Type-Safe" },
  { value: "A+", label: "Lighthouse" },
  { value: "0", label: "Runtime Deps" },
];

const NAV_LINKS = ["Features", "Workspace", "Stats"];

/* ──────────────────────────────────────
   PAGE COMPONENT
   ────────────────────────────────────── */
export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="landing">
      {/* ── Background layers ── */}
      <div className="gradient-bg" aria-hidden="true" />
      <div className="grid-overlay" aria-hidden="true" />

      {/* ── Floating orbs ── */}
      <div className="orb orb-1" aria-hidden="true" />
      <div className="orb orb-2" aria-hidden="true" />
      <div className="orb orb-3" aria-hidden="true" />

      {/* ═══════════════════════ NAV ═══════════════════════ */}
      <nav
        id="navbar"
        className={`navbar transition-all duration-300 ${
          scrolled ? "py-3 shadow-lg" : "py-5"
        }`}
      >
        <a href="#" className="flex items-center gap-2.5">
          <span className="text-xl">🎮</span>
          <span className="text-lg font-bold tracking-tight gradient-text">
            Playground
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-sm text-zinc-400 hover:text-white transition-colors duration-200"
            >
              {link}
            </a>
          ))}
          <Link href="/dashboard" className="glow-btn text-sm !py-2 !px-5 !rounded-xl">
            Get Started
          </Link>
        </div>
      </nav>

      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section
        id="hero"
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center pt-24"
      >
        {/* badge */}
        <div className="badge animate-fade-in-up opacity-0 delay-100 mb-8">
          <span className="pulse-dot" />
          Now in Beta
        </div>

        {/* headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight tracking-tight max-w-4xl animate-fade-in-up opacity-0 delay-200">
          Build. Experiment.{" "}
          <span className="gradient-text-accent">Create.</span>
        </h1>

        {/* sub */}
        <p className="mt-6 text-lg sm:text-xl text-zinc-400 max-w-2xl leading-relaxed animate-fade-in-up opacity-0 delay-300">
          Playground is your creative sandbox — a modern developer workspace
          where ideas transform into beautiful, production-ready applications in
          record time.
        </p>

        {/* CTA row */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up opacity-0 delay-400">
          <a href="#features" className="glow-btn">
            Explore Features
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a href="#workspace" className="glow-btn-outline">
            View Workspace
          </a>
        </div>

        {/* scroll indicator */}
        <div className="absolute bottom-10 flex flex-col items-center gap-2 text-zinc-500 text-xs animate-fade-in opacity-0 delay-800">
          <span>Scroll to explore</span>
          <svg
            className="w-4 h-4 animate-bounce"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════ FEATURES ═══════════════════════ */}
      <section
        id="features"
        className="relative z-10 py-32 px-6"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge mb-4 inline-flex">✨ Features</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight gradient-text mt-4">
              Everything you need
            </h2>
            <p className="mt-4 text-zinc-400 max-w-lg mx-auto">
              A carefully crafted toolkit so you can focus on what matters — building great things.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`glass-card p-8 flex items-start gap-5 animate-fade-in-up opacity-0 delay-${
                  (i + 2) * 100
                }`}
              >
                <div className={`feature-icon ${f.iconClass}`}>{f.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {f.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ WORKSPACE PREVIEW ═══════════════════════ */}
      <section id="workspace" className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="badge mb-4 inline-flex">💻 Workspace</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight gradient-text mt-4">
              Your code, elevated
            </h2>
          </div>

          <div className="glass-card overflow-hidden">
            {/* title bar */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-4 text-xs text-zinc-500 font-mono">
                page.tsx — Playground
              </span>
            </div>

            {/* code */}
            <div className="code-block !rounded-none !border-0 !m-0">
              <pre>
                <code>
                  <span className="comment">{"// Welcome to Playground 🎮"}</span>
                  {"\n"}
                  <span className="keyword">{"export default"}</span>
                  {" "}
                  <span className="keyword">{"function"}</span>
                  {" "}
                  <span className="function">{"Home"}</span>
                  {"() {"}
                  {"\n"}
                  {"  "}
                  <span className="keyword">{"return"}</span>
                  {" ("}
                  {"\n"}
                  {"    "}
                  <span className="variable">{"<main>"}</span>
                  {"\n"}
                  {"      "}
                  <span className="variable">{"<h1>"}</span>
                  <span className="string">{"Build something amazing"}</span>
                  <span className="variable">{"</h1>"}</span>
                  {"\n"}
                  {"      "}
                  <span className="variable">{"<p>"}</span>
                  <span className="string">{"Start experimenting now ✨"}</span>
                  <span className="variable">{"</p>"}</span>
                  {"\n"}
                  {"    "}
                  <span className="variable">{"</main>"}</span>
                  {"\n"}
                  {"  );\n}"}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ STATS ═══════════════════════ */}
      <section id="stats" className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="glass-card grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col items-center py-10 px-4">
                <span className="stat-number">{s.value}</span>
                <span className="mt-2 text-sm text-zinc-400">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ CTA ═══════════════════════ */}
      <section id="cta" className="relative z-10 py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight gradient-text">
            Ready to start building?
          </h2>
          <p className="mt-5 text-zinc-400 text-lg max-w-xl mx-auto leading-relaxed">
            Jump into the Playground and turn your next idea into reality. No setup friction, just pure creativity.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <button className="glow-btn text-base !py-3.5 !px-8">
              🚀&nbsp; Launch Playground
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="glow-btn-outline text-base !py-3.5 !px-8"
            >
              ⭐&nbsp; Star on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ FOOTER ═══════════════════════ */}
      <footer className="relative z-10 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎮</span>
            <span className="font-semibold text-sm gradient-text">
              Playground
            </span>
          </div>
          <p className="text-xs text-zinc-500">
            &copy; Playground. Crafted with Next.js
            &amp; Tailwind CSS v4.
          </p>
          <div className="flex gap-5 text-zinc-500">
            <a href="#" className="hover:text-white transition-colors text-sm">
              Docs
            </a>
            <a href="#" className="hover:text-white transition-colors text-sm">
              Blog
            </a>
            <a href="#" className="hover:text-white transition-colors text-sm">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
