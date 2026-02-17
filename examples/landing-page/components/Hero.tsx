'use client';

/**
 * Hero Component
 * 
 * Hero section with animated gradient background, headline, and CTA buttons.
 */

import { useEffect, useState } from 'react';
import { Button } from '@generative-ui/ui/components/button';
import { Badge } from '@generative-ui/ui/components/badge';
import { ArrowRight, Play, Sparkles, Zap, Shield } from 'lucide-react';
import { cn } from '@generative-ui/ui/lib/utils';

interface HeroProps {
  className?: string;
}

export function Hero({ className }: HeroProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className={cn('relative overflow-hidden', className)}>
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 rounded-full blur-[120px] opacity-50" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[400px] bg-secondary/30 rounded-full blur-[100px] opacity-40" />
      </div>

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 -z-10 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div 
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 transition-all duration-700',
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Introducing Generative UI 2.0
            </span>
            <ArrowRight className="h-3 w-3 text-primary" />
          </div>

          {/* Headline */}
          <h1 
            className={cn(
              'text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6 transition-all duration-700 delay-100',
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
          >
            Build beautiful interfaces{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
              with AI
            </span>
          </h1>

          {/* Subheadline */}
          <p 
            className={cn(
              'text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 transition-all duration-700 delay-200',
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
          >
            Transform your ideas into production-ready React components in seconds. 
            Powered by advanced AI, designed for developers who ship fast.
          </p>

          {/* CTA Buttons */}
          <div 
            className={cn(
              'flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 transition-all duration-700 delay-300',
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
          >
            <Button size="lg" className="group min-w-[200px]">
              Start Building Free
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="group min-w-[200px]">
              <Play className="mr-2 h-4 w-4" />
              Watch Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div 
            className={cn(
              'flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground transition-all duration-700 delay-400',
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
          >
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              <span>Lightning Fast</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-500" />
              <span>Enterprise Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>AI-Powered</span>
            </div>
          </div>
        </div>

        {/* Hero Image / Preview */}
        <div 
          className={cn(
            'mt-16 relative transition-all duration-1000 delay-500',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          <div className="relative rounded-xl border bg-card shadow-2xl overflow-hidden">
            {/* Browser Chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/50">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-amber-500" />
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
              </div>
              <div className="flex-1 mx-4">
                <div className="h-6 max-w-md mx-auto rounded-md bg-background border flex items-center px-3 text-xs text-muted-foreground">
                  app.generative-ui.com/dashboard
                </div>
              </div>
            </div>
            
            {/* Preview Content */}
            <div className="aspect-[16/9] bg-gradient-to-br from-background to-muted p-8">
              <div className="grid grid-cols-3 gap-6 h-full">
                <div className="col-span-2 space-y-4">
                  <div className="h-8 w-48 bg-primary/20 rounded-lg" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-32 bg-card rounded-xl border shadow-sm" />
                    <div className="h-32 bg-card rounded-xl border shadow-sm" />
                  </div>
                  <div className="h-48 bg-card rounded-xl border shadow-sm" />
                </div>
                <div className="space-y-4">
                  <div className="h-40 bg-card rounded-xl border shadow-sm" />
                  <div className="h-40 bg-card rounded-xl border shadow-sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute -top-4 -right-4 bg-card border rounded-lg shadow-lg p-3 animate-pulse">
            <Badge variant="default" className="bg-emerald-500/10 text-emerald-500">
              Component Generated
            </Badge>
          </div>
          <div className="absolute -bottom-4 -left-4 bg-card border rounded-lg shadow-lg p-3">
            <div className="flex items-center gap-2 text-sm">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-muted-foreground">2,847 components today</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
