'use client';

/**
 * Testimonials Component
 * 
 * Customer testimonials with avatars, ratings, and company logos.
 */

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@generative-ui/ui/components/card';
import { Badge } from '@generative-ui/ui/components/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@generative-ui/ui/components/avatar';
import { Star, Quote } from 'lucide-react';
import { cn } from '@generative-ui/ui/lib/utils';

interface Testimonial {
  id: string;
  content: string;
  author: {
    name: string;
    role: string;
    company: string;
    avatar: string;
  };
  rating: number;
  featured?: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    content: "Generative UI has completely transformed how we build interfaces. What used to take days now takes minutes. The AI understands our design system perfectly and generates components that match our brand guidelines every time.",
    author: {
      name: "Sarah Chen",
      role: "VP of Engineering",
      company: "TechCorp",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    rating: 5,
    featured: true,
  },
  {
    id: '2',
    content: "The TypeScript support is incredible. Generated components come with proper types, interfaces, and documentation. It's like having a senior developer pair programming with you.",
    author: {
      name: "Marcus Johnson",
      role: "Lead Developer",
      company: "StartupXYZ",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    },
    rating: 5,
  },
  {
    id: '3',
    content: "We reduced our frontend development time by 70% after adopting Generative UI. The MCP integration means we can use our existing component libraries seamlessly.",
    author: {
      name: "Emily Rodriguez",
      role: "Product Manager",
      company: "ScaleUp Inc",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    },
    rating: 5,
    featured: true,
  },
  {
    id: '4',
    content: "The theming capabilities are unmatched. We went from concept to a fully themed dashboard in under an hour. Dark mode support out of the box is a huge plus.",
    author: {
      name: "David Kim",
      role: "Design Systems Lead",
      company: "DesignCo",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    },
    rating: 5,
  },
  {
    id: '5',
    content: "As a solo founder, Generative UI is like having a full frontend team. I can focus on business logic while the AI handles the UI. Game changer for MVPs.",
    author: {
      name: "Alex Thompson",
      role: "Founder",
      company: "SoloFounder",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    },
    rating: 5,
  },
  {
    id: '6',
    content: "The CLI integration fits perfectly into our CI/CD pipeline. We generate components as part of our build process. It's reliable, fast, and consistent.",
    author: {
      name: "Lisa Wang",
      role: "DevOps Engineer",
      company: "Enterprise Solutions",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
    },
    rating: 5,
  },
];

const companies = [
  'TechCorp',
  'StartupXYZ',
  'ScaleUp Inc',
  'DesignCo',
  'Enterprise Solutions',
  'SoloFounder',
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            'h-4 w-4',
            i < rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'
          )}
        />
      ))}
    </div>
  );
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
}

function TestimonialCard({ testimonial, index }: TestimonialCardProps) {
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

  return (
    <div
      ref={cardRef}
      className={cn(
        'transition-all duration-500',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Card className={cn(
        'h-full transition-all duration-300 hover:shadow-lg',
        testimonial.featured && 'border-primary/20 bg-primary/5'
      )}>
        <CardContent className="p-6">
          {/* Quote Icon */}
          <Quote className="h-8 w-8 text-primary/20 mb-4" />
          
          {/* Rating */}
          <StarRating rating={testimonial.rating} />
          
          {/* Content */}
          <p className="mt-4 text-sm leading-relaxed text-foreground">
            "{testimonial.content}"
          </p>
          
          {/* Author */}
          <div className="mt-6 flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={testimonial.author.avatar} alt={testimonial.author.name} />
              <AvatarFallback>
                {testimonial.author.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{testimonial.author.name}</p>
              <p className="text-xs text-muted-foreground">
                {testimonial.author.role} at {testimonial.author.company}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface TestimonialsProps {
  className?: string;
}

export function Testimonials({ className }: TestimonialsProps) {
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
    <section className={cn('py-20 lg:py-32', className)}>
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
            Testimonials
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Loved by developers{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
              worldwide
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            See what teams are saying about Generative UI. Join thousands of 
            developers shipping faster.
          </p>
        </div>

        {/* Company Logos */}
        <div 
          className={cn(
            'flex flex-wrap items-center justify-center gap-8 mb-16 transition-all duration-700 delay-200',
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
        >
          {companies.map((company) => (
            <div 
              key={company}
              className="text-xl font-bold text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            >
              {company}
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={testimonial.id} 
              testimonial={testimonial} 
              index={index}
            />
          ))}
        </div>

        {/* Stats */}
        <div 
          className={cn(
            'mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t pt-12 transition-all duration-700 delay-500',
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
        >
          {[
            { value: '10K+', label: 'Active Developers' },
            { value: '1M+', label: 'Components Generated' },
            { value: '99.9%', label: 'Uptime' },
            { value: '4.9/5', label: 'Average Rating' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
