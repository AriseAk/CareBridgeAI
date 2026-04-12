import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { Sun, Moon } from 'lucide-react'; // Make sure lucide-react is installed

const Navbar = ({
  className = '',
  ease = 'expo.out',
  isLightMode, // Received from App
  toggleTheme, // Received from App
  onMobileMenuClick,
  initialLoadAnimation = true
}) => {
  const location = useLocation();
  const activeHref = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const items = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Hospital', href: '/hospital' }
  ];

  const circleRefs = useRef([]);
  const tlRefs = useRef([]);
  const activeTweenRefs = useRef([]);
  const logoDotRef = useRef(null);
  const logoTweenRef = useRef(null);
  const hamburgerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navItemsRef = useRef(null);
  const logoRef = useRef(null);
  const mobileMenuItemsRef = useRef([]);

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach(circle => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`
        });

        const label = pill.querySelector('.pill-label');
        const white = pill.querySelector('.pill-label-hover');

        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        const index = circleRefs.current.indexOf(circle);
        if (index === -1) return;

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });

        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 0.6, ease, overwrite: 'auto' }, 0);

        if (label) {
          tl.to(label, { y: -(h + 8), duration: 0.6, ease, overwrite: 'auto' }, 0);
        }

        if (white) {
          gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(white, { y: 0, opacity: 1, duration: 0.6, ease, overwrite: 'auto' }, 0);
        }

        tlRefs.current[index] = tl;
      });
    };

    layout();

    const onResize = () => layout();
    window.addEventListener('resize', onResize);

    if (document.fonts?.ready) {
      document.fonts.ready.then(layout).catch(() => {});
    }

    const menu = mobileMenuRef.current;
    if (menu) {
      gsap.set(menu, { visibility: 'hidden', opacity: 0, scaleY: 0.95, y: -10 });
    }

    if (initialLoadAnimation) {
      const logo = logoRef.current;
      const navItems = navItemsRef.current;

      if (logo) {
        gsap.set(logo, { scale: 0.8, opacity: 0, y: -20 });
        gsap.to(logo, { scale: 1, opacity: 1, y: 0, duration: 1, ease: 'back.out(1.5)', delay: 0.2 });
      }

      if (navItems) {
        gsap.set(navItems, { opacity: 0, y: -20 });
        gsap.to(navItems, { opacity: 1, y: 0, duration: 1, ease: 'back.out(1.5)', delay: 0.3 });
      }
    }

    return () => window.removeEventListener('resize', onResize);
  }, [items, ease, initialLoadAnimation]);

  const handleEnter = i => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.4,
      ease,
      overwrite: 'auto'
    });
  };

  const handleLeave = i => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.3,
      ease: 'power3.inOut',
      overwrite: 'auto'
    });
  };

  const handleLogoEnter = () => {
    const dot = logoDotRef.current;
    if (!dot) return;
    logoTweenRef.current?.kill();
    gsap.set(dot, { scale: 1, rotate: 0 });
    logoTweenRef.current = gsap.to(dot, {
      scale: 1.8,
      rotate: 180,
      yoyo: true,
      repeat: 1,
      duration: 0.3,
      ease: 'power2.inOut',
      overwrite: 'auto',
      boxShadow: '0 0 10px rgba(192,132,252,0.8)'
    });
  };

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);

    const hamburger = hamburgerRef.current;
    const menu = mobileMenuRef.current;
    const items = mobileMenuItemsRef.current;

    if (hamburger) {
      const lines = hamburger.querySelectorAll('.hamburger-line');
      if (newState) {
        gsap.to(lines[0], { rotation: 45, y: 4, duration: 0.4, ease: 'back.out(1.5)' });
        gsap.to(lines[1], { rotation: -45, y: -4, duration: 0.4, ease: 'back.out(1.5)' });
      } else {
        gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease: 'power3.inOut' });
        gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease: 'power3.inOut' });
      }
    }

    if (menu) {
      if (newState) {
        gsap.set(menu, { visibility: 'visible' });
        gsap.fromTo(
          menu,
          { opacity: 0, y: -10, scaleY: 0.95 },
          { opacity: 1, y: 0, scaleY: 1, duration: 0.4, ease, transformOrigin: 'top center' }
        );
        // Added Stagger for Mobile Items
        gsap.fromTo(
          items,
          { opacity: 0, x: -10 },
          { opacity: 1, x: 0, duration: 0.4, stagger: 0.05, ease, delay: 0.1 }
        );
      } else {
        gsap.to(menu, {
          opacity: 0,
          y: -10,
          scaleY: 0.95,
          duration: 0.3,
          ease: 'power3.inOut',
          transformOrigin: 'top center',
          onComplete: () => {
            gsap.set(menu, { visibility: 'hidden' });
          }
        });
      }
    }

    onMobileMenuClick?.();
  };

  const isExternalLink = href =>
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('//') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('#');

  const isRouterLink = href => href && !isExternalLink(href);

  const cssVars = {
    '--base': isLightMode ? '#f8fafc' : '#020617',
    '--pill-bg': isLightMode ? 'rgba(241, 245, 249, 0.6)' : 'rgba(30, 41, 59, 0.4)',
    '--pill-text': isLightMode ? '#475569' : '#94a3b8',
    '--hover-text': isLightMode ? '#0891b2' : '#22d3ee',
    '--nav-h': '52px',
    '--pill-pad-x': '20px',
    '--pill-gap': '6px'
  };

  return (
    <div className="pt-6 relative top-0 z-[1000] w-full left-0 flex justify-center px-4">
      <nav
        className={`w-full md:w-max flex items-center justify-between md:justify-start box-border ${className}`}
        aria-label="Primary"
        style={cssVars}
      >
        {/* Logo Section - Preserved Purple Glow */}
        <Link
          to="/"
          onMouseEnter={handleLogoEnter}
          ref={el => { logoRef.current = el; }}
          className={`rounded-full px-6 inline-flex items-center justify-center overflow-hidden transition-all duration-500 border backdrop-blur-xl ${
            isLightMode 
              ? 'border-black/5 bg-white/60 shadow-[0_0_20px_rgba(168,85,247,0.1)] hover:border-purple-500/30' 
              : 'border-white/5 bg-slate-900/60 shadow-[0_0_20px_rgba(192,132,252,0.1)] hover:border-purple-500/30'
          }`}
          style={{ height: 'var(--nav-h)' }}
        >
          <span className={`text-xl font-bold bg-clip-text text-transparent tracking-tight ${
            isLightMode ? 'bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-500' : 'bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300'
          }`}>
            CareBridge<span className={isLightMode ? "text-purple-600" : "text-purple-400"}>AI</span>
          </span>
          <div ref={logoDotRef} className={`ml-2 w-2 h-2 rounded-full ${isLightMode ? 'bg-gradient-to-r from-cyan-500 to-purple-500' : 'bg-gradient-to-r from-cyan-400 to-purple-400'}`}></div>
        </Link>

        {/* Desktop Menu - Cyan Glow & Glassmorphism */}
        <div
          ref={navItemsRef}
          className={`relative items-center rounded-full hidden md:flex ml-3 transition-all duration-500 border backdrop-blur-xl ${
            isLightMode 
              ? 'border-black/5 bg-white/60 shadow-[0_0_20px_rgba(8,145,178,0.1)] hover:border-cyan-500/30' 
              : 'border-white/5 bg-slate-900/60 shadow-[0_0_20px_rgba(34,211,238,0.1)] hover:border-cyan-500/30'
          }`}
          style={{ height: 'var(--nav-h)' }}
        >
          <ul
            role="menubar"
            className="list-none flex items-stretch m-0 p-[5px] h-full"
            style={{ gap: 'var(--pill-gap)' }}
          >
            {items.map((item, i) => {
              const isActive = activeHref === item.href;

              const pillStyle = {
                background: isActive ? 'rgba(34, 211, 238, 0.1)' : 'transparent',
                color: isActive ? 'var(--hover-text)' : 'var(--pill-text)',
                paddingLeft: 'var(--pill-pad-x)',
                paddingRight: 'var(--pill-pad-x)'
              };

              const PillContent = (
                <>
                  <span
                    className="hover-circle absolute left-1/2 bottom-0 rounded-full z-[1] block pointer-events-none"
                    style={{
                      background: 'rgba(34, 211, 238, 0.15)', // Changed from solid base to a glowing cyan fill
                      willChange: 'transform'
                    }}
                    aria-hidden="true"
                    ref={el => { circleRefs.current[i] = el; }}
                  />
                  <span className="label-stack relative inline-block leading-[1] z-[2]">
                    <span
                      className="pill-label relative z-[2] inline-block leading-[1]"
                      style={{ willChange: 'transform' }}
                    >
                      {item.label}
                    </span>
                    <span
                      className="pill-label-hover absolute left-0 top-0 z-[3] inline-block font-semibold drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                      style={{
                        color: 'var(--hover-text)',
                        willChange: 'transform, opacity'
                      }}
                      aria-hidden="true"
                    >
                      {item.label}
                    </span>
                  </span>
                  {isActive && (
                    <span
                      className="absolute left-1/2 bottom-[4px] -translate-x-1/2 w-1.5 h-1.5 rounded-full z-[4] bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                      aria-hidden="true"
                    />
                  )}
                </>
              );

              const basePillClasses =
                'relative overflow-hidden inline-flex items-center justify-center h-full no-underline rounded-full box-border font-medium text-[14px] leading-[0] tracking-[0.3px] whitespace-nowrap cursor-pointer px-0 transition-colors duration-300 hover:bg-slate-800/50';

              return (
                <li key={item.href} role="none" className="flex h-full">
                  {isRouterLink(item.href) ? (
                    <Link
                      role="menuitem"
                      to={item.href}
                      className={basePillClasses}
                      style={pillStyle}
                      aria-label={item.label}
                      onMouseEnter={() => handleEnter(i)}
                      onMouseLeave={() => handleLeave(i)}
                    >
                      {PillContent}
                    </Link>
                  ) : (
                    <a
                      role="menuitem"
                      href={item.href}
                      className={basePillClasses}
                      style={pillStyle}
                      aria-label={item.label}
                      onMouseEnter={() => handleEnter(i)}
                      onMouseLeave={() => handleLeave(i)}
                    >
                      {PillContent}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <button
          onClick={toggleTheme}
          className={`ml-auto md:ml-3 rounded-full flex items-center justify-center p-0 transition-all duration-500 border backdrop-blur-xl ${
            isLightMode 
              ? 'border-black/5 bg-white/60 text-slate-600 hover:text-cyan-600' 
              : 'border-white/5 bg-slate-900/60 text-slate-300 hover:text-cyan-300'
          }`}
          style={{ width: 'var(--nav-h)', height: 'var(--nav-h)' }}
        >
          {isLightMode ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* Mobile Toggle Hamburger */}
        <button
          ref={hamburgerRef}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
          className="md:hidden rounded-full flex flex-col items-center justify-center gap-1.5 cursor-pointer p-0 relative ml-auto transition-all duration-500 border border-white/5 bg-slate-900/60 backdrop-blur-xl shadow-[0_0_20px_rgba(34,211,238,0.1)] hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]"
          style={{ width: 'var(--nav-h)', height: 'var(--nav-h)' }}
        >
          <span
            className="hamburger-line w-4 h-[2px] rounded origin-center"
            style={{ background: 'var(--hover-text)' }}
          />
          <span
            className="hamburger-line w-4 h-[2px] rounded origin-center"
            style={{ background: 'var(--hover-text)' }}
          />
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      <div
        ref={mobileMenuRef}
        className="md:hidden absolute top-[4.5rem] left-4 right-4 rounded-3xl z-[998] origin-top overflow-hidden border border-white/10 bg-slate-900/90 backdrop-blur-2xl shadow-[0_20px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(192,132,252,0.15)]"
        style={cssVars}
      >
        <ul className="list-none m-0 p-[6px] flex flex-col gap-[4px]">
          {items.map((item, i) => {
            const isActive = activeHref === item.href;
            
            const linkClasses = `block py-4 px-6 text-[15px] font-medium rounded-[20px] transition-all duration-300 ease-out border border-transparent ${
              isActive 
              ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20' 
              : 'text-slate-300 hover:bg-slate-800/80 hover:text-cyan-200 hover:border-white/5'
            }`;

            return (
              <li key={item.href} ref={el => { mobileMenuItemsRef.current[i] = el; }}>
                {isRouterLink(item.href) ? (
                  <Link
                    to={item.href}
                    className={linkClasses}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    href={item.href}
                    className={linkClasses}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;