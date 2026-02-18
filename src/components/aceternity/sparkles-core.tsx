"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";

export const SparklesCore = ({
  className,
  count = 100,
  speed = 1,
}: {
  className?: string;
  count?: number;
  speed?: number;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    class Sparkle {
      x: number;
      y: number;
      size: number;
      opacity: number;
      speed: number;
      direction: number;

      constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 2 + 0.5;
        this.opacity = Math.random();
        this.speed = Math.random() * 0.5 + 0.1;
        this.direction = Math.random() > 0.5 ? 1 : -1;
      }

      update() {
        this.opacity += this.speed * this.direction;
        if (this.opacity <= 0 || this.opacity >= 1) {
          this.direction *= -1;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const sparkles: Sparkle[] = [];
    for (let i = 0; i < count; i++) {
      sparkles.push(new Sparkle());
    }

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      sparkles.forEach((sparkle) => {
        sparkle.update();
        sparkle.draw(ctx);
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
  }, [count, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 h-full w-full", className)}
    />
  );
};
