"use client";
import { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

export default function MediaSlider() {
  const [slides, setSlides] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchSlides = async () => {
    try {
      const res = await fetch("/api/media-slider");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setSlides(data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch media slider data:", err);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  // Set up auto-slide timer
  useEffect(() => {
    if (slides.length <= 1 || isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slides.length, isHovered]);

  if (slides.length === 0) return null;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section 
      id="gallery-slider" 
      style={{ 
        padding: "120px 60px", 
        maxWidth: 1200, 
        margin: "0 auto",
        position: "relative"
      }}
    >
      {/* Section Header */}
      <div style={{ marginBottom: 60 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-0.02em" }}>
          Moments & Achievements
        </h2>
        <div className="cyber-divider" style={{ marginTop: 16, maxWidth: 300 }} />
        <p style={{ marginTop: 16, fontFamily: "var(--font-body)", fontSize: "1rem", color: "rgba(232,244,248,0.5)", maxWidth: 500 }}>
          A visual record of key events, hackathons, and certifications.
        </p>
      </div>

      {/* Main Slider Container */}
      <div 
        className="glass-card hover-target"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: "100%",
          height: "480px",
          position: "relative",
          overflow: "hidden",
          clipPath: "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))",
          background: "rgba(2, 4, 8, 0.4)",
          border: "1px solid var(--glass-border)",
        }}
      >
        {/* Slides list */}
        {slides.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={slide.id || idx}
              style={{
                position: "absolute",
                inset: 0,
                opacity: isActive ? 1 : 0,
                transition: "opacity 0.8s ease-in-out",
                pointerEvents: isActive ? "auto" : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Image element */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={slide.url} 
                alt={slide.title} 
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: isActive ? "scale(1)" : "scale(1.03)",
                  transition: "transform 8s ease",
                }}
              />

              {/* Gradient overlay */}
              <div 
                className="bg-gradient-to-t from-black/80 to-transparent"
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.4) 60%, transparent 100%)",
                  pointerEvents: "none",
                }}
              />

              {/* Text Content Overlay */}
              <div 
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "40px 48px",
                  textAlign: "left",
                  transform: isActive ? "translateY(0)" : "translateY(15px)",
                  transition: "transform 0.8s ease-out",
                }}
              >
                <span 
                  style={{ 
                    fontFamily: "var(--font-mono)", 
                    fontSize: "0.7rem", 
                    color: "var(--accent)", 
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: 8
                  }}
                >
                  Gallery Milestone
                </span>
                <h3 
                  style={{ 
                    fontFamily: "var(--font-display)", 
                    fontSize: "clamp(1.4rem, 3vw, 2rem)", 
                    fontWeight: 700, 
                    color: "white", 
                    marginBottom: 10,
                    lineHeight: 1.2
                  }}
                >
                  {slide.title}
                </h3>
                <p 
                  style={{ 
                    fontFamily: "var(--font-body)", 
                    fontSize: "0.95rem", 
                    color: "rgba(232, 244, 248, 0.75)", 
                    maxWidth: "680px",
                    lineHeight: 1.6
                  }}
                >
                  {slide.description}
                </p>
              </div>
            </div>
          );
        })}

        {/* Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="hover-target"
              aria-label="Previous slide"
              style={{
                position: "absolute",
                left: 20,
                top: "50%",
                transform: "translateY(-50%)",
                width: 44,
                height: 44,
                border: "1px solid rgba(0,240,255,0.2)",
                background: "rgba(2,4,8,0.6)",
                backdropFilter: "blur(6px)",
                color: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.3s",
                clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                zIndex: 10,
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.background = "rgba(0,240,255,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.borderColor = "rgba(0,240,255,0.2)"; e.currentTarget.style.background = "rgba(2,4,8,0.6)"; }}
            >
              <FaChevronLeft size={16} />
            </button>
            <button
              onClick={nextSlide}
              className="hover-target"
              aria-label="Next slide"
              style={{
                position: "absolute",
                right: 20,
                top: "50%",
                transform: "translateY(-50%)",
                width: 44,
                height: 44,
                border: "1px solid rgba(0,240,255,0.2)",
                background: "rgba(2,4,8,0.6)",
                backdropFilter: "blur(6px)",
                color: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.3s",
                clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                zIndex: 10,
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.background = "rgba(0,240,255,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.borderColor = "rgba(0,240,255,0.2)"; e.currentTarget.style.background = "rgba(2,4,8,0.6)"; }}
            >
              <FaChevronRight size={16} />
            </button>
          </>
        )}

        {/* Indicators at the bottom */}
        {slides.length > 1 && (
          <div 
            style={{
              position: "absolute",
              bottom: 24,
              right: 48,
              display: "flex",
              gap: 8,
              zIndex: 10
            }}
          >
            {slides.map((_, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  style={{
                    width: isActive ? 24 : 8,
                    height: 8,
                    borderRadius: 4,
                    background: isActive ? "var(--accent)" : "rgba(255,255,255,0.3)",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
