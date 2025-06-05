import React, { useEffect, useRef, MouseEventHandler } from 'react'
import gsap from 'gsap'

interface MagneticButtonProps {
  playing: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
}

export default function MagneticButton({ playing, onClick }: MagneticButtonProps) {
  const magnetic = useRef<HTMLButtonElement>(null)
  const filler   = useRef<HTMLSpanElement>(null)
  const barRefs  = [useRef<SVGRectElement>(null), useRef<SVGRectElement>(null), useRef<SVGRectElement>(null)]
  const vizTimeline = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    if (!magnetic.current) return

    const xTo = gsap.quickTo(magnetic.current, "x", { duration: 1, ease: "elastic.out(1, 0.3)" })
    const yTo = gsap.quickTo(magnetic.current, "y", { duration: 1, ease: "elastic.out(1, 0.3)" })

    const handleMouseMove = (e: MouseEvent) => {
      if (!magnetic.current) return
      const { clientX, clientY } = e
      const { height, width, left, top } = magnetic.current.getBoundingClientRect()
      const x = clientX - (left + width / 2)
      const y = clientY - (top + height / 2)
      xTo(x)
      yTo(y)
    }

    const handleMouseLeave = () => {
      if (!magnetic.current) return
      gsap.to(magnetic.current, { x: 0, y: 0, scale: 1, duration: 0.5, ease: "power3.out" })
      xTo(0)
      yTo(0)
      if (filler.current) {
        gsap.to(filler.current, {
          y: '-100%',
          duration: 0.4,
          ease: 'power3.out'
        })
      }
    }

    const handleMouseEnter = () => {
      if (!magnetic.current) return
      gsap.to(magnetic.current, { scale: 1.2, duration: 0.3, ease: "expo.out" })
      if (filler.current) {
        gsap.to(filler.current, {
          y: '0%',
          startAt: { y: '100%' },
          duration: 0.5,
          ease: 'power3.out'
        })
      }
    }

    const btn = magnetic.current
    btn.addEventListener("mousemove", handleMouseMove)
    btn.addEventListener("mouseleave", handleMouseLeave)
    btn.addEventListener("mouseenter", handleMouseEnter)

    return () => {
      btn.removeEventListener("mousemove", handleMouseMove)
      btn.removeEventListener("mouseleave", handleMouseLeave)
      btn.removeEventListener("mouseenter", handleMouseEnter)
    }
  }, [])

  useEffect(() => {
    const cy = 4
    vizTimeline.current?.kill()

    if (playing) {
      const tl = gsap.timeline({ repeat: -1 })
      tl.to(barRefs[0].current, { height: 18, y: cy - 18 / 2, duration: 0.25, ease: "power1.inOut" }, 0)
        .to(barRefs[1].current, { height: 10, y: cy - 10 / 2, duration: 0.25, ease: "power1.inOut" }, 0)
        .to(barRefs[2].current, { height: 14, y: cy - 14 / 2, duration: 0.25, ease: "power1.inOut" }, 0)

        .to(barRefs[0].current, { height: 10, y: cy - 10 / 2, duration: 0.25, ease: "power1.inOut" }, 0.25)
        .to(barRefs[1].current, { height: 18, y: cy - 18 / 2, duration: 0.25, ease: "power1.inOut" }, 0.25)
        .to(barRefs[2].current, { height: 10, y: cy - 10 / 2, duration: 0.25, ease: "power1.inOut" }, 0.25)

        .to(barRefs[0].current, { height: 14, y: cy - 14 / 2, duration: 0.25, ease: "power1.inOut" }, 0.5)
        .to(barRefs[1].current, { height: 10, y: cy - 10 / 2, duration: 0.25, ease: "power1.inOut" }, 0.5)
        .to(barRefs[2].current, { height: 18, y: cy - 18 / 2, duration: 0.25, ease: "power1.inOut" }, 0.5)

        .to(barRefs[0].current, { height: 10, y: cy - 10 / 2, duration: 0.25, ease: "power1.inOut" }, 0.75)
        .to(barRefs[1].current, { height: 14, y: cy - 14 / 2, duration: 0.25, ease: "power1.inOut" }, 0.75)
        .to(barRefs[2].current, { height: 10, y: cy - 10 / 2, duration: 0.25, ease: "power1.inOut" }, 0.75)
        
        .to(barRefs[0].current, { height: 8, y: cy - 8 / 2, duration: 0.25, ease: "power1.inOut" }, 1.0)
        .to(barRefs[1].current, { height: 8, y: cy - 8 / 2, duration: 0.25, ease: "power1.inOut" }, 1.0)
        .to(barRefs[2].current, { height: 8, y: cy - 8 / 2, duration: 0.25, ease: "power1.inOut" }, 1.0);
      vizTimeline.current = tl
    } else {
      barRefs.forEach(ref => {
        if (ref.current) {
          gsap.set(ref.current, { height: 8, y: cy - 8 / 2 })
        }
      })
    }
    return () => {
      vizTimeline.current?.kill();
    }
  }, [playing])

  const DotsIcon = (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="7" cy="14" r="2" fill="#333" />
      <circle cx="14" cy="14" r="2" fill="#333" />
      <circle cx="21" cy="14" r="2" fill="#333" />
    </svg>
  )
  const VisualizerIcon = (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect ref={barRefs[0]} x="5" y="10" width="4" height="8" rx="2" fill="#333" />
      <rect ref={barRefs[1]} x="12" y="10" width="4" height="8" rx="2" fill="#333" />
      <rect ref={barRefs[2]} x="19" y="10" width="4" height="8" rx="2" fill="#333" />
    </svg>
  )

  return (
    <button
      ref={magnetic}
      onClick={onClick}
      aria-label={playing ? "Pause music" : "Play music"}
      className="relative h-12 w-12 bg-[#E3E3E3] rounded-full flex items-center justify-center overflow-hidden"
    >
      <span
        ref={filler}
        className="absolute inset-0 bg-[#FFA69E] rounded-full z-0"
        style={{ transform: 'translateY(100%)' }}
      />
      <span className="relative z-10 transition-all duration-300">
        {playing ? VisualizerIcon : DotsIcon}
      </span>
    </button>
  )
}