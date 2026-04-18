import { Link } from "react-router-dom";
import { useEffect, useRef, useCallback, useState } from "react";
import { LogoMark } from "../brand/Logo";
import { BLOG_POSTS } from "./blog/blogData";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../components/Accordion";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

// ─── Custom accordion icons ─────────────────────────────────────────────────

function FaqIconCollapsed() {
  return (
    <div className="w-7 h-7 rounded-full bg-white/[0.06] border border-white/[0.1] flex items-center justify-center transition-all duration-300 group-hover:border-blue-500/30 group-hover:bg-blue-500/[0.08]">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-white/50 transition-colors duration-300 group-hover:text-blue-400"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  );
}

function FaqIconExpanded() {
  return (
    <div className="w-7 h-7 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-blue-400"
      >
        <path d="m18 15-6-6-6 6" />
      </svg>
    </div>
  );
}

// ─── FAQ preview data (subset for home page) ─────────────────────────────────

const HOME_FAQS = [
  {
    question: "Is Chumlab UI free to use?",
    answer:
      "Yes. Chumlab UI is MIT licensed and completely free for personal and commercial use. There are no premium tiers or paywalled components.",
  },
  {
    question: "Does it work with Next.js?",
    answer:
      'Absolutely. All components are compatible with Next.js App Router and Pages Router. Use the "use client" directive for interactive components. Every component includes SSR safe guards.',
  },
  {
    question: "How do I customize component styles?",
    answer:
      "Every component accepts a classes prop that lets you override styles on any internal element. You can also use the unstyled prop to strip all defaults and build from scratch with your own design tokens.",
  },
  {
    question: "Is Chumlab UI accessible?",
    answer:
      "Every component ships with WCAG 2.1 AA compliance, full keyboard navigation, focus trapping for modals and drawers, screen reader announcements, and prefers-reduced-motion support.",
  },
  {
    question: "What components are included?",
    answer:
      "Chumlab UI includes a comprehensive set of production-grade components covering forms, selection, navigation, overlays, data display, and layout. Think Button, Input, Modal, Drawer, Table, DatePicker, and more.",
  },
];

// ─── Typing animation component ────────────────────────────────────────────

const phrases = ["in half the time", "users remember", "teams dream of"];

function TypingHeadline() {
  const [display, setDisplay] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);

  useEffect(() => {
    const phrase = phrases[phraseIdx];
    let charIdx = 0;
    let deleting = false;
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (!deleting) {
        charIdx++;
        setDisplay(phrase.slice(0, charIdx));
        if (charIdx === phrase.length) {
          timeout = setTimeout(() => {
            deleting = true;
            tick();
          }, 1500);
          return;
        }
        timeout = setTimeout(tick, 60 + Math.random() * 40);
      } else {
        charIdx--;
        setDisplay(phrase.slice(0, charIdx));
        if (charIdx === 0) {
          deleting = false;
          setPhraseIdx((prev) => (prev + 1) % phrases.length);
          return;
        }
        timeout = setTimeout(tick, 30 + Math.random() * 20);
      }
    };

    timeout = setTimeout(tick, phraseIdx === 0 ? 600 : 200);
    return () => clearTimeout(timeout);
  }, [phraseIdx]);

  return (
    <span className="animate-shimmer bg-[linear-gradient(110deg,#60a5fa_0%,#38bdf8_20%,#818cf8_40%,#6366f1_60%,#38bdf8_80%,#60a5fa_100%)] bg-clip-text text-transparent">
      {display}
      <span className="inline-block w-[3px] sm:w-[4px] h-[0.85em] bg-blue-400 ml-1 align-middle animate-pulse rounded-full" />
    </span>
  );
}

// ─── Why Chumlab features ───────────────────────────────────────────────────

const features = [
  {
    title: "Accessibility built in, not bolted on",
    desc: "Full keyboard navigation, screen reader announcements, focus trapping, and WCAG 2.1 AA compliance across every component. Pass audits without a single retrofit.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
          clipRule="evenodd"
        />
      </svg>
    ),
    color: "text-emerald-400",
    bg: "bg-emerald-500/[0.08]",
    border: "border-emerald-500/20",
  },
  {
    title: "Fully themeable, zero lock in",
    desc: "Override any element with className props. Go fully unstyled. Use CSS variables for theming. Your design system stays yours we just handle the hard parts.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm4.75 11.25a.75.75 0 001.5 0v-2.546l.943.942a.75.75 0 001.06-1.06l-2.22-2.22a.75.75 0 00-1.06 0l-2.22 2.22a.75.75 0 001.06 1.06l.937-.938v2.542z"
          clipRule="evenodd"
        />
      </svg>
    ),
    color: "text-blue-400",
    bg: "bg-blue-500/[0.08]",
    border: "border-blue-500/20",
  },
  {
    title: "Battle tested for production",
    desc: "Controlled and uncontrolled modes that actually work together. SSR safe rendering, proper ref forwarding, TypeScript strict types, and edge case handling so you ship with confidence.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 20 20" fill="currentColor">
        <path d="M11.983 1.907a.75.75 0 00-1.292-.657l-8.5 9.5A.75.75 0 002.75 12h6.572l-1.305 6.093a.75.75 0 001.292.657l8.5-9.5A.75.75 0 0017.25 8h-6.572l1.305-6.093z" />
      </svg>
    ),
    color: "text-amber-400",
    bg: "bg-amber-500/[0.08]",
    border: "border-amber-500/20",
  },
];

// ─── Space scene ────────────────────────────────────────────────────────────

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  a: number;
  ts: number;
  to: number;
  hue: number;
}
interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

function useSpaceScene(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const mouse = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 });
  const onMove = useCallback((e: MouseEvent) => {
    mouse.current.tx = e.clientX / window.innerWidth;
    mouse.current.ty = e.clientY / window.innerHeight;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const stars: Star[] = Array.from({ length: 600 }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: Math.random(),
      size: 0.3 + Math.random() * 2.5,
      a: 0.08 + Math.random() * 0.8,
      ts: 0.2 + Math.random() * 3,
      to: Math.random() * 6.28,
      hue:
        [210, 240, 270, 300, 330, 200][Math.floor(Math.random() * 6)] +
        Math.random() * 30,
    }));

    const shootingStars: ShootingStar[] = [];
    let ssFromLeft = true;
    let ssWaiting = true;
    let ssGapTimer = 60;
    const sat = { angle: 0 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    let raf: number;

    const draw = (time: number) => {
      const w = canvas.width,
        h = canvas.height,
        t = time * 0.001;
      ctx.clearRect(0, 0, w, h);
      const m = mouse.current;
      m.x += (m.tx - m.x) * 0.04;
      m.y += (m.ty - m.y) * 0.04;
      const mx = (m.x - 0.5) * 2,
        my = (m.y - 0.5) * 2;

      for (const s of stars) {
        const px = s.x * w + mx * s.z * 45,
          py = s.y * h + my * s.z * 45;
        const tw = Math.sin(t * s.ts + s.to),
          al = s.a * (0.35 + 0.65 * tw);
        const sz = s.size * (0.35 + s.z * 0.85);
        ctx.beginPath();
        ctx.arc(px, py, sz, 0, 6.28);
        ctx.fillStyle = `hsla(${s.hue},${25 + al * 75}%,${60 + al * 40}%,${al})`;
        ctx.fill();
        if (s.z > 0.88 && al > 0.55) {
          const sp = sz * 7;
          ctx.globalAlpha = al * 0.12;
          ctx.strokeStyle = `hsl(${s.hue},60%,80%)`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(px - sp, py);
          ctx.lineTo(px + sp, py);
          ctx.moveTo(px, py - sp);
          ctx.lineTo(px, py + sp);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }

      sat.angle += 0.003;
      const satCX = w * 0.8,
        satCY = h * 0.18;
      const satX = satCX + Math.cos(sat.angle) * w * 0.12 + mx * 30;
      const satY = satCY + Math.sin(sat.angle) * h * 0.06 + my * 20;
      const satSc = 0.85 + Math.sin(sat.angle) * 0.15,
        S = 8;
      ctx.save();
      ctx.translate(satX, satY);
      ctx.scale(satSc, satSc);
      ctx.rotate(sat.angle * 0.2 + Math.sin(t * 0.4) * 0.15);
      ctx.fillStyle = "rgba(35,55,140,0.7)";
      ctx.fillRect(-S * 6.5, -S * 0.6, S * 4.5, S * 1.2);
      ctx.fillRect(S * 2, -S * 0.6, S * 4.5, S * 1.2);
      ctx.strokeStyle = "rgba(70,100,200,0.5)";
      ctx.lineWidth = 0.5;
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.moveTo(-S * 6.5 + i * S * 1.125, -S * 0.6);
        ctx.lineTo(-S * 6.5 + i * S * 1.125, S * 0.6);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(S * 2 + i * S * 1.125, -S * 0.6);
        ctx.lineTo(S * 2 + i * S * 1.125, S * 0.6);
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(190,200,220,0.85)";
      ctx.fillRect(-S * 1.5, -S, S * 3, S * 2);
      ctx.strokeStyle = "rgba(220,225,240,0.4)";
      ctx.lineWidth = 0.8;
      ctx.strokeRect(-S * 1.5, -S, S * 3, S * 2);
      ctx.fillStyle = "rgba(200,210,230,0.6)";
      ctx.beginPath();
      ctx.arc(S * 0.3, -S, S * 0.7, Math.PI, 0);
      ctx.fill();
      ctx.strokeStyle = "rgba(210,215,230,0.7)";
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(0, -S);
      ctx.lineTo(0, -S * 3);
      ctx.stroke();
      ctx.restore();
      if (Math.sin(t * 2.5) > 0.6) {
        ctx.beginPath();
        ctx.arc(satX, satY - S * 3 * satSc, 3, 0, 6.28);
        ctx.fillStyle = "rgba(255,50,50,0.95)";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(satX, satY - S * 3 * satSc, 10, 0, 6.28);
        ctx.fillStyle = "rgba(255,50,50,0.12)";
        ctx.fill();
      }

      // Spawn next shooting star only after the previous one is gone
      if (ssWaiting) {
        ssGapTimer--;
        if (ssGapTimer <= 0) {
          const speed = 8 + Math.random() * 6;
          if (ssFromLeft) {
            const angle = 0.15 + Math.random() * 0.35;
            shootingStars.push({
              x: -20 + Math.random() * w * 0.2,
              y: -20 + Math.random() * h * 0.1,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              life: 0,
              maxLife: 999,
              size: 2 + Math.random() * 1.5,
            });
          } else {
            const angle = Math.PI - 0.15 - Math.random() * 0.35;
            shootingStars.push({
              x: w + 20 - Math.random() * w * 0.2,
              y: -20 + Math.random() * h * 0.1,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              life: 0,
              maxLife: 999,
              size: 2 + Math.random() * 1.5,
            });
          }
          ssFromLeft = !ssFromLeft;
          ssWaiting = false;
        }
      }
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life++;
        const offScreen =
          s.x > w + 200 || s.y > h + 100 || s.x < -200 || s.y < -100;
        if (offScreen) {
          shootingStars.splice(i, 1);
          ssWaiting = true;
          ssGapTimer = 60;
          continue;
        }
        const fadeIn = Math.min(1, s.life / 15);
        const fadeOutR = s.x > w - 150 ? Math.max(0, (w + 100 - s.x) / 250) : 1;
        const fadeOutL =
          s.x < 150 && s.vx < 0 ? Math.max(0, (s.x + 200) / 350) : 1;
        const fadeOut = Math.min(fadeOutR, fadeOutL);
        const fade = fadeIn * fadeOut;
        const trailLen = 120 + s.size * 25;
        const norm = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
        const tx = s.x - (s.vx / norm) * trailLen * fade;
        const ty = s.y - (s.vy / norm) * trailLen * fade;
        const sg = ctx.createLinearGradient(tx, ty, s.x, s.y);
        sg.addColorStop(0, "transparent");
        sg.addColorStop(0.4, `rgba(180,200,255,${0.25 * fade})`);
        sg.addColorStop(1, `rgba(255,255,255,${0.85 * fade})`);
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = sg;
        ctx.lineWidth = s.size;
        ctx.lineCap = "round";
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 1.5 * fade, 0, 6.28);
        ctx.fillStyle = `rgba(255,255,255,${0.9 * fade})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, [canvasRef, onMove]);
}

// ─── Page ───────────────────────────────────────────────────────────────────

const Home = () => {
  useDocumentTitle("Accessible React Components for Modern Teams");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useSpaceScene(canvasRef);

  const [menuOpen, setMenuOpen] = useState(false);

  const [randomBlogs] = useState(() => {
    const shuffled = [...BLOG_POSTS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  });

  return (
    <div className="min-h-screen bg-[#04040a] text-white overflow-hidden selection:bg-indigo-500/30">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full z-0"
        style={{ pointerEvents: "all" }}
        aria-hidden="true"
      />

      {/* CSS nebula layers */}
      <div
        className="fixed inset-0 pointer-events-none z-1 overflow-hidden"
        aria-hidden="true"
      >
        <div className="animate-nebula-pulse absolute top-[12%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse,rgba(168,85,247,0.12)_0%,rgba(99,102,241,0.05)_35%,transparent_65%)] blur-[50px]" />
        <div className="absolute top-[28%] left-1/2 w-0 h-0">
          <div className="animate-orbit-1 absolute w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.10)_0%,transparent_65%)] blur-[70px]" />
          <div className="animate-orbit-2 absolute w-[550px] h-[550px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.08)_0%,transparent_65%)] blur-[70px]" />
          <div className="animate-orbit-3 absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(96,165,250,0.06)_0%,transparent_65%)] blur-[70px]" />
        </div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-[0.025]">
          <div className="animate-beam absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[linear-gradient(90deg,transparent_40%,rgba(255,255,255,0.15)_50%,transparent_60%)]" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_55%_40%,transparent_0%,rgba(4,4,10,0.3)_60%,rgba(4,4,10,0.6)_80%,#04040a_100%)]" />
        <div className="absolute bottom-0 left-[25%] right-0 h-[20%] bg-linear-to-t from-[#04040a]/40 to-transparent" />
      </div>

      {/* Sun */}
      <div
        className="fixed bottom-0 left-0 pointer-events-none z-2 opacity-50"
        aria-hidden="true"
        style={{ width: "45vw", height: "45vh" }}
      >
        <div className="absolute -bottom-[35%] -left-[18%] w-[70vmin] h-[70vmin] rounded-full bg-[radial-gradient(circle,rgba(255,170,60,0.035)_0%,rgba(255,130,30,0.01)_40%,transparent_65%)]" />
        <div className="absolute -bottom-[25%] -left-[12%] w-[40vmin] h-[40vmin] rounded-full bg-[radial-gradient(circle,rgba(255,190,90,0.05)_0%,rgba(255,140,40,0.015)_50%,transparent_75%)]" />
        <div className="absolute -bottom-[20%] -left-[8%] w-[28vmin] h-[28vmin] rounded-full bg-[radial-gradient(circle,rgba(255,210,130,0.07)_0%,rgba(255,160,50,0.02)_50%,transparent_75%)]" />
        <div className="absolute -bottom-[16%] -left-[5%] w-[18vmin] h-[18vmin] rounded-full bg-[radial-gradient(circle,rgba(255,240,210,0.18)_0%,rgba(255,200,110,0.08)_30%,rgba(255,160,45,0.03)_60%,transparent_85%)]" />
      </div>

      {/* ═══ CONTENT ═══ */}
      <div className="relative z-10 pointer-events-none">
        {/* ── HEADER ── */}
        <header className="pointer-events-auto fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#04040a]/60">
          <div className="w-full px-5 sm:px-8">
            <div className="flex items-center justify-between py-3.5">
              <Link to="/" className="flex items-center gap-3">
                <LogoMark size={160} />
              </Link>
              <div className="flex items-center gap-1">
                <div className="hidden sm:flex items-center gap-1">
                  <Link
                    to="/accordion"
                    className="text-[13px] font-medium text-white/90 hover:text-white transition-colors duration-300 px-3.5 py-1.5 rounded-lg hover:bg-white/6"
                  >
                    Components
                  </Link>
                  <Link
                    to="/blog"
                    className="text-[13px] font-medium text-white/90 hover:text-white transition-colors duration-300 px-3.5 py-1.5 rounded-lg hover:bg-white/6"
                  >
                    Blog
                  </Link>
                  <Link
                    to="/faq"
                    className="text-[13px] font-medium text-white/90 hover:text-white transition-colors duration-300 px-3.5 py-1.5 rounded-lg hover:bg-white/6"
                  >
                    FAQ
                  </Link>
                  <a
                    href="https://github.com/chumlabhq/ui"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/90 hover:text-white transition-colors duration-300 p-2 rounded-lg hover:bg-white/6"
                    aria-label="GitHub"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                  </a>
                </div>
                <Link
                  to="/getting-started"
                  className="text-[12px] font-medium px-5 py-1.5 rounded-lg bg-white/[0.07] hover:bg-white/12 border border-white/8 hover:border-blue-500/25 transition-all duration-300 sm:ml-2"
                >
                  Get Started
                </Link>

                {/* Hamburger button — mobile only */}
                <button
                  className="sm:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-white/[0.08] transition-colors duration-300 ml-1"
                  onClick={() => setMenuOpen(true)}
                  aria-label="Open menu"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white/90"
                  >
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* ── MOBILE MENU OVERLAY ── */}
        {menuOpen && (
          <div className="pointer-events-auto fixed inset-0 z-[60] sm:hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />
            {/* Drawer */}
            <nav className="absolute top-0 right-0 h-full w-64 max-w-[80vw] bg-[#0a0a14] border-l border-white/[0.08] shadow-2xl animate-slide-in-right flex flex-col py-6 px-5">
              <button
                className="self-end mb-6 flex items-center justify-center w-9 h-9 rounded-lg hover:bg-white/[0.08] transition-colors duration-300"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white/90"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              <Link
                to="/accordion"
                onClick={() => setMenuOpen(false)}
                className="text-[15px] font-medium text-white/90 hover:text-white py-3 border-b border-white/[0.06] transition-colors duration-300"
              >
                Components
              </Link>
              <Link
                to="/blog"
                onClick={() => setMenuOpen(false)}
                className="text-[15px] font-medium text-white/90 hover:text-white py-3 border-b border-white/[0.06] transition-colors duration-300"
              >
                Blog
              </Link>
              <Link
                to="/faq"
                onClick={() => setMenuOpen(false)}
                className="text-[15px] font-medium text-white/90 hover:text-white py-3 border-b border-white/[0.06] transition-colors duration-300"
              >
                FAQ
              </Link>
              <a
                href="https://github.com/chumlabhq/ui"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="text-[15px] font-medium text-white/90 hover:text-white py-3 border-b border-white/[0.06] transition-colors duration-300 flex items-center gap-2"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                GitHub
              </a>
            </nav>
          </div>
        )}

        <main className="pointer-events-auto">
          {/* ══════════════════════════════════════════════════════════════════
              SECTION 1 — HERO (full viewport, centered)
          ══════════════════════════════════════════════════════════════════ */}
          <section className="h-screen flex items-center justify-center px-6 sm:px-10 pt-[56px]">
            <div className="text-center max-w-5xl mx-auto">
              <div className="relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full border border-white/2 animate-float opacity-60" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] sm:w-[380px] sm:h-[380px] rounded-full border border-white/1.5 animate-float-d1 opacity-40" />
                <h1 className="relative animate-fade-up-d1 text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-6">
                  Ship products <TypingHeadline />
                </h1>
              </div>

              <p className="animate-fade-up-d2 text-base sm:text-lg text-gray-400 leading-[1.7] max-w-2xl mx-auto mb-10">
                The best teams don't waste engineering cycles on UI plumbing.
                Chumlab gives you the same production ready components that top
                startups use so your team can focus on the product, not the
                infrastructure.
              </p>

              <div className="animate-fade-up-d3 flex flex-col items-center gap-5">
                <Link
                  to="/accordion"
                  className="group relative inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-medium text-white overflow-hidden transition-all"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-blue-600 via-indigo-500 to-violet-600" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-linear-to-r from-blue-500 via-indigo-400 to-violet-500 transition-opacity duration-500" />
                  <div className="absolute inset-0 rounded-xl shadow-[0_0_24px_rgba(99,102,241,0.25)] group-hover:shadow-[0_0_40px_rgba(99,102,241,0.45)] transition-shadow duration-500" />
                  <span className="relative">Explore Components</span>
                  <svg
                    className="relative group-hover:translate-x-0.5 transition-transform duration-300"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
                <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-lg bg-white/2.5 border border-white/5 text-[13px] font-mono text-gray-500 max-w-full overflow-hidden">
                  <span className="text-gray-700 select-none">$</span>
                  <span className="text-xs sm:text-sm truncate">
                    npm install{" "}
                    <span className="text-gray-400">@chumlab/ui</span>
                  </span>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText("npm install @chumlab/ui")
                    }
                    className="text-gray-600 hover:text-gray-300 transition-colors duration-300"
                    aria-label="Copy"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="14" height="14" x="8" y="8" rx="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════════
              SECTION 2 — WHY CHUMLAB (full viewport, centered)
          ══════════════════════════════════════════════════════════════════ */}
          <section className="min-h-screen flex items-center justify-center px-6 sm:px-10 py-20">
            <style>{`
              @property --border-angle {
                syntax: "<angle>";
                initial-value: 0deg;
                inherits: false;
              }
              .glow-border {
                --border-angle: 0deg;
                animation: border-rotate 3s linear infinite;
              }
              .glow-border::before {
                content: "";
                position: absolute;
                inset: -1px;
                border-radius: 1rem;
                padding: 1px;
                background: conic-gradient(from var(--border-angle), transparent 30%, var(--glow-color) 50%, transparent 70%);
                mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                mask-composite: exclude;
                -webkit-mask-composite: xor;
                opacity: 0.5;
                transition: opacity 0.4s;
              }
              .glow-border:hover::before {
                opacity: 1;
              }
              @keyframes border-rotate {
                to { --border-angle: 360deg; }
              }
            `}</style>
            <div className="max-w-5xl mx-auto w-full">
              <div className="text-center mb-20">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-5">
                  Stop rebuilding UI from scratch
                </h2>
                <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                  Your team has built the same dropdown three times. The same
                  modal twice. Chumlab gives you production-grade components so
                  you can ship features, not infrastructure.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
                {features.map((f) => (
                  <div
                    key={f.title}
                    className={`glow-border relative group rounded-2xl p-5 sm:p-7 border ${f.border} ${f.bg} hover:bg-white/[0.06] transition-all duration-500 backdrop-blur-sm`}
                    style={
                      {
                        "--glow-color":
                          f.color === "text-emerald-400"
                            ? "#34d399"
                            : f.color === "text-blue-400"
                              ? "#60a5fa"
                              : "#fbbf24",
                      } as React.CSSProperties
                    }
                  >
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5 ${f.bg} ${f.color}`}
                    >
                      {f.icon}
                    </div>
                    <h3 className="text-base font-semibold mb-2 text-white">
                      {f.title}
                    </h3>
                    <p className="text-[13px] text-gray-300 leading-[1.7]">
                      {f.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════════
              SECTION 3 — COMPONENTS (top 6)
          ══════════════════════════════════════════════════════════════════ */}
          <section className="px-6 sm:px-10 py-16 sm:py-28">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-20">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-5">
                  Everything you need to ship faster
                </h2>
                <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                  Accessible, themeable, SSR safe components with full
                  TypeScript support. Here are the ones teams reach for first.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[
                  {
                    name: "Table",
                    path: "table",
                    desc: "Sorting, pagination, row selection, column pinning, resizing, and infinite scroll. All in one.",
                    icon: (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm2 0v3h6V5H5zm8 0v3h6V5h-6zM5 10v4h6v-4H5zm8 0v4h6v-4h-6zM5 16v3h6v-3H5zm8 0v3h6v-3h-6z" />
                      </svg>
                    ),
                  },
                  {
                    name: "Modal",
                    path: "modal",
                    desc: "Focus trapping, scroll lock, nested stacking, escape handling, and smooth enter/exit animations.",
                    icon: (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm4 1a1 1 0 000 2h10a1 1 0 100-2H7zm0 4a1 1 0 100 2h6a1 1 0 100-2H7z" />
                      </svg>
                    ),
                  },
                  {
                    name: "DatePicker",
                    path: "date-picker",
                    desc: "Single date, range, and multi select modes with calendar grid, presets, and keyboard navigation.",
                    icon: (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M6 3a1 1 0 011 1v1h10V4a1 1 0 112 0v1h1a3 3 0 013 3v10a3 3 0 01-3 3H4a3 3 0 01-3-3V8a3 3 0 013-3h1V4a1 1 0 011-1zm-2 7v8a1 1 0 001 1h14a1 1 0 001-1v-8H4zm3 2a1 1 0 011-1h.01a1 1 0 110 2H8a1 1 0 01-1-1zm4 0a1 1 0 011-1h.01a1 1 0 110 2H12a1 1 0 01-1-1zm4 0a1 1 0 011-1h.01a1 1 0 110 2H16a1 1 0 01-1-1zm-8 4a1 1 0 011-1h.01a1 1 0 110 2H8a1 1 0 01-1-1zm4 0a1 1 0 011-1h.01a1 1 0 110 2H12a1 1 0 01-1-1z" />
                      </svg>
                    ),
                  },
                  {
                    name: "Dropdown",
                    path: "dropdown",
                    desc: "Single select with search, keyboard nav, portal positioning, and shimmer loading states.",
                    icon: (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M3 5a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm2 6a2 2 0 00-2 2v2a2 2 0 002 2h14a2 2 0 002-2v-2a2 2 0 00-2-2H5zm0 8a1 1 0 100 2h4a1 1 0 100-2H5z" />
                      </svg>
                    ),
                  },
                  {
                    name: "Toast",
                    path: "toast",
                    desc: "Auto dismiss notifications with stacking, pause on hover, progress bars, and position control.",
                    icon: (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M5.85 3.5a.75.75 0 00-1.117-1 9.719 9.719 0 00-2.348 4.876.75.75 0 001.479.248A8.219 8.219 0 015.85 3.5zM19.267 2.5a.75.75 0 10-1.118 1 8.22 8.22 0 011.987 4.124.75.75 0 001.48-.248A9.72 9.72 0 0019.266 2.5zM12 2.25A6.75 6.75 0 005.25 9v.75a8.217 8.217 0 01-2.119 5.52.75.75 0 00.298 1.206c1.544.57 3.16.99 4.831 1.243a3.75 3.75 0 107.48 0 24.583 24.583 0 004.83-1.244.75.75 0 00.298-1.205 8.217 8.217 0 01-2.118-5.52V9A6.75 6.75 0 0012 2.25zM9.75 18c0-.034 0-.067.002-.1a25.05 25.05 0 004.496 0l.002.1a2.25 2.25 0 01-4.5 0z" />
                      </svg>
                    ),
                  },
                  {
                    name: "Input",
                    path: "input",
                    desc: "Text fields with validation, icons, prefix/suffix slots, clearable, character counts, and error states.",
                    icon: (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M3.5 5A1.5 1.5 0 002 6.5v3A1.5 1.5 0 003.5 11h.294a1 1 0 01.768.36l1.07 1.284a.5.5 0 00.768 0l1.07-1.284A1 1 0 018.206 11H8.5A1.5 1.5 0 0010 9.5v-3A1.5 1.5 0 008.5 5h-5zM14 7a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2h-6zm-1 5a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1zm-11 0a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H4z" />
                      </svg>
                    ),
                  },
                ].map((c, i) => (
                  <Link
                    key={c.path}
                    to={`/${c.path}`}
                    className="glow-border group relative rounded-2xl p-6 border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-500 backdrop-blur-sm"
                    style={
                      {
                        "--glow-color": "#6366f1",
                        animationDelay: `${i * -0.5}s`,
                      } as React.CSSProperties
                    }
                  >
                    <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-blue-500/5 via-transparent to-indigo-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-500/[0.08] text-indigo-400 group-hover:bg-indigo-500/[0.15] group-hover:text-indigo-300 transition-all duration-300">
                          {c.icon}
                        </div>
                        <h3 className="text-[15px] font-semibold text-white group-hover:text-blue-200 transition-colors duration-300">
                          {c.name}
                        </h3>
                      </div>
                      <p className="text-[13px] text-gray-400 leading-[1.7] group-hover:text-gray-300 transition-colors duration-300">
                        {c.desc}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="text-center mt-14">
                <Link
                  to="/accordion"
                  className="group relative inline-flex items-center gap-2.5 px-7 py-3 rounded-xl text-sm font-medium text-white overflow-hidden transition-all"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-blue-600 via-indigo-500 to-violet-600" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-linear-to-r from-blue-500 via-indigo-400 to-violet-500 transition-opacity duration-500" />
                  <div className="absolute inset-0 rounded-xl shadow-[0_0_24px_rgba(99,102,241,0.2)] group-hover:shadow-[0_0_40px_rgba(99,102,241,0.4)] transition-shadow duration-500" />
                  <span className="relative">View all components</span>
                  <svg
                    className="relative group-hover:translate-x-0.5 transition-transform duration-300"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════════
              SECTION 4 — FAQ PREVIEW
          ══════════════════════════════════════════════════════════════════ */}
          <section className="px-6 sm:px-10 py-16 sm:py-28">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-5">
                  Got questions?
                </h2>
                <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                  Quick answers to the most common questions about Chumlab UI.
                </p>
              </div>

              <Accordion
                type="single"
                collapsible
                classes={{
                  root: "w-full rounded-2xl border border-white/[0.08] overflow-hidden bg-white/[0.02]",
                  item: "border-b border-white/[0.06] last:border-b-0",
                  trigger:
                    "flex w-full items-center justify-between px-4 sm:px-6 py-4 sm:py-5 text-left text-[15px] font-medium text-white/90 transition-all duration-300 hover:bg-white/[0.04] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-inset",
                  triggerInner: "flex-1 text-left",
                  content:
                    "px-4 sm:px-6 py-4 sm:py-5 text-[15px] text-gray-400 leading-relaxed",
                  contentWrapper:
                    "overflow-hidden transition-[max-height,opacity,visibility]",
                  icon: "shrink-0 text-white/40",
                  iconWrapper: "shrink-0",
                  subtitle: "",
                  triggerLeft: "",
                  triggerRight: "",
                  contentInner: "",
                  heading: "",
                }}
              >
                {HOME_FAQS.map((faq, i) => (
                  <AccordionItem key={i} value={`home-faq-${i}`}>
                    <AccordionTrigger
                      expandedIcon={<FaqIconExpanded />}
                      collapsedIcon={<FaqIconCollapsed />}
                      iconAnimation="none"
                    >
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <div className="text-center mt-12">
                <Link
                  to="/faq"
                  className="group relative inline-flex items-center gap-2.5 px-8 py-3 rounded-xl text-sm font-medium text-white overflow-hidden transition-all"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-blue-600 via-indigo-500 to-violet-600" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-linear-to-r from-blue-500 via-indigo-400 to-violet-500 transition-opacity duration-500" />
                  <div className="absolute inset-0 rounded-xl shadow-[0_0_24px_rgba(99,102,241,0.25)] group-hover:shadow-[0_0_40px_rgba(99,102,241,0.45)] transition-shadow duration-500" />
                  <span className="relative">View all FAQs</span>
                  <svg
                    className="relative group-hover:translate-x-0.5 transition-transform duration-300"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════════
              SECTION 5 — BLOGS (3 random)
          ══════════════════════════════════════════════════════════════════ */}
          <section className="px-6 sm:px-10 py-16 sm:py-28">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-20">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-5">
                  Learn, build, ship
                </h2>
                <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                  Practical guides on React architecture, performance patterns,
                  and frontend best practices from the team behind Chumlab.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
                {randomBlogs.map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.id}`}
                    className="group block rounded-2xl border border-white/[0.08] bg-white/[0.03] overflow-hidden transition-all duration-500 hover:border-white/[0.15] hover:bg-white/[0.05] hover:shadow-[0_8px_40px_rgba(0,0,0,0.3)] hover:-translate-y-1"
                  >
                    <div className="relative h-36 sm:h-44 overflow-hidden">
                      {post.coverImage ? (
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div
                          className="w-full h-full"
                          style={{
                            background: `linear-gradient(135deg, ${post.coverGradient[0]}18, ${post.coverGradient[1]}14)`,
                          }}
                        />
                      )}
                    </div>

                    <div className="p-4 sm:p-5">
                      <div className="flex items-center gap-2.5 mb-3">
                        <span className="text-[11px] font-medium text-gray-500 bg-white/[0.05] px-2 py-0.5 rounded-full">
                          {post.category}
                        </span>
                        <span className="text-xs text-gray-600">
                          {post.readTime}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white leading-snug mb-2 group-hover:text-blue-100 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-400 leading-relaxed line-clamp-2 mb-4">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                        <span className="text-xs text-gray-500">
                          {post.date}
                        </span>
                        <span className="text-xs font-medium text-blue-400 group-hover:text-blue-300 transition-colors flex items-center gap-1.5">
                          Read more
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="group-hover:translate-x-0.5 transition-transform"
                          >
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="text-center">
                <Link
                  to="/blog"
                  className="group relative inline-flex items-center gap-2.5 px-8 py-3 rounded-xl text-sm font-medium text-white overflow-hidden transition-all"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-blue-600 via-indigo-500 to-violet-600" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-linear-to-r from-blue-500 via-indigo-400 to-violet-500 transition-opacity duration-500" />
                  <div className="absolute inset-0 rounded-xl shadow-[0_0_24px_rgba(99,102,241,0.25)] group-hover:shadow-[0_0_40px_rgba(99,102,241,0.45)] transition-shadow duration-500" />
                  <span className="relative">Read all articles</span>
                  <svg
                    className="relative group-hover:translate-x-0.5 transition-transform duration-300"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </section>

          {/* ── FOOTER ── */}
          <footer className="w-full px-6 sm:px-10 pt-16 pb-8">
            <div className="border-t border-white/[0.08] pt-8">
              {/* Row: logo — nav links — social */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-8">
                <LogoMark size={120} />
                <div className="flex items-center gap-6">
                  <Link
                    to="/accordion"
                    className="text-sm text-white transition-colors duration-300"
                  >
                    Components
                  </Link>
                  <Link
                    to="/blog"
                    className="text-sm text-white transition-colors duration-300"
                  >
                    Blog
                  </Link>
                  <Link
                    to="/faq"
                    className="text-sm text-white transition-colors duration-300"
                  >
                    FAQ
                  </Link>
                  <a
                    href="https://github.com/chumlabhq/ui"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white transition-colors duration-300"
                    aria-label="GitHub"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Bottom row */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 text-xs sm:text-sm text-white">
                <span className="text-xs sm:text-sm text-left w-full sm:w-auto">
                  &copy; {new Date().getFullYear()} Chumlab &middot; MIT License
                  <br className="sm:hidden" />
                  <span className="hidden sm:inline">&middot; </span>Built with{" "}
                  {"☕"} and way too many tabs
                </span>
                <a
                  href="mailto:hello@chumlab.com"
                  className="text-xs sm:text-sm text-white transition-colors duration-300 text-left sm:text-right w-full sm:w-auto shrink-0"
                >
                  {"💬"} Got feedback? Ping us at{" "}
                  <span className="underline underline-offset-2">
                    hello@chumlab.com
                  </span>
                </a>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Home;
