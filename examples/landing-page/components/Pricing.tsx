'use client';

/**
 * Pricing Component
 * 
 * Pricing tiers with feature comparison and CTA buttons.
 */

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@generative-ui/ui/components/card';
import { Button } from '@generative-ui/ui/components/button';
import { Badge } from '@generative-ui/ui/components/badge';
import { Switch } from '@generative-ui/ui/components/switch';
import { Label } from '@generative-ui/ui/components/label';
import { Separator } from '@generative-ui/ui/components/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@generative-ui/ui/components/tooltip';
import {
  Check,
  X,
  Sparkles,
  Zap,
  Building2,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@generative-ui/ui/lib/utils';

interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  badge?: string;
  icon: React.ElementType;
  features: {
    text: string;
    included: boolean;
    tooltip?: string;
  }[];
  cta: {
    text: string;
    variant: 'default' | 'outline' | 'secondary';
  };
  highlighted?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for side projects and learning.',
    price: {
      monthly: 0,
      yearly: 0,
    },
    icon: Sparkles,
    features: [
      { text: '100 components/month', included: true },
      { text: 'Basic AI models', included: true },
      { text: 'Community support', included: true },
      { text: 'shadcn/ui components', included: true },
      { text: 'TypeScript export', included: true },
      { text: 'Custom themes', included: false },
      { text: 'Private components', included: false },
      { text: 'API access', included: false },
    ],
    cta: {
      text: 'Get Started Free',
      variant: 'outline',
    },
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For professional developers and small teams.',
    price: {
      monthly: 29,
      yearly: 290,
    },
    badge: 'Most Popular',
    icon: Zap,
    highlighted: true,
    features: [
      { text: 'Unlimited components', included: true },
      { text: 'Advanced AI models (GPT-4, Claude)', included: true, tooltip: 'Access to the latest and most powerful AI models' },
      { text: 'Priority support', included: true },
      { text: 'All component libraries', included: true },
      { text: 'TypeScript export', included: true },
      { text: 'Custom themes', included: true },
      { text: 'Private components', included: true },
      { text: 'API access (1,000 calls/month)', included: true },
    ],
    cta: {
      text: 'Start Pro Trial',
      variant: 'default',
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For organizations with advanced needs.',
    price: {
      monthly: 99,
      yearly: 990,
    },
    icon: Building2,
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Custom AI model training', included: true, tooltip: 'Train models on your design system' },
      { text: 'Dedicated support', included: true },
      { text: 'SSO & SAML', included: true },
      { text: 'Audit logs', included: true },
      { text: 'SLA guarantee', included: true },
      { text: 'On-premise deployment', included: true },
      { text: 'Unlimited API access', included: true },
    ],
    cta: {
      text: 'Contact Sales',
      variant: 'secondary',
    },
  },
];

interface PricingCardProps {
  tier: PricingTier;
  isYearly: boolean;
  index: number;
}

function PricingCard({ tier, isYearly, index }: PricingCardProps) {
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

  const Icon = tier.icon;
  const price = isYearly ? tier.price.yearly : tier.price.monthly;
  const yearlySavings = tier.price.monthly * 12 - tier.price.yearly;

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
        'h-full flex flex-col relative',
        tier.highlighted && 'border-primary shadow-lg scale-105 z-10'
      )}>
        {tier.badge && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge className="bg-primary text-primary-foreground">
              {tier.badge}
            </Badge>
          </div>
        )}
        
        <CardHeader className="text-center">
          <div className={cn(
            'mx-auto h-12 w-12 rounded-xl flex items-center justify-center mb-4',
            tier.highlighted ? 'bg-primary text-primary-foreground' : 'bg-muted'
          )}>
            <Icon className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">{tier.name}</CardTitle>
          <CardDescription>{tier.description}</CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1">
          {/* Price */}
          <div className="text-center mb-6">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-bold">
                ${price}
              </span>
              <span className="text-muted-foreground">
                /{isYearly ? 'year' : 'month'}
              </span>
            </div>
            {isYearly && price > 0 && (
              <p className="text-sm text-emerald-500 mt-1">
                Save ${yearlySavings}/year
              </p>
            )}
          </div>

          <Separator className="mb-6" />

          {/* Features */}
          <ul className="space-y-3">
            {tier.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-3">
                {feature.included ? (
                  <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-emerald-500" />
                  </div>
                ) : (
                  <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="h-3 w-3 text-muted-foreground" />
                  </div>
                )}
                <span className={cn(
                  'text-sm',
                  feature.included ? 'text-foreground' : 'text-muted-foreground'
                )}>
                  {feature.text}
                </span>
                {feature.tooltip && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{feature.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
        
        <CardFooter>
          <Button 
            className="w-full group" 
            variant={tier.cta.variant}
            size="lg"
          >
            {tier.cta.text}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

interface PricingProps {
  className?: string;
}

export function Pricing({ className }: PricingProps) {
  const [isYearly, setIsYearly] = useState(true);
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
            'text-center max-w-3xl mx-auto mb-12 transition-all duration-700',
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
        >
          <Badge variant="outline" className="mb-4">
            Pricing
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Simple, transparent{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
              pricing
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Start free, upgrade when you need more. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Billing Toggle */}
        <div 
          className={cn(
            'flex items-center justify-center gap-4 mb-12 transition-all duration-700 delay-200',
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
        >
          <span className={cn('text-sm', !isYearly && 'text-muted-foreground')}>
            Monthly
          </span>
          <Switch
            checked={isYearly}
            onCheckedChange={setIsYearly}
          />
          <span className={cn('text-sm', isYearly && 'text-muted-foreground')}>
            Yearly
          </span>
          {isYearly && (
            <Badge variant="secondary" className="ml-2">
              Save 20%
            </Badge>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
          {pricingTiers.map((tier, index) => (
            <PricingCard 
              key={tier.id} 
              tier={tier} 
              isYearly={isYearly}
              index={index}
            />
          ))}
        </div>

        {/* FAQ Link */}
        <div 
          className={cn(
            'mt-12 text-center transition-all duration-700 delay-500',
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
        >
          <p className="text-muted-foreground">
            Have questions?{' '}
            <a href="#" className="text-primary hover:underline">
              Check our FAQ
            </a>{' '}
            or{' '}
            <a href="#" className="text-primary hover:underline">
              contact us
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
