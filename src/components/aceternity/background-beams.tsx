"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";

export const BackgroundBeams = ({ className }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    class Beam {
      x: number;
      y: number;
      height: number;
      speed: number;
      opacity: number;
      width: number;

      constructor() {
        this.x = Math.random() * w;
        this.y = -100;
        this.height = Math.random() * 100 + 50;
        this.speed = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.width = Math.random() * 2 + 1;
      }

      update() {
        this.y += this.speed;
        if (this.y > h + 100) {
          this.y = -100;
          this.x = Math.random() * w;
          this.height = Math.random() * 100 + 50;
          this.speed = Math.random() * 2 + 1;
          this.opacity = Math.random() * 0.5 + 0.3;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, `rgba(99, 102, 241, 0)`);
        gradient.addColorStop(0.5, `rgba(99, 102, 241, ${this.opacity})`);
        gradient.addColorStop(1, `rgba(99, 102, 241, 0)`);

        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    }

    const beams: Beam[] = [];
    for (let i = 0; i < 20; i++) {
      beams.push(new Beam());
    }

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      beams.forEach((beam) => {
        beam.update();
        beam.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 z-0 h-full w-full", className)}
    />
  );
};
