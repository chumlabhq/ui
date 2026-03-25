import { Link } from "react-router-dom";
import { useEffect, useRef, useCallback, useState } from "react";
import { LogoMark, LogoWordmark } from "../components/brand/Logo";

// ─── Typing animation component ────────────────────────────────────────────

const phrases = [
  "in half the time",
  "users remember",
  "teams dream of",
];

function TypingHeadline() {
  const [display, setDisplay] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    const phrase = phrases[phraseIdx];
    let charIdx = 0;
    let deleting = false;
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (!deleting) {
        // Typing forward
        charIdx++;
        setDisplay(phrase.slice(0, charIdx));
        if (charIdx === phrase.length) {
          // Pause at full phrase
          if (phraseIdx === phrases.length - 1) {
            // Last phrase — stop
            setTimeout(() => setDone(true), 800);
            return;
          }
          timeout = setTimeout(() => { deleting = true; tick(); }, 1500);
          return;
        }
        timeout = setTimeout(tick, 60 + Math.random() * 40);
      } else {
        // Deleting
        charIdx--;
        setDisplay(phrase.slice(0, charIdx));
        if (charIdx === 0) {
          deleting = false;
          setPhraseIdx((prev) => prev + 1);
          return;
        }
        timeout = setTimeout(tick, 30 + Math.random() * 20);
      }
    };

    timeout = setTimeout(tick, phraseIdx === 0 ? 600 : 200);
    return () => clearTimeout(timeout);
  }, [phraseIdx, done]);

  return (
    <span className="animate-shimmer bg-[linear-gradient(110deg,#60a5fa_0%,#38bdf8_20%,#818cf8_40%,#6366f1_60%,#38bdf8_80%,#60a5fa_100%)] bg-clip-text text-transparent">
      {display}
      {!done && (
        <span className="inline-block w-[3px] sm:w-[4px] h-[0.85em] bg-blue-400 ml-1 align-middle animate-pulse rounded-full" />
      )}
    </span>
  );
}

const components = [
  { name: "Input", path: "input", desc: "Rich text fields with validation, icons, prefix/suffix, clearable, and character counts." },
  { name: "TextArea", path: "text-area", desc: "Multi-line text input with live validation, clearable, and character counting." },
  { name: "Button", path: "button", desc: "Actions with loading states, start/end icons, and size variants." },
  { name: "Dropdown", path: "dropdown", desc: "Select menus with keyboard navigation and accessible labeling." },
  { name: "Modal", path: "modal", desc: "Accessible dialogs with focus trapping and scroll lock." },
  { name: "Drawer", path: "drawer", desc: "Slide-out panels with configurable snap points and gestures." },
  { name: "Table", path: "table", desc: "Data tables with column sorting, pagination, and row selection." },
  { name: "Toast", path: "toast", desc: "Notification system with auto-dismiss, stacking, and positions." },
  { name: "Accordion", path: "accordion", desc: "Collapsible content panels with smooth animations." },
  { name: "Tabs", path: "tab-panel", desc: "Tabbed navigation with roving focus and ARIA compliance." },
  { name: "DatePicker", path: "date-picker", desc: "Calendar date selection with range support." },
  { name: "Switch", path: "switch", desc: "Toggle controls with labels and controlled/uncontrolled modes." },
];

// ─── Types ──────────────────────────────────────────────────────────────────

interface Star { x: number; y: number; z: number; size: number; a: number; ts: number; to: number; hue: number }
interface ShootingStar { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number }
interface Comet { x: number; y: number; vx: number; vy: number; life: number; active: boolean }

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
      x: Math.random(), y: Math.random(), z: Math.random(),
      size: 0.3 + Math.random() * 2.5,
      a: 0.08 + Math.random() * 0.8,
      ts: 0.2 + Math.random() * 3,
      to: Math.random() * 6.28,
      hue: [210, 240, 270, 300, 330, 200][Math.floor(Math.random() * 6)] + Math.random() * 30,
    }));

    const shootingStars: ShootingStar[] = [];
    let ssTimer = 400;
    const comet: Comet = { x: -0.15, y: 0, vx: 0, vy: 0, life: 0, active: false };
    let cometTimer = 120;
    const sat = { angle: 0 };

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    let raf: number;

    const draw = (time: number) => {
      const w = canvas.width, h = canvas.height, t = time * 0.001;
      ctx.clearRect(0, 0, w, h);
      const m = mouse.current;
      m.x += (m.tx - m.x) * 0.04;
      m.y += (m.ty - m.y) * 0.04;
      const mx = (m.x - 0.5) * 2, my = (m.y - 0.5) * 2;

      // ═══ STARS ═══
      for(const s of stars){const px=s.x*w+mx*s.z*45,py=s.y*h+my*s.z*45,tw=Math.sin(t*s.ts+s.to),al=s.a*(.35+.65*tw),sz=s.size*(.35+s.z*.85);ctx.beginPath();ctx.arc(px,py,sz,0,6.28);ctx.fillStyle=`hsla(${s.hue},${25+al*75}%,${60+al*40}%,${al})`;ctx.fill();if(s.z>.88&&al>.55){const sp=sz*7;ctx.globalAlpha=al*.12;ctx.strokeStyle=`hsl(${s.hue},60%,80%)`;ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(px-sp,py);ctx.lineTo(px+sp,py);ctx.moveTo(px,py-sp);ctx.lineTo(px,py+sp);ctx.stroke();ctx.globalAlpha=1;}}

      // ═══ SATELLITE ═══
      sat.angle+=.003;const satCX=w*.8,satCY=h*.18,satX=satCX+Math.cos(sat.angle)*w*.12+mx*30,satY=satCY+Math.sin(sat.angle)*h*.06+my*20,satSc=.85+Math.sin(sat.angle)*.15,S=8;
      ctx.save();ctx.translate(satX,satY);ctx.scale(satSc,satSc);ctx.rotate(sat.angle*.2+Math.sin(t*.4)*.15);
      ctx.fillStyle="rgba(35,55,140,0.7)";ctx.fillRect(-S*6.5,-S*.6,S*4.5,S*1.2);ctx.fillRect(S*2,-S*.6,S*4.5,S*1.2);
      ctx.strokeStyle="rgba(70,100,200,0.5)";ctx.lineWidth=.5;
      for(let i=1;i<=4;i++){ctx.beginPath();ctx.moveTo(-S*6.5+i*S*1.125,-S*.6);ctx.lineTo(-S*6.5+i*S*1.125,S*.6);ctx.stroke();ctx.beginPath();ctx.moveTo(S*2+i*S*1.125,-S*.6);ctx.lineTo(S*2+i*S*1.125,S*.6);ctx.stroke();}
      ctx.beginPath();ctx.moveTo(-S*6.5,0);ctx.lineTo(-S*2,0);ctx.stroke();ctx.beginPath();ctx.moveTo(S*2,0);ctx.lineTo(S*6.5,0);ctx.stroke();
      ctx.fillStyle="rgba(190,200,220,0.85)";ctx.fillRect(-S*1.5,-S,S*3,S*2);ctx.strokeStyle="rgba(220,225,240,0.4)";ctx.lineWidth=.8;ctx.strokeRect(-S*1.5,-S,S*3,S*2);
      ctx.fillStyle="rgba(200,210,230,0.6)";ctx.beginPath();ctx.arc(S*.3,-S,S*.7,Math.PI,0);ctx.fill();
      ctx.strokeStyle="rgba(210,215,230,0.7)";ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(0,-S);ctx.lineTo(0,-S*3);ctx.stroke();
      ctx.restore();
      if(Math.sin(t*2.5)>.6){ctx.beginPath();ctx.arc(satX,satY-S*3*satSc,3,0,6.28);ctx.fillStyle="rgba(255,50,50,0.95)";ctx.fill();ctx.beginPath();ctx.arc(satX,satY-S*3*satSc,10,0,6.28);ctx.fillStyle="rgba(255,50,50,0.12)";ctx.fill();}

      // ═══ COMET ═══
      cometTimer--;
      if(cometTimer<=0&&!comet.active){comet.active=true;comet.life=0;comet.x=-0.1;comet.y=.08+Math.random()*.25;comet.vx=.45+Math.random()*.3;comet.vy=.08+Math.random()*.15;cometTimer=500+Math.random()*600;}
      if(comet.active){comet.x+=comet.vx*.003;comet.y+=comet.vy*.003;comet.life++;const cx=comet.x*w,cy=comet.y*h,fade=Math.min(1,comet.life/40),tailLen=300+Math.sin(t)*40,tailX=cx-tailLen,tailY=cy-tailLen*.25;
        ctx.save();ctx.globalAlpha=fade*.6;const tg2=ctx.createLinearGradient(tailX-80,tailY,cx,cy);tg2.addColorStop(0,"transparent");tg2.addColorStop(.5,"rgba(120,140,220,0.06)");tg2.addColorStop(1,"rgba(180,200,255,0.15)");ctx.beginPath();ctx.moveTo(tailX-80,tailY-20);ctx.quadraticCurveTo(cx-tailLen*.4,cy-15,cx,cy);ctx.quadraticCurveTo(cx-tailLen*.4,cy+15,tailX-80,tailY+20);ctx.closePath();ctx.fillStyle=tg2;ctx.fill();ctx.globalAlpha=1;ctx.restore();
        const tg=ctx.createLinearGradient(tailX,tailY,cx,cy);tg.addColorStop(0,"transparent");tg.addColorStop(.4,`rgba(160,180,255,${.12*fade})`);tg.addColorStop(.8,`rgba(210,220,255,${.4*fade})`);tg.addColorStop(1,`rgba(255,255,255,${.8*fade})`);ctx.beginPath();ctx.moveTo(tailX,tailY-2);ctx.quadraticCurveTo(cx-tailLen*.3,cy-5,cx,cy);ctx.quadraticCurveTo(cx-tailLen*.3,cy+5,tailX,tailY+2);ctx.closePath();ctx.fillStyle=tg;ctx.fill();
        const hg=ctx.createRadialGradient(cx,cy,0,cx,cy,35);hg.addColorStop(0,`rgba(220,235,255,${.6*fade})`);hg.addColorStop(.4,`rgba(150,180,255,${.2*fade})`);hg.addColorStop(1,"transparent");ctx.beginPath();ctx.arc(cx,cy,35,0,6.28);ctx.fillStyle=hg;ctx.fill();
        ctx.beginPath();ctx.arc(cx,cy,5,0,6.28);ctx.fillStyle=`rgba(255,255,255,${.95*fade})`;ctx.fill();ctx.beginPath();ctx.arc(cx,cy,3,0,6.28);ctx.fillStyle=`rgba(255,255,240,${fade})`;ctx.fill();
        if(comet.x>1.3||comet.y>1.2)comet.active=false;
      }

      // ═══ SHOOTING STARS — travel fully across screen, every 5-10s ═══
      ssTimer--;
      if (ssTimer <= 0) {
        ssTimer = 300 + Math.floor(Math.random() * 300);
        const startEdge = Math.random() > 0.5;
        const sx = startEdge ? -20 : w * (0.1 + Math.random() * 0.3);
        const sy = Math.random() * h * 0.35;
        const angle = 0.15 + Math.random() * 0.35;
        const speed = 8 + Math.random() * 6;
        shootingStars.push({
          x: sx, y: sy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: 999,
          size: 2 + Math.random() * 1.5,
        });
      }
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life++;
        const offScreen = s.x > w + 100 || s.y > h + 100 || s.x < -200 || s.y < -100;
        if (offScreen) { shootingStars.splice(i, 1); continue; }

        const fadeIn = Math.min(1, s.life / 15);
        const fadeOut = offScreen ? 0 : (s.x > w - 150 ? Math.max(0, (w + 100 - s.x) / 250) : 1);
        const fade = fadeIn * fadeOut;

        const trailLen = 120 + s.size * 25;
        const norm = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
        const tx = s.x - (s.vx / norm) * trailLen * fade;
        const ty = s.y - (s.vy / norm) * trailLen * fade;

        const sg = ctx.createLinearGradient(tx, ty, s.x, s.y);
        sg.addColorStop(0, "transparent");
        sg.addColorStop(0.4, `rgba(180,200,255,${0.25 * fade})`);
        sg.addColorStop(1, `rgba(255,255,255,${0.85 * fade})`);
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = sg; ctx.lineWidth = s.size; ctx.lineCap = "round"; ctx.stroke();

        ctx.beginPath(); ctx.arc(s.x, s.y, s.size * 1.5 * fade, 0, 6.28);
        ctx.fillStyle = `rgba(255,255,255,${0.9 * fade})`; ctx.fill();
        ctx.beginPath(); ctx.arc(s.x, s.y, s.size * 4 * fade, 0, 6.28);
        ctx.fillStyle = `rgba(200,215,255,${0.08 * fade})`; ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); window.removeEventListener("mousemove", onMove); };
  }, [canvasRef, onMove]);
}

// ─── Page ───────────────────────────────────────────────────────────────────

const staggerClass = (i: number) => `stagger-${i + 1}`;

const Home = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useSpaceScene(canvasRef);

  return (
    <div className="min-h-screen bg-[#04040a] text-white overflow-hidden selection:bg-indigo-500/30">
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-0" style={{ pointerEvents: "all" }} aria-hidden="true" />

      {/* CSS nebula layers */}
      <div className="fixed inset-0 pointer-events-none z-1" aria-hidden="true">
        <div className="animate-nebula-pulse absolute top-[12%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse,rgba(168,85,247,0.12)_0%,rgba(99,102,241,0.05)_35%,transparent_65%)] blur-[50px]" />
        <div className="absolute top-[28%] left-1/2 w-0 h-0">
          <div className="animate-orbit-1 absolute w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.10)_0%,transparent_65%)] blur-[70px]" />
          <div className="animate-orbit-2 absolute w-[550px] h-[550px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.08)_0%,transparent_65%)] blur-[70px]" />
          <div className="animate-orbit-3 absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(96,165,250,0.06)_0%,transparent_65%)] blur-[70px]" />
        </div>
        <div className="absolute top-[33%] left-0 w-full h-px bg-linear-to-r from-transparent via-purple-400/10 to-transparent" />
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-[0.025]">
          <div className="animate-beam absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[linear-gradient(90deg,transparent_40%,rgba(255,255,255,0.15)_50%,transparent_60%)]" />
        </div>
        {/* Vignette — shifted right so bottom-left sun is not covered */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_55%_40%,transparent_0%,rgba(4,4,10,0.3)_60%,rgba(4,4,10,0.6)_80%,#04040a_100%)]" />
        {/* Bottom fade — only right side, left is open for sun */}
        <div className="absolute bottom-0 left-[25%] right-0 h-[20%] bg-linear-to-t from-[#04040a]/40 to-transparent" />
      </div>

      {/* ═══ SUN — very subtle warm presence, bottom-left ═══ */}
      <div className="fixed bottom-0 left-0 pointer-events-none z-2 opacity-50" aria-hidden="true" style={{ width: "45vw", height: "45vh" }}>
        <div className="absolute -bottom-[35%] -left-[18%] w-[70vmin] h-[70vmin] rounded-full bg-[radial-gradient(circle,rgba(255,170,60,0.035)_0%,rgba(255,130,30,0.01)_40%,transparent_65%)]" />
        <div className="absolute -bottom-[25%] -left-[12%] w-[40vmin] h-[40vmin] rounded-full bg-[radial-gradient(circle,rgba(255,190,90,0.05)_0%,rgba(255,140,40,0.015)_50%,transparent_75%)]" />
        <div className="absolute -bottom-[20%] -left-[8%] w-[28vmin] h-[28vmin] rounded-full bg-[radial-gradient(circle,rgba(255,210,130,0.07)_0%,rgba(255,160,50,0.02)_50%,transparent_75%)]" />
        <div className="absolute -bottom-[16%] -left-[5%] w-[18vmin] h-[18vmin] rounded-full bg-[radial-gradient(circle,rgba(255,240,210,0.18)_0%,rgba(255,200,110,0.08)_30%,rgba(255,160,45,0.03)_60%,transparent_85%)]" />
        <div className="absolute -bottom-[14%] -left-[3.5%] w-[12vmin] h-[12vmin] rounded-full bg-[radial-gradient(circle,rgba(255,250,235,0.12)_0%,rgba(255,240,210,0.04)_45%,transparent_70%)]" />
        <div className="absolute bottom-[7%] -left-[5%] w-[40vw] h-[0.3vmin]" style={{ background: "linear-gradient(90deg, transparent 10%, rgba(255,235,190,0.03) 30%, rgba(255,245,215,0.06) 45%, rgba(255,245,215,0.06) 55%, rgba(255,235,190,0.03) 70%, transparent 90%)" }} />
      </div>

      {/* ═══ CONTENT ═══ */}
      <div className="relative z-10 pointer-events-none">

        {/* ── HEADER ── */}
        <header className="pointer-events-auto fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#04040a]/60">
          <div className="w-full px-5 sm:px-8">
            <div className="flex items-center justify-between py-3.5">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="relative group-hover:scale-105 transition-transform duration-500">
                  <LogoMark size={40} />
                  <div className="absolute -inset-3 rounded-full bg-indigo-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <LogoWordmark className="text-[22px]" />
              </Link>
              <div className="flex items-center gap-1">
                <Link to="/accordion" className="text-[12px] text-gray-500 hover:text-white transition-colors duration-300 px-3.5 py-1.5 rounded-lg hover:bg-white/4">Docs</Link>
                <Link to="/accordion" className="text-[12px] text-gray-500 hover:text-white transition-colors duration-300 px-3.5 py-1.5 rounded-lg hover:bg-white/4">Components</Link>
                <Link to="/accordion" className="text-[12px] font-medium px-5 py-1.5 rounded-lg bg-white/[0.07] hover:bg-white/12 border border-white/8 hover:border-blue-500/25 transition-all duration-300 ml-3 hover:shadow-[0_0_20px_rgba(168,85,247,0.12)]">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="pointer-events-auto">

          {/* ── HERO ── */}
          <section className="max-w-6xl mx-auto px-6 sm:px-10 pt-28 sm:pt-36 pb-28 text-center">
            <div className="max-w-3xl mx-auto">
              {/* Decorative orbital ring behind heading */}
              <div className="relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/2 animate-float opacity-60" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full border border-white/1.5 animate-float-d1 opacity-40" />

                <h1 className="relative animate-fade-up-d1 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] mb-6 whitespace-nowrap">
                  Ship products <TypingHeadline />
                </h1>
              </div>

              <p className="animate-fade-up-d2 text-[15px] sm:text-[17px] text-gray-400 leading-[1.7] max-w-lg mx-auto mb-8">
                The best teams don't waste engineering cycles on UI plumbing.
                Churn Lab gives you the same production ready components that
                top startups use so your team can focus on the product, not the infrastructure.
              </p>

              <div className="animate-fade-up-d3 flex flex-col items-center gap-4">
                <Link to="/input" className="group relative inline-flex items-center gap-2 px-7 py-2.5 rounded-xl text-[13px] font-medium text-white overflow-hidden transition-all">
                  <div className="absolute inset-0 bg-linear-to-r from-blue-600 via-indigo-500 to-violet-600"/>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-linear-to-r from-blue-500 via-indigo-400 to-violet-500 transition-opacity duration-500"/>
                  <div className="absolute inset-0 rounded-xl shadow-[0_0_24px_rgba(99,102,241,0.25)] group-hover:shadow-[0_0_40px_rgba(99,102,241,0.45)] transition-shadow duration-500"/>
                  <span className="relative">Explore Components</span>
                  <svg className="relative group-hover:translate-x-0.5 transition-transform duration-300" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </Link>
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-lg bg-white/2.5 border border-white/5 text-[12px] font-mono text-gray-500">
                  <span className="text-gray-700 select-none">$</span>
                  <span>npm install <span className="text-gray-400">@churnlab/ui</span></span>
                  <button onClick={() => navigator.clipboard.writeText("npm install @churnlab/ui")} className="text-gray-600 hover:text-gray-300 transition-colors duration-300" aria-label="Copy">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ── STATS STRIP ── */}
          <section className="max-w-6xl mx-auto px-6 sm:px-10 pb-24">
            <div className="flex items-center justify-center gap-8 sm:gap-16 text-center">
              {[
                ["12+", "Components"],
                ["100%", "Accessible"],
                ["0", "Dependencies"],
                ["180+", "Tests"],
              ].map(([num, label]) => (
                <div key={label}>
                  <div className="text-xl sm:text-2xl font-bold tracking-tight bg-linear-to-b from-white to-gray-500 bg-clip-text text-transparent">{num}</div>
                  <div className="text-[10px] text-gray-600 uppercase tracking-wider mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── WHY CHURN LAB ── */}
          <section className="max-w-6xl mx-auto px-6 sm:px-10 pb-28">
            <div className="text-center mb-12">
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-600 mb-3 block">Why churn lab</span>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">The components your team keeps rebuilding</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {[
                { icon: "M9 12l2 2 4-4|M22 11.08V12a10 10 0 1 1-5.93-9.14", title: "Accessible from day one", desc: "Most startups skip accessibility until a customer complains or an audit fails. Every churn lab component ships with full keyboard navigation, screen reader support, and WCAG 2.1 AA compliance built in.", ic: "text-emerald-400", float: "animate-float" },
                { icon: "M12 2L2 7l10 5 10-5-10-5z|M2 17l10 5 10-5|M2 12l10 5 10-5", title: "Your brand, not ours", desc: "Most component libraries force you into their visual style and then you spend weeks overriding it. Churn lab gives you className props on every single element so your components look like yours from day one.", ic: "text-blue-400", float: "animate-float-d1" },
                { icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z", title: "Actually production ready", desc: "We handle the edge cases that bite you at 2am. Controlled and uncontrolled modes that actually work together, proper event contracts, ref forwarding, and dev warnings that catch bugs before your users do.", ic: "text-amber-400", float: "animate-float-d2" },
              ].map((f) => (
                <div key={f.title} className={`card-glow rounded-2xl p-5 transition-all duration-500 backdrop-blur-sm animate-pulse-glow`}>
                  <div className={`${f.float} mb-4`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={f.ic}>{f.icon.split("|").map((d,i)=><path key={i} d={d}/>)}</svg>
                  </div>
                  <h3 className="text-[13px] font-semibold mb-1.5">{f.title}</h3>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── COMPONENTS ── */}
          <section className="max-w-6xl mx-auto px-6 sm:px-10 pb-28">
            {/* Section header with decorative line */}
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px flex-1 bg-linear-to-r from-transparent to-white/6" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-600 shrink-0">Components</span>
              <div className="h-px flex-1 bg-linear-to-l from-transparent to-white/6" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
              {components.map((c, i) => (
                <Link
                  key={c.path}
                  to={`/${c.path}`}
                  className={`card-glow group relative rounded-xl p-4 transition-all duration-500 backdrop-blur-sm ${staggerClass(i)}`}
                >
                  <div className="absolute inset-0 rounded-xl bg-linear-to-br from-blue-500/3 via-transparent to-indigo-500/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[13px] font-medium group-hover:text-blue-300 transition-colors duration-300">{c.name}</span>
                    </div>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all duration-300"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </div>
                  <p className="relative text-[11px] text-gray-600 leading-relaxed mt-1.5 group-hover:text-gray-400 transition-colors duration-300">{c.desc}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* ── CTA BAND ── */}
          <section className="max-w-6xl mx-auto px-6 sm:px-10 pb-24">
            <div className="relative rounded-2xl overflow-hidden p-8 sm:p-12 text-center">
              {/* Background glow */}
              <div className="absolute inset-0 bg-linear-to-br from-blue-500/4 via-transparent to-indigo-500/3" />
              <div className="absolute inset-0 border border-white/4 rounded-2xl" />
              <div className="relative">
                <h3 className="text-lg sm:text-xl font-bold tracking-tight mb-2">Ship your product, not your component library</h3>
                <p className="text-[13px] text-gray-500 mb-6 max-w-md mx-auto">Your engineering team should be building features that move the needle for your business, not spending another sprint rebuilding a dropdown.</p>
                <Link to="/input" className="group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-medium text-white overflow-hidden transition-all">
                  <div className="absolute inset-0 bg-linear-to-r from-blue-600 via-indigo-500 to-violet-600"/>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-linear-to-r from-blue-500 via-indigo-400 to-violet-500 transition-opacity duration-500"/>
                  <div className="absolute inset-0 rounded-xl shadow-[0_0_24px_rgba(99,102,241,0.2)] group-hover:shadow-[0_0_40px_rgba(99,102,241,0.4)] transition-shadow duration-500"/>
                  <span className="relative">Browse Documentation</span>
                  <svg className="relative group-hover:translate-x-0.5 transition-transform duration-300" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </Link>
              </div>
            </div>
          </section>

          {/* ── FOOTER ── */}
          <footer className="w-full px-5 sm:px-8 pb-6">
            <div className="border-t border-white/4 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <LogoMark size={32} />
                  <LogoWordmark className="text-[18px]" />
                  <span className="text-[10px] text-gray-700 ml-2">MIT License</span>
                </div>
                <div className="flex items-center gap-5">
                  <Link to="/accordion" className="text-[11px] text-gray-600 hover:text-gray-300 transition-colors duration-300">Docs</Link>
                  <Link to="/button" className="text-[11px] text-gray-600 hover:text-gray-300 transition-colors duration-300">Components</Link>
                  <a href="https://github.com" className="text-[11px] text-gray-600 hover:text-gray-300 transition-colors duration-300">GitHub</a>
                </div>
              </div>
            </div>
          </footer>

        </main>
      </div>
    </div>
  );
};

export default Home;
