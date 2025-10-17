'use client';

import { useEffect, useRef, useState } from "react";

const SLIDE_DURATION = 6000; // total time a slide is shown (ms)
const TRANSITION_DURATION = 1400; // portion of duration spent cross-fading (ms)
const IMAGE_PATHS = [
  "/Ethiopian_men.png",
  "/funny-african.jpg",
  "/realistic_photo.png",
];

type LoadedImage = {
  element: HTMLImageElement;
  width: number;
  height: number;
};

export function AuthShowcase() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<LoadedImage[]>([]);
  const animationRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [ready, setReady] = useState(false);

  const drawImageCover = (ctx: CanvasRenderingContext2D, image: LoadedImage) => {
    const { width: canvasWidth, height: canvasHeight } = ctx.canvas;
    const scale = Math.max(
      canvasWidth / image.width,
      canvasHeight / image.height,
    );
    const drawWidth = image.width * scale;
    const drawHeight = image.height * scale;
    const offsetX = (canvasWidth - drawWidth) / 2;
    const offsetY = (canvasHeight - drawHeight) / 2;

    ctx.drawImage(image.element, offsetX, offsetY, drawWidth, drawHeight);
  };

  const renderFrame = (
    fromIndex: number,
    toIndex: number,
    blendFactor: number,
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const slides = imagesRef.current;
    if (!slides.length) return;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const drawWithAlpha = (index: number, alpha: number) => {
      const slide = slides[index];
      if (!slide) return;
      ctx.save();
      ctx.globalAlpha = alpha;
      drawImageCover(ctx, slide);
      ctx.restore();
    };

    drawWithAlpha(fromIndex, Math.max(1 - blendFactor, 0));

    if (slides.length > 1) {
      drawWithAlpha(toIndex, Math.min(blendFactor, 1));
    }

    // Subtle overlay to make foreground content pop.
    ctx.save();
    const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    gradient.addColorStop(0, "rgba(15,23,42,0.35)");
    gradient.addColorStop(1, "rgba(15,23,42,0.75)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const container = canvas.parentElement;
      if (!container) return;
      const { width, height } = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = Math.max(Math.floor(width * dpr), 1);
      canvas.height = Math.max(Math.floor(height * dpr), 1);
      canvas.style.width = `${Math.floor(width)}px`;
      canvas.style.height = `${Math.floor(height)}px`;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      if (ready) {
        renderFrame(activeIndex, activeIndex, 0);
      }
    };

    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(canvas.parentElement ?? canvas);

    return () => {
      observer.disconnect();
    };
  }, [activeIndex, ready]);

  useEffect(() => {
    let isMounted = true;

    const loadImages = async () => {
      try {
        const loaded = await Promise.all(
          IMAGE_PATHS.map(
            (src) =>
              new Promise<LoadedImage>((resolve, reject) => {
                const img = new Image();
                img.src = src;
                img.onload = () => {
                  resolve({
                    element: img,
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                  });
                };
                img.onerror = () => reject(new Error(`Failed to load ${src}`));
              }),
          ),
        );

        if (!isMounted) return;

        imagesRef.current = loaded;
        setActiveIndex(0);
        setReady(true);
        renderFrame(0, 0, 0);
      } catch (error) {
        console.error(error);
      }
    };

    loadImages();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;

    const slides = imagesRef.current;
    if (!slides.length) return;

    const runAnimation = (startIndex: number) => {
      let currentIndex = startIndex;
      let cycleStart: number | null = null;

      const tick = (timestamp: number) => {
        if (!canvasRef.current) return;

        if (cycleStart === null) {
          cycleStart = timestamp;
        }

        const elapsed = timestamp - cycleStart;
        const nextIndex = (currentIndex + 1) % slides.length;

        if (slides.length === 1) {
          renderFrame(currentIndex, currentIndex, 0);
          animationRef.current = requestAnimationFrame(tick);
          return;
        }

        if (elapsed < SLIDE_DURATION - TRANSITION_DURATION) {
          renderFrame(currentIndex, nextIndex, 0);
        } else {
          const transitionElapsed = elapsed - (SLIDE_DURATION - TRANSITION_DURATION);
          const progress = Math.min(transitionElapsed / TRANSITION_DURATION, 1);
          renderFrame(currentIndex, nextIndex, progress);

          if (progress >= 1) {
            currentIndex = nextIndex;
            cycleStart = timestamp;
            setActiveIndex(currentIndex);
          }
        }

        animationRef.current = requestAnimationFrame(tick);
      };

      animationRef.current = requestAnimationFrame(tick);
    };

    runAnimation(activeIndex);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [ready]);

  return (
    <div className="relative h-full w-full">
      <canvas ref={canvasRef} className="h-full w-full rounded-4xl" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-950/40 via-slate-950/10 to-slate-900/50" />
      <div className="pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {IMAGE_PATHS.map((_, index) => (
          <span
            key={index}
            aria-hidden="true"
            className={`h-1.5 rounded-full transition-all duration-500 ${
              index === activeIndex
                ? "w-8 bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.55)]"
                : "w-3 bg-slate-500/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
