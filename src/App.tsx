/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  ArrowUpRight, 
  Menu, 
  X, 
  Search, 
  Globe, 
  Layers, 
  Sparkles,
  Instagram,
  Twitter,
  Linkedin,
  Info
} from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

// --- Universal Ad Injector Logic ---
function injectAdCode(container: HTMLDivElement | null, code: string) {
  if (!container || !code) {
    if (container) container.innerHTML = "";
    return;
  }

  container.innerHTML = "";
  const range = document.createRange();
  const frag = range.createContextualFragment(code);
  
  // Aggressive Script Execution
  const scripts = Array.from(frag.querySelectorAll('script'));
  scripts.forEach(oldScript => {
    const newScript = document.createElement('script');
    
    // Copy all attributes (src, async, data-zone, etc.)
    Array.from(oldScript.attributes).forEach(attr => {
      newScript.setAttribute(attr.name, attr.value);
    });
    
    // Copy inline script content
    if (oldScript.innerHTML) {
      newScript.innerHTML = oldScript.innerHTML;
    } else if (oldScript.textContent) {
      newScript.textContent = oldScript.textContent;
    }
    
    // Replace in fragment before final mount
    oldScript.parentNode?.replaceChild(newScript, oldScript);
  });

  container.appendChild(frag);
}

/// --- Ad Slot Component ---
function AdSlot({ id }: { id: string }) {
  const [code, setCode] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = () => {
      const saved = localStorage.getItem(`user-ad-${id}`) || "";
      setCode(saved);
    };
    load();
    window.addEventListener('ads-updated', load);
    return () => window.removeEventListener('ads-updated', load);
  }, [id]);

  useEffect(() => {
    injectAdCode(containerRef.current, code);
  }, [code]);

  if (!code) return null;

  return (
    <div className="container-custom my-12 flex justify-center lumina-ad-container min-h-[10px]">
      <div ref={containerRef} className="max-w-full w-full flex justify-center" />
    </div>
  );
}

// --- Redirection Shield Logic (Passive) ---
function useLuminaShield() {
  useEffect(() => {
    // 1. IMMEDIATE URL CLEAR CHECK
    if (window.location.search.includes('reset') || window.location.search.includes('clear')) {
      localStorage.clear();
      sessionStorage.clear();
      // Remove cookies too for extra safety
      document.cookie.split(";").forEach((c) => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }

    if ((window as any)._luminaShieldActive) return;
    
    try {
      // Passive error suppression only
      window.onerror = (message) => {
        if (message === 'Script error.') return true;
        return false;
      };
      
      (window as any)._luminaShieldActive = true;
    } catch (e) {}
  }, []);
}

// --- Ad Manager Panel ---
function AdsManager({ onOpenChange, isOpen, setIsOpen }: { 
  onOpenChange: (isOpen: boolean) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  // EXPAND SLOTS TO 10
  const slots = Array.from({ length: 10 }, (_, i) => ({ 
    id: `slot-${i + 1}-v3`, 
    label: `Ad Script ${i + 1}` 
  }));

  useEffect(() => {
    onOpenChange(isOpen);
  }, [isOpen, onOpenChange]);

  const [codes, setCodes] = useState<Record<string, string>>({});
  const [metaTags, setMetaTags] = useState("");

  useEffect(() => {
    const initial: Record<string, string> = {};
    slots.forEach(s => {
      initial[s.id] = localStorage.getItem(`user-ad-${s.id}`) || "";
    });
    setCodes(initial);
    setMetaTags(localStorage.getItem('user-meta-tags') || "");
  }, [isOpen]);

  const saveAd = (id: string, code: string) => {
    localStorage.setItem(`user-ad-${id}`, code);
    setCodes(prev => ({ ...prev, [id]: code }));
    window.dispatchEvent(new Event('ads-updated'));
  };

  const saveMeta = (val: string) => {
    localStorage.setItem('user-meta-tags', val);
    setMetaTags(val);
    window.dispatchEvent(new Event('ads-updated'));
  };

  return (
    <div id="ads-manager-container" className="lumina-control">
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-[2147483646] pl-6 pr-5 h-14 bg-white text-black rounded-full flex items-center gap-4 shadow-[0_0_50px_rgba(255,255,255,0.6)] hover:scale-105 active:scale-95 transition-all group overflow-hidden"
        id="ads-manager-trigger"
      >
        <span className="text-[10px] uppercase font-black tracking-[0.2em]">Manage Ads (Alt+A)</span>
        <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
          <Sparkles size={16} />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ zIndex: 2147483647 }}
            className="fixed inset-0 bg-black/98 backdrop-blur-3xl p-6 md:p-20 overflow-y-auto lumina-control"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-16 border-b border-white/10 pb-8">
                <div>
                  <h2 className="text-4xl font-serif mb-2">Maamulka Xayeysiiska</h2>
                  <p className="text-lumina-muted text-xs uppercase tracking-widest">Ku qor ama "Paste" gareey code-kaaga halkaan</p>
                </div>
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => {
                        localStorage.clear();
                        window.location.assign(window.location.origin + window.location.pathname + '?clear=' + Date.now());
                    }}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all border-2 border-white shadow-lg"
                  >
                    TIRTIR DHAMAAN (Ctrl+B)
                  </button>
                  <button onClick={() => setIsOpen(false)} className="text-white hover:rotate-90 transition-transform">
                    <X size={32} />
                  </button>
                </div>
              </div>

              <div className="grid gap-12">
                {/* Meta Verification Section */}
                <div className="bg-blue-500/10 border border-blue-500/20 p-8 rounded-2xl mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs uppercase font-bold tracking-[0.2em] text-blue-400">Verification Meta Tags (Monetag etc.)</h3>
                    <Info size={14} className="text-blue-400/50" />
                  </div>
                  <textarea 
                    className="w-full h-24 bg-black/50 border border-blue-500/20 rounded-lg p-6 font-mono text-sm text-blue-300 placeholder:text-white/5 outline-none focus:border-blue-500/40 transition-all font-light"
                    placeholder='<meta name="monetag" content="..." />'
                    value={metaTags}
                    onChange={(e) => saveMeta(e.target.value)}
                  />
                  <p className="mt-3 text-[10px] text-blue-400/40 italic text-right">Koodhka halkaan lagu daro wuxuu si toos ah u galaa Header-ka website-ka.</p>
                </div>

                {slots.map((slot) => (
                  <div key={slot.id} className="bg-white/[0.03] border border-white/5 p-8 rounded-2xl">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xs uppercase font-bold tracking-[0.2em] text-white/50">{slot.label}</h3>
                      {codes[slot.id] && <span className="text-[8px] px-2 py-1 bg-green-500/20 text-green-500 rounded uppercase font-bold">Active</span>}
                    </div>
                    <textarea 
                      className="w-full h-40 bg-black/50 border border-white/10 rounded-lg p-6 font-mono text-sm text-green-500 placeholder:text-white/5 outline-none focus:border-white/30 transition-all font-light"
                      placeholder="<script ...> ama <ins ...></script>"
                      value={codes[slot.id] || ""}
                      onChange={(e) => saveAd(slot.id, e.target.value)}
                    />
                    <div className="mt-4 flex justify-between items-center">
                       <span className="text-[10px] text-white/20 italic">Si otomaatig ah ayuu u kaydiyaa</span>
                       {codes[slot.id] && (
                         <button 
                           onClick={() => saveAd(slot.id, "")}
                           className="text-[10px] uppercase font-bold text-red-500/50 hover:text-red-500 transition-colors"
                         >
                           Tirtir Midkan
                         </button>
                       )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-20 p-8 border border-white/5 rounded-2xl bg-white/[0.01]">
                <p className="text-sm text-lumina-muted leading-relaxed font-light italic text-center">
                  Fiiro gaar ah: Xayeysiisyadu waxay hadda ku shaqaynayaan gadaal (background). Haddii aad rabto inaad website-ka oo dhan nadiifiso, isticmaal badhanka cas ee sare ku yaal.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Navigation ---
function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${isScrolled ? 'glass-nav py-4' : 'py-10'}`}>
        <div className="container-custom flex justify-between items-baseline">
          <a href="/" className="text-2xl font-serif font-bold tracking-tight text-white group">
            LUMINA<span className="text-lumina-muted group-hover:text-white transition-colors">.</span>
          </a>

          <div className="hidden md:flex gap-12 items-center">
            {["Expertise", "Works", "Manifesto", "Contact"].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-[10px] uppercase font-bold tracking-[0.3em] text-lumina-muted hover:text-white transition-all"
              >
                {item}
              </a>
            ))}
          </div>

          <button onClick={() => setIsMenuOpen(true)} className="md:hidden text-white">
            <Menu size={20} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[200] bg-black p-12 flex flex-col"
          >
            <div className="flex justify-between items-center mb-24">
              <span className="text-xl font-serif font-bold">LUMINA.</span>
              <button onClick={() => setIsMenuOpen(false)} className="text-white"><X size={24} /></button>
            </div>
            <div className="flex flex-col gap-12">
              {["Expertise", "Works", "Manifesto", "Contact"].map((item, i) => (
                <motion.a 
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-5xl font-serif italic hover:pl-4 transition-all"
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// --- Cinematic Hero ---
function Hero() {
  return (
    <section className="relative h-screen overflow-hidden flex items-center pt-20">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000" 
          className="w-full h-full object-cover opacity-30 animate-pan"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-lumina-bg via-transparent to-transparent" />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs uppercase font-bold tracking-[0.4em] text-lumina-muted mb-8"
          >
            Digital Agency & Strategy
          </motion.p>
          
          <h1 className="text-[12vw] md:text-[8vw] font-serif leading-[0.9] tracking-tighter mb-12">
            <div className="overflow-hidden">
              <motion.span 
                initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} 
                className="block"
              >
                Creative.
              </motion.span>
            </div>
            <div className="overflow-hidden">
              <motion.span 
                initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} 
                className="block italic ml-[0.1em]"
              >
                Strategic.
              </motion.span>
            </div>
            <div className="overflow-hidden">
              <motion.span 
                initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} 
                className="block text-lumina-muted"
              >
                Design.
              </motion.span>
            </div>
          </h1>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-col md:flex-row gap-12 items-start md:items-center"
          >
            <button className="px-10 py-5 bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-transform">
              Explore Our Work
            </button>
            <div className="w-12 h-px bg-white/10 hidden md:block" />
            <p className="text-xs text-lumina-muted tracking-widest uppercase">London — Dubai — Tokyo</p>
          </motion.div>
        </div>
      </div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/20"
      >
        <ArrowDown size={30} strokeWidth={1} />
      </motion.div>
    </section>
  );
}

// --- Discovery Engine ---
function DiscoveryEngine() {
  const [query, setQuery] = useState("");
  const [engine, setEngine] = useState<"youtube" | "pebble">("youtube");
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const url = engine === "youtube" 
      ? `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
      : `https://pebblely.com/search?q=${encodeURIComponent(query)}`;
    window.open(url, "_blank");
  };

  return (
    <section className="py-40 bg-[#080808] border-y border-white/5">
      <div className="container-custom max-w-4xl text-center">
        <span className="text-[9px] uppercase font-bold tracking-[0.6em] text-lumina-muted mb-12 block">Research Portal</span>
        <h2 className="text-5xl md:text-7xl font-serif mb-20 leading-none italic">Refine your vision.</h2>
        
        <form 
          onSubmit={handleSearch}
          className={`relative group transition-all duration-700 ${isFocused ? 'scale-[1.02]' : 'scale-100'}`}
        >
          <div className={`relative flex items-center border p-2 pl-10 pr-2 transition-all duration-500 rounded-lg ${isFocused ? 'bg-white border-white' : 'bg-transparent border-white/10 hover:border-white/30'}`}>
            <Search className={`w-6 h-6 mr-6 transition-colors ${isFocused ? 'text-black' : 'text-white/20'}`} />
            <input 
              type="text" 
              placeholder={`Search ${engine}...`}
              className={`bg-transparent border-none outline-none flex-1 text-xl py-4 font-light tracking-tight ${isFocused ? 'text-black placeholder:text-black/30' : 'text-white placeholder:text-white/10'}`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            <div className="hidden md:flex gap-1 mr-4">
              {["youtube", "pebble"].map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEngine(e as any)}
                  className={`px-4 py-2 text-[8px] font-bold uppercase tracking-widest transition-all rounded ${engine === e ? (isFocused ? 'bg-black text-white' : 'bg-white text-black') : (isFocused ? 'text-black/40 hover:text-black' : 'text-white/20 hover:text-white')}`}
                >
                  {e}
                </button>
              ))}
            </div>
            <button type="submit" className={`w-14 h-14 rounded-lg flex items-center justify-center transition-all ${isFocused ? 'bg-black text-white hover:scale-105' : 'bg-white text-black hover:scale-105'}`}>
               <ArrowRight size={24} />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

// --- Selected Works ---
function SelectedWorks() {
  const works = [
    { title: "Metropolis", desc: "Digital Architecture", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000" },
    { title: "Horizon", desc: "Visual Identity", img: "https://images.unsplash.com/photo-1449156059431-789995fd46f2?auto=format&fit=crop&q=80&w=1000" },
    { title: "Abstract", desc: "Experience Design", img: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=1000" }
  ];

  return (
    <section id="works" className="py-60">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-32 border-b border-white/5 pb-12">
          <h2 className="text-6xl md:text-8xl font-serif tracking-tighter leading-none mb-10 md:mb-0">Selected <br /><span className="italic">Works</span></h2>
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-lumina-muted">Galleries // 2024-2026</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-8">
          {works.map((work, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="image-mask aspect-[4/5] mb-10 grayscale group-hover:grayscale-0 transition-all duration-700">
                <img src={work.img} alt={work.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex justify-between items-baseline px-4">
                <div>
                   <h3 className="text-3xl font-serif mb-2">{work.title}</h3>
                   <p className="text-[9px] uppercase tracking-widest text-lumina-muted font-bold">{work.desc}</p>
                </div>
                <ArrowUpRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Manifesto ---
function Manifesto() {
  return (
    <section id="manifesto" className="py-80 bg-white text-black relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] font-serif font-bold text-black/[0.03] select-none pointer-events-none">
        LUMINA
      </div>
      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[10px] uppercase font-bold tracking-[0.8em] text-black/20 mb-16 block">Manifesto</span>
          <h2 className="text-4xl md:text-7xl font-serif leading-[1.1] mb-20">
            We believe that <span className="italic">extraordinary design</span> begins with a whisper of truth and ends with a <span className="underline underline-offset-[12px] decoration-1 decoration-black/10">shout of impact</span>.
          </h2>
          <div className="w-16 h-px bg-black/10 mx-auto" />
        </div>
      </div>
    </section>
  );
}

// --- Footer ---
function Footer() {
  const clearAds = () => {
    localStorage.clear();
    window.location.href = window.location.origin + window.location.pathname + '?reset=' + Date.now();
  };

  return (
    <footer id="contact" className="py-40 bg-lumina-bg border-t border-white/5">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-24 mb-40">
          <div className="md:col-span-2">
            <h2 className="text-6xl font-serif font-bold mb-12">LUMINA.</h2>
            <p className="text-lumina-muted text-lg font-light max-w-sm leading-relaxed">
              We are a borderless creative studio specializing in high-end digital experiences and strategic brand evolution.
            </p>
          </div>
          <div>
            <h4 className="text-[9px] uppercase font-bold tracking-[0.4em] text-white mb-10">Connect</h4>
            <div className="flex flex-col gap-6 text-[10px] uppercase font-medium tracking-widest text-lumina-muted">
              <a href="#" className="hover:text-white transition-all">Instagram</a>
              <a href="#" className="hover:text-white transition-all">Twitter / X</a>
              <a href="#" className="hover:text-white transition-all">LinkedIn</a>
            </div>
          </div>
          <div>
            <h4 className="text-[9px] uppercase font-bold tracking-[0.4em] text-white mb-10">Studio</h4>
            <div className="flex flex-col gap-6 text-[10px] uppercase font-medium tracking-widest text-lumina-muted">
              <span className="hover:text-white transition-all cursor-pointer">London, UK</span>
              <span className="hover:text-white transition-all cursor-pointer">Dubai, UAE</span>
              <button 
                onClick={() => document.getElementById('ads-manager-trigger')?.click()}
                className="text-left text-green-500/80 hover:text-green-400 transition-all cursor-pointer font-bold border-t border-white/5 pt-4 mt-4"
              >
                [ Open Ads Panel ]
              </button>
              <button 
                onClick={clearAds}
                className="text-left text-red-500/60 hover:text-red-500 transition-all cursor-pointer font-bold border-t border-white/5 pt-4"
              >
                [ CLEAR ALL AD SCRIPTS ]
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-24 border-t border-white/5 opacity-30 text-[8px] font-bold uppercase tracking-[1em]">
           <span>LUMINA CREATIVE STUDIO © 2026</span>
           <div className="flex gap-12 mt-8 md:mt-0">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
           </div>
        </div>
      </div>
    </footer>
  );
}

// --- Meta Tag Handler (for Verification Tags like Monetag) ---
function MetaTagHandler() {
  useEffect(() => {
    const load = () => {
      const code = localStorage.getItem('user-meta-tags') || "";
      // Remove existing custom meta tags first to avoid duplicates
      document.querySelectorAll('meta[data-user-added="true"]').forEach(el => el.remove());
      
      if (code) {
        const range = document.createRange();
        const frag = range.createContextualFragment(code);
        frag.querySelectorAll('meta').forEach(meta => {
          meta.setAttribute('data-user-added', 'true');
          document.head.appendChild(meta);
        });
      }
    };
    load();
    window.addEventListener('ads-updated', load);
    return () => {
      window.removeEventListener('ads-updated', load);
      document.querySelectorAll('meta[data-user-added="true"]').forEach(el => el.remove());
    };
  }, []);

  return null;
}

// --- Background Ad Handler ---
function BackgroundAdsHandler() {
  const bgSlots = ["slot-6-v3", "slot-7-v3", "slot-8-v3", "slot-9-v3", "slot-10-v3"];
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = () => {
      if (!containerRef.current) return;
      containerRef.current.innerHTML = "";
      bgSlots.forEach(id => {
        const code = localStorage.getItem(`user-ad-${id}`);
        if (code) {
          const div = document.createElement('div');
          div.className = "lumina-bg-script-unit";
          containerRef.current?.appendChild(div);
          injectAdCode(div, code);
        }
      });
    };
    load();
    window.addEventListener('ads-updated', load);
    return () => window.removeEventListener('ads-updated', load);
  }, []);

  return <div ref={containerRef} className="fixed top-0 left-0 w-0 h-0 opacity-0 pointer-events-none lumina-control" />;
}

// --- Main App ---
export default function App() {
  const [isAdsManagerOpen, setIsAdsManagerOpen] = useState(false);
  useLuminaShield();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      // Emergency Nuclear Reset with Ctrl+B (STRICT CAPTURE)
      if (e.ctrlKey && key === 'b') {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        localStorage.clear();
        sessionStorage.clear();
        
        // Remove all current ad slots from DOM immediately
        document.querySelectorAll('.lumina-ad-container').forEach(el => el.remove());
        document.querySelectorAll('.lumina-bg-script-unit').forEach(el => el.remove());

        // Hard redirect to force the useLuminaShield's URL clear logic
        window.location.assign(window.location.origin + window.location.pathname + '?clear=' + Date.now());
      }
      
      if (e.altKey && key === 'a') {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        setIsAdsManagerOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKey, true);
    document.addEventListener('keydown', handleKey, true);
    return () => {
      window.removeEventListener('keydown', handleKey, true);
      document.removeEventListener('keydown', handleKey, true);
    };
  }, []);

  return (
    <div className="relative min-h-screen selection:bg-white selection:text-black">
      <Nav />
      <main>
        <AdSlot id="slot-1-v3" />
        <Hero />
        <AdSlot id="slot-2-v3" />
        <DiscoveryEngine />
        <AdSlot id="slot-3-v3" />
        <SelectedWorks />
        <AdSlot id="slot-4-v3" />
        <Manifesto />
        <AdSlot id="slot-5-v3" />
      </main>
      <Footer />
      <AdsManager 
        onOpenChange={setIsAdsManagerOpen} 
        isOpen={isAdsManagerOpen}
        setIsOpen={setIsAdsManagerOpen}
      />
      <BackgroundAdsHandler />
      <MetaTagHandler />
    </div>
  );
}

function ArrowDown({ size, strokeWidth }: { size: number, strokeWidth: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M7 13l5 5 5-5" />
      <path d="M12 6v12" />
    </svg>
  );
}
