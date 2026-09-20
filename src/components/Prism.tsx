import { useEffect, useRef } from "react";

// A small, self-contained wire sculpture. No WebGL or external assets required.
export function Prism({ paused }: { paused: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    let width = 0,
      height = 0,
      frame = 0,
      time = 0,
      previous = 0;
    let visible = true;
    let pointerX = 0,
      pointerY = 0,
      x = 0,
      y = 0;
    const draw = () => {
      context.clearRect(0, 0, width, height);
      const scale = Math.min(width * 0.36, height * 0.34);
      const angle = -0.65 + time * 0.095 + x * 0.24;
      const tilt = -0.32 + y * 0.15;
      const project = (a: number, b: number, c: number) => {
        const u = a * Math.cos(angle) + c * Math.sin(angle);
        const v = c * Math.cos(angle) - a * Math.sin(angle);
        const z = b * Math.sin(tilt) + v * Math.cos(tilt);
        const perspective = 3.8 / (3.8 + z);
        return [
          width / 2 + u * scale * perspective,
          height / 2 +
            (b * Math.cos(tilt) - v * Math.sin(tilt)) * scale * perspective,
          z,
        ];
      };
      const layers = Array.from({ length: 32 }, (_, index) => {
        const t = index / 31;
        const twist = 0.18 * Math.sin(time * 0.35 + t * 2) + t * 0.45;
        const radius = 0.7 + 0.22 * Math.sin(t * Math.PI);
        return Array.from({ length: 3 }, (_, j) => {
          const a = (j * Math.PI * 2) / 3 + twist - Math.PI / 2;
          return project(
            Math.cos(a) * radius,
            (t - 0.5) * 2.35,
            Math.sin(a) * radius,
          );
        });
      });
      layers.forEach((points, i) => {
        context.beginPath();
        points.forEach((point, j) =>
          j
            ? context.lineTo(point[0], point[1])
            : context.moveTo(point[0], point[1]),
        );
        context.closePath();
        const accent = i > 11 && i < 20;
        context.strokeStyle = accent
          ? `rgba(150,192,245,${0.55 + 0.18 * Math.sin(time + i * 0.2)})`
          : `rgba(225,225,225,${0.2 + i / 100})`;
        context.lineWidth = accent ? 1 : 0.7;
        context.stroke();
        if (accent) {
          context.fillStyle = "rgba(135,183,245,.012)";
          context.fill();
        }
      });
      for (let edge = 0; edge < 3; edge++) {
        context.beginPath();
        layers.forEach((points, i) =>
          i
            ? context.lineTo(points[edge][0], points[edge][1])
            : context.moveTo(points[edge][0], points[edge][1]),
        );
        context.strokeStyle = "rgba(215,222,235,.45)";
        context.stroke();
      }
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
    };
    const tick = (now: number) => {
      if (previous) time += Math.min((now - previous) / 1000, 0.05);
      previous = now;
      x += (pointerX - x) * 0.035;
      y += (pointerY - y) * 0.035;
      draw();
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      stop();
      if (!paused && visible && !document.hidden)
        frame = requestAnimationFrame(tick);
      else draw();
    };
    const resize = new ResizeObserver(() => {
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      const dpr = Math.min(devicePixelRatio, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    });
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    const move = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerX = (event.clientX - rect.left) / rect.width - 0.5;
      pointerY = (event.clientY - rect.top) / rect.height - 0.5;
    };
    const leave = () => {
      pointerX = 0;
      pointerY = 0;
    };
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", sync);
    resize.observe(canvas);
    observer.observe(canvas);
    sync();
    return () => {
      stop();
      resize.disconnect();
      observer.disconnect();
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [paused]);
  return <canvas ref={canvasRef} className="prism-canvas" aria-hidden="true" />;
}
