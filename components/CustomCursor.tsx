"use client";
import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState({ x: 0, y: 0 });
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    let rafId: number;
    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setPos({ x: mouseX, y: mouseY });
    };

    const animate = () => {
      trailX += (mouseX - trailX) * 0.12;
      trailY += (mouseY - trailY) * 0.12;
      setTrail({ x: trailX, y: trailY });
      rafId = requestAnimationFrame(animate);
    };

    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    const checkHover = (e: MouseEvent) => {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const isHoverable = el?.closest('a, button, .hover-target');
      setHovering(!!isHoverable);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousemove", checkHover);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousemove", checkHover);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Main dot */}
      <div style={{
        position: 'fixed',
        left: pos.x - 4,
        top: pos.y - 4,
        width: clicking ? 6 : 8,
        height: clicking ? 6 : 8,
        borderRadius: '50%',
        background: '#00f0ff',
        pointerEvents: 'none',
        zIndex: 99999,
        transition: 'width 0.15s, height 0.15s',
        boxShadow: '0 0 10px #00f0ff, 0 0 20px rgba(0,240,255,0.5)',
        mixBlendMode: 'screen',
      }} />
      {/* Trail ring */}
      <div style={{
        position: 'fixed',
        left: trail.x - (hovering ? 24 : 16),
        top: trail.y - (hovering ? 24 : 16),
        width: hovering ? 48 : 32,
        height: hovering ? 48 : 32,
        borderRadius: '50%',
        border: `1px solid ${hovering ? 'rgba(0,240,255,0.8)' : 'rgba(0,240,255,0.4)'}`,
        pointerEvents: 'none',
        zIndex: 99998,
        transition: 'width 0.3s, height 0.3s, left 0.3s, top 0.3s, border-color 0.3s',
        background: hovering ? 'rgba(0,240,255,0.05)' : 'transparent',
      }} />
    </>
  );
}
