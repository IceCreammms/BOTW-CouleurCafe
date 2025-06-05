"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";

interface FillOnHoverButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function FillOnHoverButton({
  className,
  children,
  ...rest
}: FillOnHoverButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const fillerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const btn = btnRef.current;
    const filler = fillerRef.current;
    if (!btn || !filler) return;

    // 1) On mount, position the circle off-screen (yPercent: 100)
    //    and center it horizontally (xPercent: -50).
    gsap.set(filler, {
      xPercent: -50,   // move left by 50% of its own width
      yPercent: 100,   // move down by 100% of its own height
    });

    // 2) On mouseenter, animate yPercent: 0 (so the top half of circle is visible)
    const handleMouseEnter = () => {
      gsap.to(filler, {
        yPercent: 0,
        duration: 0.5,
        ease: "power3.out",
      });
    };

    // 3) On mouseleave, animate yPercent: -100 (so the circle moves entirely above)
    const handleMouseLeave = () => {
      gsap.to(filler, {
        yPercent: -100,
        duration: 0.4,
        ease: "power3.out",
      });
    };

    btn.addEventListener("mouseenter", handleMouseEnter);
    btn.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      btn.removeEventListener("mouseenter", handleMouseEnter);
      btn.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <button
      ref={btnRef}
      className={`relative overflow-hidden ${className}`}
      {...rest}
    >
      {/*
        We no longer put transform: translate(…) here.
        GSAP will handle centering (xPercent) and vertical movement (yPercent).
      */}
      <span
        ref={fillerRef}
        className="
          absolute
          left-1/2
          bottom-0
          w-[200%]
          h-[200%]
          bg-[#FFA69E]
          rounded-full
        "
        // ← NO inline transform at all!
      />

      <span className="relative z-10">{children}</span>
    </button>
  );
}