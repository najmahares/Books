
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import "./MagicCursor.css";

interface TrailDot {
  id: number;
  x: number;
  y: number;
  opacity: number;
  scale: number;
}

export function MagicCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [trail, setTrail] = useState<TrailDot[]>([]);
  const trailIdRef = useRef(0);
  const lastTrailTime = useRef(0);
 const rafRef = useRef<number | nul>(null);

  const positionRef = useRef({ x: -100, y: -100 });

  const updateTrail = useCallback(() => {
    setTrail((prev) => {
      if (prev.length === 0) return prev;
      const updated = prev
        .map((dot) => ({
          ...dot,
          opacity: dot.opacity - 0.04,
          scale: dot.scale - 0.02,
        }))
        .filter((dot) => dot.opacity > 0);
      return updated;
    });
    rafRef.current = requestAnimationFrame(updateTrail);
  }, []);

  useEffect(() => {
    document.body.style.cursor = "none";

    const handleMouseMove = (e: MouseEvent) => {
      const newPos = { x: e.clientX, y: e.clientY };
      setPosition(newPos);
      positionRef.current = newPos;
      setIsVisible(true);

      const now = Date.now();
      if (now - lastTrailTime.current > 30) {
        lastTrailTime.current = now;
        const newDot: TrailDot = {
          id: trailIdRef.current++,
          x: e.clientX,
          y: e.clientY,
          opacity: 0.6,
          scale: 1,
        };
        setTrail((prev) => [...prev.slice(-15), newDot]);
      }
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => {
      setIsVisible(false);
      setIsHovering(false);
    };

    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest("label") ||
        target.closest("[role='button']") ||
        target.closest(".book-card") ||
        target.closest(".flip-wrapper") ||
        target.closest(".modal-close") ||
        target.closest(".filter-tag") ||
        target.closest(".mood-btn") ||
        target.closest(".filter-tag-pill") ||
        target.closest(".similar-book-card") ||
        target.closest(".shelf-item") ||
        target.closest(".recommendation-card");
      setIsHovering(!!isInteractive);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleElementHover);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    rafRef.current = requestAnimationFrame(updateTrail);

    return () => {
      document.body.style.cursor = "auto";
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleElementHover);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [updateTrail]);

  if (!isVisible) return null;

  return (
    <>
      {trail.map((dot) => (
        <div
          key={dot.id}
          className="cursor-trail"
          style={{
            left: dot.x,
            top: dot.y,
            opacity: dot.opacity,
            transform: `translate(-50%, -50%) scale(${Math.max(0, dot.scale)})`,
          }}
        />
      ))}

      <div
        className={`magic-cursor ${isHovering ? "hovering" : ""}`}
        style={{
          left: position.x,
          top: position.y,
        }}
      >
        <div className="cursor-core" />
        <div className="cursor-glow" />
        <div className="cursor-ring" />
      </div>
    </>
  );
}
