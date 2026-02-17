'use client';

/**
 * Features Component
 * 
 * Feature grid showcasing key product capabilities with icons and descriptions.
 */

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@generative-ui/ui/components/card';
import { Badge } from '@generative-ui/ui/components/badge';
import {
  Sparkles,
  Zap,
  Palette,
  Code2,
  Layers,
  GitBranch,
  Shield,
  Globe,
  Cpu,
  Workflow,
  Terminal,
  Rocket,
} from 'lucide-react';
import { cn } from '@generative-ui/ui/lib/utils';

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  badge?: string;
  color: string;
}

const features: Feature[] = [
  {
    icon: Sparkles,
    title: 'AI-Powered Generation',
    description: 'Transform natural language descriptions into production-ready React components with a single prompt.',
    badge: 'New',
    color: 'text-violet-500',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Generate components in under 2 seconds. Iterate quickly with instant previews and live editing.',
    color: 'text-amber-500',
  },
  {
    icon: Palette,
    title: 'Smart Theming',
    description: 'Automatic theme adaptation with support for Tailwind CSS, dark mode, and custom design systems.',
    color: 'text-pink-500',
  },
  {
    icon: Code2,
    title: 'TypeScript First',
    description: 'Full TypeScript support with generated types, interfaces, and prop definitions out of the box.',
    color: 'text-blue-500',
  },
  {
    icon: Layers,
    title: 'Component Library',
    description: 'Access 50+ pre-built components from shadcn/ui, Chakra UI, and custom registries via MCP.',
    color: 'text-emerald-500',
  },
  {
    icon: GitBranch,
    title: 'Version Control',
    description: 'Built-in versioning for generated components. Rollback changes and track evolution over time.',
    color: 'text-orange-500',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'SOC 2 compliant with end-to-end encryption. Your code and prompts never leave your infrastructure.',
    color: 'text-red-500',
  },
  {
    icon: Globe,
    title: 'Multi-Framework',
    description: 'Export to React, Vue, Svelte, or plain HTML. One prompt, multiple framework outputs.',
    badge: 'Beta',
    color: 'text-cyan-500',
  },
  {
    icon: Cpu,
    title: 'Custom Models',
    description: 'Bring your own LLM or use our optimized models. Support for OpenAI, Anthropic, and local models.',
    color: 'text-purple-500',
  },
  {
    icon: Workflow,
    title: 'CI/CD Integration',
    description: 'Seamlessly integrate with your existing workflow. GitHub Actions, Vercel, and more.',
    color: 'text-indigo-500',
  },
  {
    icon: Terminal,
    title: 'CLI Access',
    description: 'Command-line interface for power users. Generate components directly from your terminal.',
    color: 'text-slate-500',
  },
  {
    icon: Rocket,
    title: 'One-Click Deploy',
    description: 'Deploy generated components instantly to Vercel, Netlify, or your own infrastructure.',
    color: 'text-rose-500',
  },
];

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

function FeatureCard({ feature, index }: FeatureCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const Icon = feature.icon;

  return (
    <div
      ref={cardRef}
      className={cn(
        'transition-all duration-500',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <Card className="h-full group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className={cn('h-10 w-10 rounded-lg bg-muted flex items-center justify-center', feature.color)}>
              <Icon className="h-5 w-5" />
            </div>
            {feature.badge && (
              <Badge variant="secondary" className="text-xs">
                {feature.badge}
              </Badge>
            )}
          </div>
          <CardTitle className="text-lg mt-4">{feature.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm leading-relaxed">
            {feature.description}
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}

interface FeaturesProps {
  className?: string;
}

export function Features({ className }: FeaturesProps) {
  const [headerVisible, setHeaderVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className={cn('py-20 lg:py-32 bg-muted/30', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div 
          ref={headerRef}
          className={cn(
            'text-center max-w-3xl mx-auto mb-16 transition-all duration-700',
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
        >
          <Badge variant="outline" className="mb-4">
            Features
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Everything you need to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
              ship faster
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A complete toolkit for modern UI development. From idea to production 
            in minutes, not hours.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div 
          className={cn(
            'mt-16 text-center transition-all duration-700 delay-500',
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
        >
          <p className="text-muted-foreground mb-4">
            And much more. Explore all features in our documentation.
          </p>
          <a 
            href="#" 
            className="text-primary hover:underline inline-flex items-center gap-1"
          >
            View full feature list
            <span className="text-lg">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
