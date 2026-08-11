"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────
   Pupil — a small dot inside an EyeBall that
   tracks the mouse (or can be force-aimed).
   ───────────────────────────────────────────── */
interface PupilProps {
  size?: number;
  maxDistance?: number;
  pupilColor?: string;
  forceLookX?: number;
  forceLookY?: number;
  mouseX: number;
  mouseY: number;
}

function Pupil({
  size = 12,
  maxDistance = 5,
  pupilColor = "currentColor",
  forceLookX,
  forceLookY,
  mouseX,
  mouseY,
}: PupilProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const updateRect = () => {
      if (ref.current) setRect(ref.current.getBoundingClientRect());
    };
    updateRect();
    window.addEventListener("resize", updateRect, { passive: true });
    window.addEventListener("scroll", updateRect, { passive: true });
    return () => {
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect);
    };
  }, []);

  const pos = (() => {
    if (forceLookX !== undefined && forceLookY !== undefined)
      return { x: forceLookX, y: forceLookY };
    if (!rect) return { x: 0, y: 0 };
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = mouseX - cx;
    const dy = mouseY - cy;
    const dist = Math.min(Math.sqrt(dx * dx + dy * dy), maxDistance);
    const angle = Math.atan2(dy, dx);
    return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist };
  })();

  return (
    <div
      ref={ref}
      className="rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: pupilColor,
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: "transform 0.1s ease-out",
      }}
    />
  );
}

/* ─────────────────────────────────────────────
   EyeBall — a white oval that contains a Pupil.
   Collapses to a thin line when blinking.
   ───────────────────────────────────────────── */
interface EyeBallProps {
  size?: number;
  pupilSize?: number;
  maxDistance?: number;
  eyeColor?: string;
  pupilColor?: string;
  isBlinking?: boolean;
  forceLookX?: number;
  forceLookY?: number;
  mouseX: number;
  mouseY: number;
}

function EyeBall({
  size = 48,
  pupilSize = 16,
  maxDistance = 10,
  eyeColor = "white",
  pupilColor = "#1a1a1a",
  isBlinking = false,
  forceLookX,
  forceLookY,
  mouseX,
  mouseY,
}: EyeBallProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const updateRect = () => {
      if (ref.current) setRect(ref.current.getBoundingClientRect());
    };
    updateRect();
    window.addEventListener("resize", updateRect, { passive: true });
    window.addEventListener("scroll", updateRect, { passive: true });
    return () => {
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect);
    };
  }, []);

  const pos = (() => {
    if (forceLookX !== undefined && forceLookY !== undefined)
      return { x: forceLookX, y: forceLookY };
    if (!rect) return { x: 0, y: 0 };
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = mouseX - cx;
    const dy = mouseY - cy;
    const dist = Math.min(Math.sqrt(dx * dx + dy * dy), maxDistance);
    const angle = Math.atan2(dy, dx);
    return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist };
  })();

  return (
    <div
      ref={ref}
      className="rounded-full flex items-center justify-center"
      style={{
        width: size,
        height: isBlinking ? 2 : size,
        backgroundColor: eyeColor,
        overflow: "hidden",
        transition: "height 0.12s ease-in-out",
      }}
    >
      {!isBlinking && (
        <div
          className="rounded-full"
          style={{
            width: pupilSize,
            height: pupilSize,
            backgroundColor: pupilColor,
            transform: `translate(${pos.x}px, ${pos.y}px)`,
            transition: "transform 0.1s ease-out",
          }}
        />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   AnimatedCharacters — the full composition
   ───────────────────────────────────────────── */
export interface AnimatedCharactersProps {
  /** Is any text input currently focused? */
  isTyping?: boolean;
  /** Current password value length */
  passwordLength?: number;
  /** Is the password visible (eye toggled)? */
  showPassword?: boolean;
  /** Respect reduced-motion preference */
  reducedMotion?: boolean;
}

export function AnimatedCharacters({
  isTyping = false,
  passwordLength = 0,
  showPassword = false,
  reducedMotion = false,
}: AnimatedCharactersProps) {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  // Blinking state per character
  const [blink1, setBlink1] = useState(false);
  const [blink2, setBlink2] = useState(false);

  // Characters peeking / looking at each other
  const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false);
  const [isPeeking, setIsPeeking] = useState(false);

  // Refs for position calculation
  const char1Ref = useRef<HTMLDivElement>(null);
  const char2Ref = useRef<HTMLDivElement>(null);
  const char3Ref = useRef<HTMLDivElement>(null);
  const char4Ref = useRef<HTMLDivElement>(null);

  // Cached bounding rects for characters to prevent layout thrashing
  const [rects, setRects] = useState<{ [key: string]: DOMRect | null }>({
    c1: null,
    c2: null,
    c3: null,
    c4: null,
  });

  useEffect(() => {
    const updateRects = () => {
      setRects({
        c1: char1Ref.current?.getBoundingClientRect() || null,
        c2: char2Ref.current?.getBoundingClientRect() || null,
        c3: char3Ref.current?.getBoundingClientRect() || null,
        c4: char4Ref.current?.getBoundingClientRect() || null,
      });
    };
    updateRects();
    window.addEventListener("resize", updateRects, { passive: true });
    return () => window.removeEventListener("resize", updateRects);
  }, []);

  const passwordVisible = passwordLength > 0 && showPassword;
  const passwordHidden = passwordLength > 0 && !showPassword;

  // Throttled mouse tracking
  useEffect(() => {
    if (reducedMotion) return;
    let ticking = false;
    const onMove = (e: MouseEvent) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setMouseX(e.clientX);
          setMouseY(e.clientY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reducedMotion]);

  // Blinking — character 1 (tall orange)
  useEffect(() => {
    if (reducedMotion) return;
    let timeout: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timeout = setTimeout(() => {
        setBlink1(true);
        setTimeout(() => {
          setBlink1(false);
          schedule();
        }, 150);
      }, 3000 + Math.random() * 4000);
    };
    schedule();
    return () => clearTimeout(timeout);
  }, [reducedMotion]);

  // Blinking — character 2 (dark)
  useEffect(() => {
    if (reducedMotion) return;
    let timeout: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timeout = setTimeout(() => {
        setBlink2(true);
        setTimeout(() => {
          setBlink2(false);
          schedule();
        }, 150);
      }, 3000 + Math.random() * 4000);
    };
    schedule();
    return () => clearTimeout(timeout);
  }, [reducedMotion]);

  // Look at each other when typing
  useEffect(() => {
    if (isTyping) {
      setIsLookingAtEachOther(true);
      const timer = setTimeout(() => setIsLookingAtEachOther(false), 800);
      return () => clearTimeout(timer);
    }
    setIsLookingAtEachOther(false);
  }, [isTyping]);

  // Peeking at password when it's visible
  useEffect(() => {
    if (passwordVisible) {
      const schedPeek = () => {
        const t = setTimeout(() => {
          setIsPeeking(true);
          setTimeout(() => setIsPeeking(false), 800);
        }, 2000 + Math.random() * 3000);
        return t;
      };
      const t = schedPeek();
      return () => clearTimeout(t);
    }
    setIsPeeking(false);
  }, [passwordVisible, isPeeking]);

  // Calculate skew/lean toward mouse for a character rect
  const calcPos = useCallback(
    (rect: DOMRect | null) => {
      if (!rect || reducedMotion) return { faceX: 0, faceY: 0, bodySkew: 0 };
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 3;
      const dx = mouseX - cx;
      const dy = mouseY - cy;
      return {
        faceX: Math.max(-15, Math.min(15, dx / 20)),
        faceY: Math.max(-10, Math.min(10, dy / 30)),
        bodySkew: Math.max(-6, Math.min(6, -dx / 120)),
      };
    },
    [mouseX, mouseY, reducedMotion]
  );

  const p1 = calcPos(rects.c1);
  const p2 = calcPos(rects.c2);
  const p3 = calcPos(rects.c3);
  const p4 = calcPos(rects.c4);

  /* ── Character palette (x402 brand) ──
     Char 1 (tall): Primary orange        #ff8a00 / #d35400
     Char 2 (mid):  Dark card             #1a1a1a / #2d2a26
     Char 3 (dome): Warm amber            #ffb347 / #e8a944
     Char 4 (dome): Muted gold            #c9a836 / #b8960f
  ──────────────────────────────────────── */

  return (
    <div
      className="relative flex items-end justify-center select-none"
      style={{ width: 550, height: 400 }}
      aria-hidden="true"
    >
      {/* Character 1 — Tall primary orange block */}
      <div
        ref={char1Ref}
        className="absolute bottom-0"
        style={{
          left: 70,
          width: 180,
          height: isTyping || passwordHidden ? 440 : 400,
          background:
            "linear-gradient(180deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.75) 100%)",
          borderRadius: "10px 10px 0 0",
          zIndex: 1,
          transform: passwordVisible
            ? "skewX(0deg)"
            : isTyping || passwordHidden
            ? `skewX(${(p1.bodySkew || 0) - 12}deg) translateX(40px)`
            : `skewX(${p1.bodySkew || 0}deg)`,
          transformOrigin: "bottom center",
          transition: "all 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
          boxShadow: "inset 0 -40px 60px -20px rgba(0,0,0,0.15)",
        }}
      >
        {/* Eyes */}
        <div
          className="absolute flex gap-8"
          style={{
            left: passwordVisible
              ? 20
              : isLookingAtEachOther
              ? 55
              : 45 + p1.faceX,
            top: passwordVisible
              ? 35
              : isLookingAtEachOther
              ? 65
              : 40 + p1.faceY,
            transition: "all 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <EyeBall
            mouseX={mouseX}
            mouseY={mouseY}
            size={18}
            pupilSize={7}
            maxDistance={5}
            eyeColor="white"
            pupilColor="#1a1a1a"
            isBlinking={blink1}
            forceLookX={
              passwordVisible
                ? isPeeking
                  ? 4
                  : -4
                : isLookingAtEachOther
                ? 3
                : undefined
            }
            forceLookY={
              passwordVisible
                ? isPeeking
                  ? 5
                  : -4
                : isLookingAtEachOther
                ? 4
                : undefined
            }
          />
          <EyeBall
            mouseX={mouseX}
            mouseY={mouseY}
            size={18}
            pupilSize={7}
            maxDistance={5}
            eyeColor="white"
            pupilColor="#1a1a1a"
            isBlinking={blink1}
            forceLookX={
              passwordVisible
                ? isPeeking
                  ? 4
                  : -4
                : isLookingAtEachOther
                ? 3
                : undefined
            }
            forceLookY={
              passwordVisible
                ? isPeeking
                  ? 5
                  : -4
                : isLookingAtEachOther
                ? 4
                : undefined
            }
          />
        </div>
      </div>

      {/* Character 2 — Dark mid-height block */}
      <div
        ref={char2Ref}
        className="absolute bottom-0"
        style={{
          left: 240,
          width: 120,
          height: 310,
          background:
            "linear-gradient(180deg, var(--card) 0%, #111 100%)",
          borderRadius: "8px 8px 0 0",
          zIndex: 2,
          border: "1px solid var(--border)",
          transform: passwordVisible
            ? "skewX(0deg)"
            : isLookingAtEachOther
            ? `skewX(${(p2.bodySkew || 0) * 1.5 + 10}deg) translateX(20px)`
            : isTyping || passwordHidden
            ? `skewX(${(p2.bodySkew || 0) * 1.5}deg)`
            : `skewX(${p2.bodySkew || 0}deg)`,
          transformOrigin: "bottom center",
          transition: "all 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
          boxShadow: "inset 0 -30px 50px -15px rgba(0,0,0,0.3)",
        }}
      >
        <div
          className="absolute flex gap-6"
          style={{
            left: passwordVisible
              ? 10
              : isLookingAtEachOther
              ? 32
              : 26 + p2.faceX,
            top: passwordVisible
              ? 28
              : isLookingAtEachOther
              ? 12
              : 32 + p2.faceY,
            transition: "all 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <EyeBall
            mouseX={mouseX}
            mouseY={mouseY}
            size={16}
            pupilSize={6}
            maxDistance={4}
            eyeColor="white"
            pupilColor="#1a1a1a"
            isBlinking={blink2}
            forceLookX={
              passwordVisible
                ? -4
                : isLookingAtEachOther
                ? 0
                : undefined
            }
            forceLookY={
              passwordVisible
                ? -4
                : isLookingAtEachOther
                ? -4
                : undefined
            }
          />
          <EyeBall
            mouseX={mouseX}
            mouseY={mouseY}
            size={16}
            pupilSize={6}
            maxDistance={4}
            eyeColor="white"
            pupilColor="#1a1a1a"
            isBlinking={blink2}
            forceLookX={
              passwordVisible
                ? -4
                : isLookingAtEachOther
                ? 0
                : undefined
            }
            forceLookY={
              passwordVisible
                ? -4
                : isLookingAtEachOther
                ? -4
                : undefined
            }
          />
        </div>
      </div>

      {/* Character 3 — Warm amber dome (short, left) */}
      <div
        ref={char3Ref}
        className="absolute bottom-0"
        style={{
          left: 0,
          width: 240,
          height: 200,
          background:
            "linear-gradient(180deg, #ffb347 0%, hsl(var(--primary) / 0.7) 100%)",
          borderRadius: "120px 120px 0 0",
          zIndex: 3,
          transform: passwordVisible
            ? "skewX(0deg)"
            : `skewX(${p3.bodySkew || 0}deg)`,
          transformOrigin: "bottom center",
          transition: "all 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
          boxShadow: "inset 0 -30px 50px -15px rgba(0,0,0,0.1)",
        }}
      >
        <div
          className="absolute flex gap-8"
          style={{
            left: passwordVisible ? 50 : 82 + (p3.faceX || 0),
            top: passwordVisible ? 85 : 90 + (p3.faceY || 0),
            transition: "all 0.2s ease-out",
          }}
        >
          <Pupil
            mouseX={mouseX}
            mouseY={mouseY}
            size={12}
            maxDistance={5}
            pupilColor="#1a1a1a"
            forceLookX={passwordVisible ? -5 : undefined}
            forceLookY={passwordVisible ? -4 : undefined}
          />
          <Pupil
            mouseX={mouseX}
            mouseY={mouseY}
            size={12}
            maxDistance={5}
            pupilColor="#1a1a1a"
            forceLookX={passwordVisible ? -5 : undefined}
            forceLookY={passwordVisible ? -4 : undefined}
          />
        </div>
      </div>

      {/* Character 4 — Muted gold dome (short, right) */}
      <div
        ref={char4Ref}
        className="absolute bottom-0"
        style={{
          left: 310,
          width: 140,
          height: 230,
          background:
            "linear-gradient(180deg, #e8c547 10%, #c9a836 100%)",
          borderRadius: "70px 70px 0 0",
          zIndex: 4,
          transform: passwordVisible
            ? "skewX(0deg)"
            : `skewX(${p4.bodySkew || 0}deg)`,
          transformOrigin: "bottom center",
          transition: "all 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
          boxShadow: "inset 0 -30px 50px -15px rgba(0,0,0,0.1)",
        }}
      >
        {/* Eyes */}
        <div
          className="absolute flex gap-6"
          style={{
            left: passwordVisible ? 20 : 52 + (p4.faceX || 0),
            top: passwordVisible ? 35 : 40 + (p4.faceY || 0),
            transition: "all 0.2s ease-out",
          }}
        >
          <Pupil
            mouseX={mouseX}
            mouseY={mouseY}
            size={12}
            maxDistance={5}
            pupilColor="#1a1a1a"
            forceLookX={passwordVisible ? -5 : undefined}
            forceLookY={passwordVisible ? -4 : undefined}
          />
          <Pupil
            mouseX={mouseX}
            mouseY={mouseY}
            size={12}
            maxDistance={5}
            pupilColor="#1a1a1a"
            forceLookX={passwordVisible ? -5 : undefined}
            forceLookY={passwordVisible ? -4 : undefined}
          />
        </div>
        {/* Mouth line */}
        <div
          className="absolute w-20 h-[4px] rounded-full"
          style={{
            backgroundColor: "#1a1a1a",
            left: passwordVisible ? 10 : 40 + (p4.faceX || 0),
            top: passwordVisible ? 88 : 88 + (p4.faceY || 0),
            transition: "all 0.2s ease-out",
          }}
        />
      </div>
    </div>
  );
}
