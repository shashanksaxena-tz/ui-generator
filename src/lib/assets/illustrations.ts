export type IllustrationCategory =
  | "analytics"
  | "empty-state"
  | "success"
  | "error"
  | "onboarding"
  | "features"
  | "pricing"
  | "team"
  | "security"
  | "productivity";

const illustrations: Record<IllustrationCategory, string[]> = {
  analytics: [
    `<svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="anal-g1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="var(--asset-primary, #6366f1)"/>
      <stop offset="100%" stop-color="var(--asset-secondary, #8b5cf6)"/>
    </linearGradient>
    <linearGradient id="anal-g2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="var(--asset-accent, #ec4899)"/>
      <stop offset="100%" stop-color="var(--asset-secondary, #8b5cf6)"/>
    </linearGradient>
    <filter id="anal-shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="var(--asset-primary, #6366f1)" flood-opacity="0.15"/>
    </filter>
  </defs>
  <!-- Background grid dots -->
  <g opacity="0.12">
    ${Array.from({ length: 8 }, (_, r) => Array.from({ length: 10 }, (_, c) => `<circle cx="${50 + c * 35}" cy="${30 + r * 35}" r="1.5" fill="var(--asset-neutral, #e2e8f0)"/>`).join("")).join("")}
  </g>
  <!-- Bar chart -->
  <g filter="url(#anal-shadow)">
    <rect x="60" y="180" width="28" height="70" rx="4" fill="url(#anal-g1)" opacity="0.7"/>
    <rect x="100" y="140" width="28" height="110" rx="4" fill="url(#anal-g1)" opacity="0.85"/>
    <rect x="140" y="100" width="28" height="150" rx="4" fill="url(#anal-g1)"/>
    <rect x="180" y="155" width="28" height="95" rx="4" fill="url(#anal-g2)" opacity="0.8"/>
    <rect x="220" y="120" width="28" height="130" rx="4" fill="url(#anal-g2)"/>
  </g>
  <!-- Trend line -->
  <polyline points="74,170 114,128 154,88 194,143 234,108" stroke="var(--asset-accent, #ec4899)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <g>
    <circle cx="74" cy="170" r="4" fill="white" stroke="var(--asset-accent, #ec4899)" stroke-width="2"/>
    <circle cx="114" cy="128" r="4" fill="white" stroke="var(--asset-accent, #ec4899)" stroke-width="2"/>
    <circle cx="154" cy="88" r="4" fill="white" stroke="var(--asset-accent, #ec4899)" stroke-width="2"/>
    <circle cx="194" cy="143" r="4" fill="white" stroke="var(--asset-accent, #ec4899)" stroke-width="2"/>
    <circle cx="234" cy="108" r="4" fill="white" stroke="var(--asset-accent, #ec4899)" stroke-width="2"/>
  </g>
  <!-- Circular metric -->
  <circle cx="320" cy="100" r="45" stroke="var(--asset-neutral, #e2e8f0)" stroke-width="6" fill="none"/>
  <circle cx="320" cy="100" r="45" stroke="url(#anal-g1)" stroke-width="6" fill="none" stroke-dasharray="212 71" stroke-linecap="round" transform="rotate(-90 320 100)"/>
  <text x="320" y="105" text-anchor="middle" font-size="18" font-weight="700" fill="var(--asset-primary, #6366f1)" font-family="system-ui">75%</text>
  <!-- Mini sparkline -->
  <polyline points="285,200 298,190 311,195 324,180 337,185 350,170" stroke="var(--asset-secondary, #8b5cf6)" stroke-width="2" stroke-linecap="round" fill="none"/>
  <!-- Decorative dots -->
  <circle cx="290" cy="240" r="3" fill="var(--asset-accent, #ec4899)" opacity="0.4"/>
  <circle cx="310" cy="250" r="5" fill="var(--asset-primary, #6366f1)" opacity="0.25"/>
  <circle cx="340" cy="235" r="4" fill="var(--asset-secondary, #8b5cf6)" opacity="0.3"/>
</svg>`,
  ],

  "empty-state": [
    `<svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="empty-g1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="var(--asset-primary, #6366f1)" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="var(--asset-secondary, #8b5cf6)" stop-opacity="0.04"/>
    </linearGradient>
    <linearGradient id="empty-g2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="var(--asset-primary, #6366f1)"/>
      <stop offset="100%" stop-color="var(--asset-secondary, #8b5cf6)"/>
    </linearGradient>
    <filter id="empty-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <!-- Large soft background circle -->
  <circle cx="200" cy="145" r="95" fill="url(#empty-g1)"/>
  <!-- Empty folder shape -->
  <g transform="translate(140, 90)" filter="url(#empty-glow)">
    <path d="M0,30 L0,95 Q0,100 5,100 L115,100 Q120,100 120,95 L120,30 Z" fill="white" stroke="var(--asset-neutral, #e2e8f0)" stroke-width="2" stroke-linejoin="round"/>
    <path d="M0,30 L0,10 Q0,5 5,5 L40,5 Q45,5 47,10 L53,22 Q55,27 60,27 L120,27 L120,30 Z" fill="white" stroke="var(--asset-neutral, #e2e8f0)" stroke-width="2" stroke-linejoin="round"/>
    <!-- Folder tab accent -->
    <path d="M2,30 L2,12 Q2,7 7,7 L39,7 Q44,7 46,12 L52,24 Q54,29 59,29 L118,29 L118,30 Z" fill="var(--asset-primary, #6366f1)" opacity="0.06"/>
  </g>
  <!-- Dotted empty content lines -->
  <g stroke="var(--asset-neutral, #e2e8f0)" stroke-width="2" stroke-dasharray="6 4" stroke-linecap="round">
    <line x1="170" y1="140" x2="230" y2="140"/>
    <line x1="175" y1="155" x2="225" y2="155"/>
    <line x1="180" y1="170" x2="220" y2="170"/>
  </g>
  <!-- Sparkle top-right -->
  <g transform="translate(280, 70)" stroke="var(--asset-primary, #6366f1)" stroke-width="2" stroke-linecap="round" opacity="0.5">
    <line x1="0" y1="-8" x2="0" y2="8"/>
    <line x1="-8" y1="0" x2="8" y2="0"/>
    <line x1="-5" y1="-5" x2="5" y2="5"/>
    <line x1="5" y1="-5" x2="-5" y2="5"/>
  </g>
  <!-- Small sparkle -->
  <g transform="translate(120, 85)" stroke="var(--asset-accent, #ec4899)" stroke-width="1.5" stroke-linecap="round" opacity="0.4">
    <line x1="0" y1="-5" x2="0" y2="5"/>
    <line x1="-5" y1="0" x2="5" y2="0"/>
  </g>
  <!-- Gentle curved path below folder -->
  <path d="M130,220 Q200,240 270,220" stroke="var(--asset-secondary, #8b5cf6)" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.3" stroke-dasharray="4 6"/>
  <!-- Decorative floating dots -->
  <circle cx="310" cy="120" r="4" fill="var(--asset-accent, #ec4899)" opacity="0.2"/>
  <circle cx="100" cy="160" r="3" fill="var(--asset-primary, #6366f1)" opacity="0.2"/>
  <circle cx="295" cy="200" r="5" fill="var(--asset-secondary, #8b5cf6)" opacity="0.15"/>
  <circle cx="115" cy="220" r="3" fill="var(--asset-accent, #ec4899)" opacity="0.15"/>
</svg>`,
  ],

  success: [
    `<svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="success-g1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
    <linearGradient id="success-g2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="var(--asset-primary, #6366f1)"/>
      <stop offset="100%" stop-color="var(--asset-secondary, #8b5cf6)"/>
    </linearGradient>
    <filter id="success-glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <!-- Radiating lines -->
  <g stroke="#10b981" stroke-width="2" stroke-linecap="round" opacity="0.2">
    <line x1="200" y1="50" x2="200" y2="70"/>
    <line x1="250" y1="60" x2="240" y2="78"/>
    <line x1="285" y1="95" x2="270" y2="108"/>
    <line x1="300" y1="145" x2="280" y2="145"/>
    <line x1="285" y1="195" x2="270" y2="182"/>
    <line x1="150" y1="60" x2="160" y2="78"/>
    <line x1="115" y1="95" x2="130" y2="108"/>
    <line x1="100" y1="145" x2="120" y2="145"/>
    <line x1="115" y1="195" x2="130" y2="182"/>
  </g>
  <!-- Outer ring -->
  <circle cx="200" cy="140" r="70" stroke="#10b981" stroke-width="3" fill="none" opacity="0.15"/>
  <!-- Middle ring -->
  <circle cx="200" cy="140" r="55" stroke="#10b981" stroke-width="2" fill="none" opacity="0.1"/>
  <!-- Main circle -->
  <circle cx="200" cy="140" r="50" fill="url(#success-g1)" filter="url(#success-glow)" opacity="0.9"/>
  <!-- Check mark -->
  <polyline points="178,140 192,155 224,123" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Confetti dots -->
  <circle cx="120" cy="80" r="4" fill="var(--asset-accent, #ec4899)" opacity="0.5"/>
  <circle cx="290" cy="75" r="3" fill="var(--asset-primary, #6366f1)" opacity="0.5"/>
  <circle cx="310" cy="100" r="5" fill="#10b981" opacity="0.3"/>
  <circle cx="95" cy="120" r="3" fill="var(--asset-secondary, #8b5cf6)" opacity="0.4"/>
  <circle cx="280" cy="210" r="4" fill="var(--asset-accent, #ec4899)" opacity="0.3"/>
  <circle cx="130" cy="215" r="3" fill="#10b981" opacity="0.35"/>
  <circle cx="100" cy="190" r="2" fill="var(--asset-primary, #6366f1)" opacity="0.4"/>
  <circle cx="305" cy="170" r="3" fill="var(--asset-secondary, #8b5cf6)" opacity="0.3"/>
  <!-- Confetti shapes -->
  <rect x="265" y="65" width="6" height="6" rx="1" fill="var(--asset-primary, #6366f1)" opacity="0.35" transform="rotate(30 268 68)"/>
  <rect x="140" y="70" width="5" height="5" rx="1" fill="#10b981" opacity="0.4" transform="rotate(-20 142 72)"/>
  <rect x="315" y="145" width="4" height="4" rx="1" fill="var(--asset-accent, #ec4899)" opacity="0.35" transform="rotate(45 317 147)"/>
  <rect x="85" y="155" width="5" height="5" rx="1" fill="var(--asset-secondary, #8b5cf6)" opacity="0.3" transform="rotate(15 87 157)"/>
  <!-- Ascending circles -->
  <circle cx="145" cy="240" r="12" fill="var(--asset-neutral, #e2e8f0)" opacity="0.3"/>
  <circle cx="185" cy="235" r="15" fill="var(--asset-neutral, #e2e8f0)" opacity="0.25"/>
  <circle cx="230" cy="238" r="10" fill="var(--asset-neutral, #e2e8f0)" opacity="0.2"/>
</svg>`,
  ],

  error: [
    `<svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="error-g1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ef4444"/>
      <stop offset="100%" stop-color="#dc2626"/>
    </linearGradient>
    <linearGradient id="error-g2" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="var(--asset-primary, #6366f1)" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#ef4444" stop-opacity="0.05"/>
    </linearGradient>
    <filter id="error-shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#ef4444" flood-opacity="0.2"/>
    </filter>
  </defs>
  <!-- Soft background blob -->
  <ellipse cx="200" cy="150" rx="120" ry="100" fill="url(#error-g2)"/>
  <!-- Disconnected cable left -->
  <path d="M70,150 Q120,130 150,145" stroke="var(--asset-neutral, #e2e8f0)" stroke-width="3" stroke-linecap="round" fill="none"/>
  <path d="M150,145 L165,148" stroke="#ef4444" stroke-width="3" stroke-linecap="round" fill="none" stroke-dasharray="3 3"/>
  <!-- Disconnected cable right -->
  <path d="M235,148 L250,145" stroke="#ef4444" stroke-width="3" stroke-linecap="round" fill="none" stroke-dasharray="3 3"/>
  <path d="M250,145 Q280,130 330,150" stroke="var(--asset-neutral, #e2e8f0)" stroke-width="3" stroke-linecap="round" fill="none"/>
  <!-- Cable end connectors -->
  <rect x="158" y="140" width="14" height="16" rx="2" fill="white" stroke="var(--asset-neutral, #e2e8f0)" stroke-width="2"/>
  <rect x="228" y="140" width="14" height="16" rx="2" fill="white" stroke="var(--asset-neutral, #e2e8f0)" stroke-width="2"/>
  <!-- Warning diamond -->
  <g filter="url(#error-shadow)">
    <rect x="180" y="100" width="40" height="40" rx="4" fill="url(#error-g1)" transform="rotate(45 200 120)"/>
    <text x="200" y="126" text-anchor="middle" font-size="20" font-weight="700" fill="white" font-family="system-ui">!</text>
  </g>
  <!-- Jagged disruption lines -->
  <polyline points="100,90 108,85 112,92 120,82 125,90" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.3"/>
  <polyline points="280,90 288,82 292,90 300,84 305,92" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.3"/>
  <!-- Subtle broken circle -->
  <path d="M200,60 A80,80 0 0,1 265,105" stroke="var(--asset-neutral, #e2e8f0)" stroke-width="1.5" fill="none" stroke-dasharray="4 4" opacity="0.4"/>
  <path d="M135,105 A80,80 0 0,1 200,60" stroke="var(--asset-neutral, #e2e8f0)" stroke-width="1.5" fill="none" stroke-dasharray="4 4" opacity="0.4"/>
  <path d="M265,105 A80,80 0 0,0 260,180" stroke="#ef4444" stroke-width="1.5" fill="none" opacity="0.15"/>
  <path d="M140,180 A80,80 0 0,0 135,105" stroke="#ef4444" stroke-width="1.5" fill="none" opacity="0.15"/>
  <!-- Decorative scattered elements -->
  <circle cx="90" cy="200" r="3" fill="#ef4444" opacity="0.2"/>
  <circle cx="320" cy="195" r="4" fill="var(--asset-neutral, #e2e8f0)" opacity="0.3"/>
  <circle cx="130" cy="230" r="2" fill="var(--asset-primary, #6366f1)" opacity="0.2"/>
  <circle cx="275" cy="225" r="3" fill="#ef4444" opacity="0.15"/>
  <!-- Cross marks -->
  <g stroke="#ef4444" stroke-width="1.5" stroke-linecap="round" opacity="0.2">
    <line x1="330" y1="85" x2="340" y2="95"/>
    <line x1="340" y1="85" x2="330" y2="95"/>
  </g>
  <g stroke="#ef4444" stroke-width="1.5" stroke-linecap="round" opacity="0.15">
    <line x1="65" y1="105" x2="73" y2="113"/>
    <line x1="73" y1="105" x2="65" y2="113"/>
  </g>
</svg>`,
  ],

  onboarding: [
    `<svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="onboard-g1" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="var(--asset-primary, #6366f1)"/>
      <stop offset="100%" stop-color="var(--asset-secondary, #8b5cf6)"/>
    </linearGradient>
    <linearGradient id="onboard-g2" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="var(--asset-secondary, #8b5cf6)"/>
      <stop offset="100%" stop-color="var(--asset-accent, #ec4899)"/>
    </linearGradient>
    <filter id="onboard-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <!-- Winding path -->
  <path d="M60,220 Q110,220 130,180 Q150,140 200,150 Q250,160 270,120 Q290,80 340,80" stroke="url(#onboard-g1)" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.3"/>
  <!-- Path dashed overlay for journey feel -->
  <path d="M60,220 Q110,220 130,180 Q150,140 200,150 Q250,160 270,120 Q290,80 340,80" stroke="url(#onboard-g2)" stroke-width="2" stroke-linecap="round" fill="none" stroke-dasharray="8 6" opacity="0.5"/>
  <!-- Milestone 1 -->
  <circle cx="60" cy="220" r="14" fill="white" stroke="var(--asset-primary, #6366f1)" stroke-width="2.5"/>
  <circle cx="60" cy="220" r="6" fill="var(--asset-primary, #6366f1)"/>
  <text x="60" y="250" text-anchor="middle" font-size="11" fill="var(--asset-primary, #6366f1)" font-family="system-ui" opacity="0.7">Start</text>
  <!-- Milestone 2 -->
  <circle cx="165" cy="160" r="12" fill="white" stroke="var(--asset-secondary, #8b5cf6)" stroke-width="2.5"/>
  <circle cx="165" cy="160" r="5" fill="var(--asset-secondary, #8b5cf6)"/>
  <!-- Milestone 3 -->
  <circle cx="270" cy="120" r="12" fill="white" stroke="var(--asset-accent, #ec4899)" stroke-width="2.5"/>
  <circle cx="270" cy="120" r="5" fill="var(--asset-accent, #ec4899)"/>
  <!-- Destination -->
  <circle cx="340" cy="80" r="18" fill="url(#onboard-g2)" filter="url(#onboard-glow)"/>
  <circle cx="340" cy="80" r="18" fill="none" stroke="white" stroke-width="2" opacity="0.5"/>
  <!-- Arrow at destination -->
  <polyline points="334,80 340,74 346,80" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <line x1="340" y1="74" x2="340" y2="88" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Progress bar -->
  <rect x="100" y="265" width="200" height="6" rx="3" fill="var(--asset-neutral, #e2e8f0)"/>
  <rect x="100" y="265" width="140" height="6" rx="3" fill="url(#onboard-g1)"/>
  <!-- Decorative elements -->
  <circle cx="110" cy="100" r="3" fill="var(--asset-primary, #6366f1)" opacity="0.2"/>
  <circle cx="320" cy="180" r="4" fill="var(--asset-accent, #ec4899)" opacity="0.2"/>
  <circle cx="80" cy="140" r="2" fill="var(--asset-secondary, #8b5cf6)" opacity="0.25"/>
  <!-- Sparkle near destination -->
  <g transform="translate(370, 60)" stroke="var(--asset-accent, #ec4899)" stroke-width="1.5" stroke-linecap="round" opacity="0.4">
    <line x1="0" y1="-6" x2="0" y2="6"/>
    <line x1="-6" y1="0" x2="6" y2="0"/>
  </g>
  <g transform="translate(355, 50)" stroke="var(--asset-primary, #6366f1)" stroke-width="1" stroke-linecap="round" opacity="0.3">
    <line x1="0" y1="-4" x2="0" y2="4"/>
    <line x1="-4" y1="0" x2="4" y2="0"/>
  </g>
</svg>`,
  ],

  features: [
    `<svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="feat-g1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="var(--asset-primary, #6366f1)"/>
      <stop offset="100%" stop-color="var(--asset-secondary, #8b5cf6)"/>
    </linearGradient>
    <linearGradient id="feat-g2" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="var(--asset-accent, #ec4899)"/>
      <stop offset="100%" stop-color="var(--asset-secondary, #8b5cf6)"/>
    </linearGradient>
    <filter id="feat-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="5" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <!-- Large star shape -->
  <g transform="translate(200, 130)" filter="url(#feat-glow)">
    <polygon points="0,-55 15,-18 52,-18 22,5 33,42 0,20 -33,42 -22,5 -52,-18 -15,-18" fill="url(#feat-g1)" opacity="0.15"/>
    <polygon points="0,-45 12,-15 42,-15 18,4 27,34 0,16 -27,34 -18,4 -42,-15 -12,-15" fill="url(#feat-g1)" opacity="0.2" stroke="var(--asset-primary, #6366f1)" stroke-width="1.5" stroke-linejoin="round"/>
  </g>
  <!-- Sparkle cluster top-right -->
  <g transform="translate(310, 70)">
    <line x1="0" y1="-12" x2="0" y2="12" stroke="var(--asset-accent, #ec4899)" stroke-width="2" stroke-linecap="round"/>
    <line x1="-12" y1="0" x2="12" y2="0" stroke="var(--asset-accent, #ec4899)" stroke-width="2" stroke-linecap="round"/>
    <line x1="-8" y1="-8" x2="8" y2="8" stroke="var(--asset-accent, #ec4899)" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="8" y1="-8" x2="-8" y2="8" stroke="var(--asset-accent, #ec4899)" stroke-width="1.5" stroke-linecap="round"/>
  </g>
  <!-- Small sparkle top-left -->
  <g transform="translate(95, 85)">
    <line x1="0" y1="-8" x2="0" y2="8" stroke="var(--asset-primary, #6366f1)" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
    <line x1="-8" y1="0" x2="8" y2="0" stroke="var(--asset-primary, #6366f1)" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
  </g>
  <!-- Small sparkle bottom-left -->
  <g transform="translate(110, 210)">
    <line x1="0" y1="-6" x2="0" y2="6" stroke="var(--asset-secondary, #8b5cf6)" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>
    <line x1="-6" y1="0" x2="6" y2="0" stroke="var(--asset-secondary, #8b5cf6)" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>
  </g>
  <!-- Horizontal capability bars -->
  <g opacity="0.8">
    <rect x="110" y="200" width="180" height="10" rx="5" fill="var(--asset-neutral, #e2e8f0)"/>
    <rect x="110" y="200" width="150" height="10" rx="5" fill="url(#feat-g1)"/>
  </g>
  <g opacity="0.6">
    <rect x="120" y="220" width="160" height="10" rx="5" fill="var(--asset-neutral, #e2e8f0)"/>
    <rect x="120" y="220" width="120" height="10" rx="5" fill="url(#feat-g2)"/>
  </g>
  <g opacity="0.4">
    <rect x="130" y="240" width="140" height="10" rx="5" fill="var(--asset-neutral, #e2e8f0)"/>
    <rect x="130" y="240" width="100" height="10" rx="5" fill="url(#feat-g1)"/>
  </g>
  <!-- Decorative dots -->
  <circle cx="340" cy="190" r="4" fill="var(--asset-primary, #6366f1)" opacity="0.15"/>
  <circle cx="70" cy="150" r="5" fill="var(--asset-accent, #ec4899)" opacity="0.12"/>
  <circle cx="330" cy="240" r="3" fill="var(--asset-secondary, #8b5cf6)" opacity="0.2"/>
  <circle cx="80" cy="250" r="4" fill="var(--asset-primary, #6366f1)" opacity="0.1"/>
  <!-- Floating diamond -->
  <rect x="340" y="140" width="12" height="12" rx="2" fill="var(--asset-accent, #ec4899)" opacity="0.2" transform="rotate(45 346 146)"/>
</svg>`,
  ],

  pricing: [
    `<svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="price-g1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="var(--asset-primary, #6366f1)"/>
      <stop offset="100%" stop-color="var(--asset-secondary, #8b5cf6)"/>
    </linearGradient>
    <linearGradient id="price-g2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="var(--asset-accent, #ec4899)"/>
      <stop offset="100%" stop-color="var(--asset-secondary, #8b5cf6)"/>
    </linearGradient>
    <filter id="price-shadow" x="-10%" y="-5%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="var(--asset-primary, #6366f1)" flood-opacity="0.12"/>
    </filter>
  </defs>
  <!-- Card 1 (Basic) -->
  <g filter="url(#price-shadow)">
    <rect x="60" y="120" width="75" height="130" rx="8" fill="white" stroke="var(--asset-neutral, #e2e8f0)" stroke-width="2"/>
    <rect x="60" y="120" width="75" height="30" rx="8" fill="var(--asset-neutral, #e2e8f0)" opacity="0.3"/>
    <rect x="60" y="140" width="75" height="10" fill="var(--asset-neutral, #e2e8f0)" opacity="0.3"/>
    <!-- Price line -->
    <line x1="75" y1="170" x2="120" y2="170" stroke="var(--asset-neutral, #e2e8f0)" stroke-width="2" stroke-linecap="round"/>
    <!-- Feature lines -->
    <line x1="75" y1="190" x2="115" y2="190" stroke="var(--asset-neutral, #e2e8f0)" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
    <line x1="75" y1="202" x2="110" y2="202" stroke="var(--asset-neutral, #e2e8f0)" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
    <line x1="75" y1="214" x2="108" y2="214" stroke="var(--asset-neutral, #e2e8f0)" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
    <!-- Check marks -->
    <circle cx="75" cy="190" r="3" fill="var(--asset-primary, #6366f1)" opacity="0.3"/>
    <circle cx="75" cy="202" r="3" fill="var(--asset-primary, #6366f1)" opacity="0.3"/>
  </g>
  <!-- Card 2 (Pro - highlighted) -->
  <g filter="url(#price-shadow)">
    <rect x="162" y="90" width="80" height="160" rx="8" fill="white" stroke="var(--asset-primary, #6366f1)" stroke-width="2"/>
    <rect x="162" y="90" width="80" height="35" rx="8" fill="url(#price-g1)"/>
    <rect x="162" y="115" width="80" height="10" fill="url(#price-g1)"/>
    <!-- Badge -->
    <rect x="178" y="83" width="48" height="18" rx="9" fill="var(--asset-accent, #ec4899)"/>
    <text x="202" y="96" text-anchor="middle" font-size="9" fill="white" font-weight="600" font-family="system-ui">POPULAR</text>
    <!-- Price -->
    <text x="202" y="150" text-anchor="middle" font-size="20" font-weight="700" fill="var(--asset-primary, #6366f1)" font-family="system-ui">$49</text>
    <!-- Feature lines -->
    <line x1="178" y1="170" x2="225" y2="170" stroke="var(--asset-neutral, #e2e8f0)" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
    <line x1="178" y1="184" x2="220" y2="184" stroke="var(--asset-neutral, #e2e8f0)" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
    <line x1="178" y1="198" x2="222" y2="198" stroke="var(--asset-neutral, #e2e8f0)" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
    <line x1="178" y1="212" x2="218" y2="212" stroke="var(--asset-neutral, #e2e8f0)" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
    <!-- Check marks -->
    <circle cx="178" cy="170" r="3" fill="var(--asset-primary, #6366f1)" opacity="0.6"/>
    <circle cx="178" cy="184" r="3" fill="var(--asset-primary, #6366f1)" opacity="0.6"/>
    <circle cx="178" cy="198" r="3" fill="var(--asset-primary, #6366f1)" opacity="0.6"/>
    <circle cx="178" cy="212" r="3" fill="var(--asset-primary, #6366f1)" opacity="0.6"/>
    <!-- CTA button -->
    <rect x="172" y="228" width="60" height="14" rx="7" fill="url(#price-g1)"/>
  </g>
  <!-- Card 3 (Enterprise) -->
  <g filter="url(#price-shadow)">
    <rect x="268" y="110" width="75" height="140" rx="8" fill="white" stroke="var(--asset-neutral, #e2e8f0)" stroke-width="2"/>
    <rect x="268" y="110" width="75" height="30" rx="8" fill="var(--asset-secondary, #8b5cf6)" opacity="0.1"/>
    <rect x="268" y="130" width="75" height="10" fill="var(--asset-secondary, #8b5cf6)" opacity="0.1"/>
    <!-- Price line -->
    <line x1="283" y1="160" x2="328" y2="160" stroke="var(--asset-neutral, #e2e8f0)" stroke-width="2" stroke-linecap="round"/>
    <!-- Feature lines -->
    <line x1="283" y1="180" x2="323" y2="180" stroke="var(--asset-neutral, #e2e8f0)" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
    <line x1="283" y1="192" x2="318" y2="192" stroke="var(--asset-neutral, #e2e8f0)" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
    <line x1="283" y1="204" x2="320" y2="204" stroke="var(--asset-neutral, #e2e8f0)" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
    <line x1="283" y1="216" x2="315" y2="216" stroke="var(--asset-neutral, #e2e8f0)" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
    <!-- Check marks -->
    <circle cx="283" cy="180" r="3" fill="var(--asset-secondary, #8b5cf6)" opacity="0.4"/>
    <circle cx="283" cy="192" r="3" fill="var(--asset-secondary, #8b5cf6)" opacity="0.4"/>
    <circle cx="283" cy="204" r="3" fill="var(--asset-secondary, #8b5cf6)" opacity="0.4"/>
  </g>
  <!-- Decorative elements -->
  <circle cx="50" cy="90" r="4" fill="var(--asset-accent, #ec4899)" opacity="0.2"/>
  <circle cx="355" cy="85" r="3" fill="var(--asset-primary, #6366f1)" opacity="0.2"/>
  <circle cx="40" cy="200" r="3" fill="var(--asset-secondary, #8b5cf6)" opacity="0.15"/>
</svg>`,
  ],

  team: [
    `<svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="team-g1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="var(--asset-primary, #6366f1)"/>
      <stop offset="100%" stop-color="var(--asset-secondary, #8b5cf6)"/>
    </linearGradient>
    <linearGradient id="team-g2" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="var(--asset-accent, #ec4899)"/>
      <stop offset="100%" stop-color="var(--asset-secondary, #8b5cf6)"/>
    </linearGradient>
    <filter id="team-shadow" x="-15%" y="-15%" width="130%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="var(--asset-primary, #6366f1)" flood-opacity="0.1"/>
    </filter>
  </defs>
  <!-- Connection lines (behind people) -->
  <g stroke="var(--asset-neutral, #e2e8f0)" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.5">
    <line x1="140" y1="130" x2="200" y2="110"/>
    <line x1="260" y1="130" x2="200" y2="110"/>
    <line x1="140" y1="130" x2="260" y2="130"/>
    <line x1="110" y1="190" x2="200" y2="200"/>
    <line x1="290" y1="190" x2="200" y2="200"/>
  </g>
  <!-- Person center (leader) -->
  <g filter="url(#team-shadow)">
    <circle cx="200" cy="95" r="22" fill="url(#team-g1)"/>
    <ellipse cx="200" cy="140" rx="20" ry="12" fill="url(#team-g1)" opacity="0.7"/>
  </g>
  <!-- Person left -->
  <g filter="url(#team-shadow)">
    <circle cx="125" cy="120" r="18" fill="var(--asset-secondary, #8b5cf6)" opacity="0.8"/>
    <ellipse cx="125" cy="157" rx="16" ry="10" fill="var(--asset-secondary, #8b5cf6)" opacity="0.5"/>
  </g>
  <!-- Person right -->
  <g filter="url(#team-shadow)">
    <circle cx="275" cy="120" r="18" fill="var(--asset-accent, #ec4899)" opacity="0.7"/>
    <ellipse cx="275" cy="157" rx="16" ry="10" fill="var(--asset-accent, #ec4899)" opacity="0.45"/>
  </g>
  <!-- Person bottom-left -->
  <g>
    <circle cx="110" cy="185" r="15" fill="var(--asset-primary, #6366f1)" opacity="0.5"/>
    <ellipse cx="110" cy="215" rx="13" ry="8" fill="var(--asset-primary, #6366f1)" opacity="0.3"/>
  </g>
  <!-- Person bottom-right -->
  <g>
    <circle cx="290" cy="185" r="15" fill="var(--asset-secondary, #8b5cf6)" opacity="0.5"/>
    <ellipse cx="290" cy="215" rx="13" ry="8" fill="var(--asset-secondary, #8b5cf6)" opacity="0.3"/>
  </g>
  <!-- Center bottom person -->
  <g>
    <circle cx="200" cy="195" r="16" fill="url(#team-g2)" opacity="0.6"/>
    <ellipse cx="200" cy="225" rx="14" ry="9" fill="url(#team-g2)" opacity="0.35"/>
  </g>
  <!-- Overlapping collaboration circles -->
  <circle cx="185" cy="260" r="18" fill="var(--asset-primary, #6366f1)" opacity="0.08"/>
  <circle cx="200" cy="258" r="18" fill="var(--asset-secondary, #8b5cf6)" opacity="0.08"/>
  <circle cx="215" cy="260" r="18" fill="var(--asset-accent, #ec4899)" opacity="0.08"/>
  <!-- Decorative dots -->
  <circle cx="55" cy="100" r="3" fill="var(--asset-primary, #6366f1)" opacity="0.15"/>
  <circle cx="345" cy="100" r="4" fill="var(--asset-accent, #ec4899)" opacity="0.15"/>
  <circle cx="60" cy="230" r="2" fill="var(--asset-secondary, #8b5cf6)" opacity="0.2"/>
  <circle cx="340" cy="225" r="3" fill="var(--asset-primary, #6366f1)" opacity="0.15"/>
</svg>`,
  ],

  security: [
    `<svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sec-g1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="var(--asset-primary, #6366f1)"/>
      <stop offset="100%" stop-color="var(--asset-secondary, #8b5cf6)"/>
    </linearGradient>
    <linearGradient id="sec-g2" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="var(--asset-secondary, #8b5cf6)" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="var(--asset-primary, #6366f1)" stop-opacity="0.05"/>
    </linearGradient>
    <filter id="sec-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <!-- Outer protective ring -->
  <circle cx="200" cy="140" r="110" stroke="var(--asset-neutral, #e2e8f0)" stroke-width="1" fill="none" opacity="0.3" stroke-dasharray="6 4"/>
  <!-- Middle ring -->
  <circle cx="200" cy="140" r="90" stroke="var(--asset-primary, #6366f1)" stroke-width="1.5" fill="none" opacity="0.12" stroke-dasharray="4 4"/>
  <!-- Inner ring -->
  <circle cx="200" cy="140" r="70" stroke="var(--asset-secondary, #8b5cf6)" stroke-width="1" fill="url(#sec-g2)"/>
  <!-- Shield -->
  <g filter="url(#sec-glow)">
    <path d="M200,70 L245,92 L245,148 Q245,180 200,200 Q155,180 155,148 L155,92 Z" fill="url(#sec-g1)" opacity="0.85" stroke="var(--asset-primary, #6366f1)" stroke-width="2" stroke-linejoin="round"/>
    <!-- Shield inner highlight -->
    <path d="M200,80 L238,100 L238,146 Q238,174 200,192 Q162,174 162,146 L162,100 Z" fill="white" opacity="0.1"/>
  </g>
  <!-- Inner geometric pattern on shield -->
  <g opacity="0.4">
    <polygon points="200,100 215,118 215,145 200,155 185,145 185,118" fill="none" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
    <line x1="200" y1="100" x2="200" y2="155" stroke="white" stroke-width="1" opacity="0.5"/>
    <line x1="185" y1="130" x2="215" y2="130" stroke="white" stroke-width="1" opacity="0.5"/>
  </g>
  <!-- Lock shape on shield -->
  <rect x="190" y="124" width="20" height="16" rx="3" fill="white" opacity="0.9"/>
  <path d="M195,124 L195,118 Q195,110 200,110 Q205,110 205,118 L205,124" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/>
  <circle cx="200" cy="132" r="2.5" fill="var(--asset-primary, #6366f1)"/>
  <!-- Keyhole line -->
  <line x1="200" y1="134" x2="200" y2="137" stroke="var(--asset-primary, #6366f1)" stroke-width="2" stroke-linecap="round"/>
  <!-- Decorative corner accents -->
  <path d="M80,60 L80,80" stroke="var(--asset-primary, #6366f1)" stroke-width="1.5" stroke-linecap="round" opacity="0.2"/>
  <path d="M80,60 L100,60" stroke="var(--asset-primary, #6366f1)" stroke-width="1.5" stroke-linecap="round" opacity="0.2"/>
  <path d="M320,60 L320,80" stroke="var(--asset-primary, #6366f1)" stroke-width="1.5" stroke-linecap="round" opacity="0.2"/>
  <path d="M320,60 L300,60" stroke="var(--asset-primary, #6366f1)" stroke-width="1.5" stroke-linecap="round" opacity="0.2"/>
  <path d="M80,230 L80,210" stroke="var(--asset-primary, #6366f1)" stroke-width="1.5" stroke-linecap="round" opacity="0.2"/>
  <path d="M80,230 L100,230" stroke="var(--asset-primary, #6366f1)" stroke-width="1.5" stroke-linecap="round" opacity="0.2"/>
  <path d="M320,230 L320,210" stroke="var(--asset-primary, #6366f1)" stroke-width="1.5" stroke-linecap="round" opacity="0.2"/>
  <path d="M320,230 L300,230" stroke="var(--asset-primary, #6366f1)" stroke-width="1.5" stroke-linecap="round" opacity="0.2"/>
  <!-- Scattered dots -->
  <circle cx="100" cy="100" r="3" fill="var(--asset-accent, #ec4899)" opacity="0.2"/>
  <circle cx="305" cy="95" r="2" fill="var(--asset-primary, #6366f1)" opacity="0.2"/>
  <circle cx="95" cy="200" r="2" fill="var(--asset-secondary, #8b5cf6)" opacity="0.2"/>
  <circle cx="310" cy="190" r="3" fill="var(--asset-accent, #ec4899)" opacity="0.15"/>
</svg>`,
  ],

  productivity: [
    `<svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="prod-g1" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="var(--asset-primary, #6366f1)"/>
      <stop offset="100%" stop-color="var(--asset-secondary, #8b5cf6)"/>
    </linearGradient>
    <linearGradient id="prod-g2" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="var(--asset-accent, #ec4899)"/>
      <stop offset="100%" stop-color="var(--asset-secondary, #8b5cf6)"/>
    </linearGradient>
    <filter id="prod-shadow" x="-10%" y="-5%" width="120%" height="115%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="var(--asset-primary, #6366f1)" flood-opacity="0.1"/>
    </filter>
  </defs>
  <!-- Checklist card -->
  <g filter="url(#prod-shadow)">
    <rect x="60" y="60" width="150" height="180" rx="10" fill="white" stroke="var(--asset-neutral, #e2e8f0)" stroke-width="2"/>
    <!-- Header bar -->
    <rect x="60" y="60" width="150" height="35" rx="10" fill="url(#prod-g1)" opacity="0.1"/>
    <rect x="60" y="85" width="150" height="10" fill="url(#prod-g1)" opacity="0.1"/>
    <!-- Header line -->
    <line x1="80" y1="80" x2="160" y2="80" stroke="var(--asset-primary, #6366f1)" stroke-width="2" stroke-linecap="round" opacity="0.4"/>
    <!-- Check item 1 (completed) -->
    <rect x="80" y="108" width="14" height="14" rx="3" fill="var(--asset-primary, #6366f1)" opacity="0.8"/>
    <polyline points="83,115 87,119 93,111" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <line x1="104" y1="115" x2="185" y2="115" stroke="var(--asset-neutral, #e2e8f0)" stroke-width="2" stroke-linecap="round"/>
    <!-- Check item 2 (completed) -->
    <rect x="80" y="133" width="14" height="14" rx="3" fill="var(--asset-primary, #6366f1)" opacity="0.8"/>
    <polyline points="83,140 87,144 93,136" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <line x1="104" y1="140" x2="175" y2="140" stroke="var(--asset-neutral, #e2e8f0)" stroke-width="2" stroke-linecap="round"/>
    <!-- Check item 3 (in progress) -->
    <rect x="80" y="158" width="14" height="14" rx="3" fill="none" stroke="var(--asset-accent, #ec4899)" stroke-width="2"/>
    <line x1="104" y1="165" x2="180" y2="165" stroke="var(--asset-neutral, #e2e8f0)" stroke-width="2" stroke-linecap="round"/>
    <!-- Check item 4 (pending) -->
    <rect x="80" y="183" width="14" height="14" rx="3" fill="none" stroke="var(--asset-neutral, #e2e8f0)" stroke-width="2"/>
    <line x1="104" y1="190" x2="170" y2="190" stroke="var(--asset-neutral, #e2e8f0)" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
    <!-- Check item 5 (pending) -->
    <rect x="80" y="208" width="14" height="14" rx="3" fill="none" stroke="var(--asset-neutral, #e2e8f0)" stroke-width="2"/>
    <line x1="104" y1="215" x2="165" y2="215" stroke="var(--asset-neutral, #e2e8f0)" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
  </g>
  <!-- Workflow nodes -->
  <g filter="url(#prod-shadow)">
    <!-- Node 1 -->
    <rect x="255" y="75" width="50" height="35" rx="6" fill="white" stroke="var(--asset-primary, #6366f1)" stroke-width="2"/>
    <line x1="268" y1="90" x2="292" y2="90" stroke="var(--asset-primary, #6366f1)" stroke-width="2" stroke-linecap="round" opacity="0.4"/>
    <line x1="268" y1="100" x2="285" y2="100" stroke="var(--asset-neutral, #e2e8f0)" stroke-width="1.5" stroke-linecap="round"/>
    <!-- Arrow down -->
    <line x1="280" y1="110" x2="280" y2="130" stroke="var(--asset-secondary, #8b5cf6)" stroke-width="2" stroke-linecap="round"/>
    <polyline points="275,125 280,132 285,125" stroke="var(--asset-secondary, #8b5cf6)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <!-- Node 2 -->
    <rect x="255" y="135" width="50" height="35" rx="6" fill="white" stroke="var(--asset-secondary, #8b5cf6)" stroke-width="2"/>
    <line x1="268" y1="150" x2="292" y2="150" stroke="var(--asset-secondary, #8b5cf6)" stroke-width="2" stroke-linecap="round" opacity="0.4"/>
    <line x1="268" y1="160" x2="288" y2="160" stroke="var(--asset-neutral, #e2e8f0)" stroke-width="1.5" stroke-linecap="round"/>
    <!-- Arrow to split -->
    <line x1="280" y1="170" x2="280" y2="185" stroke="var(--asset-secondary, #8b5cf6)" stroke-width="2" stroke-linecap="round"/>
    <!-- Split to two nodes -->
    <path d="M280,185 L260,195" stroke="var(--asset-accent, #ec4899)" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M280,185 L300,195" stroke="var(--asset-accent, #ec4899)" stroke-width="1.5" stroke-linecap="round"/>
    <!-- Node 3a -->
    <rect x="237" y="198" width="42" height="28" rx="5" fill="white" stroke="var(--asset-accent, #ec4899)" stroke-width="1.5"/>
    <line x1="247" y1="212" x2="269" y2="212" stroke="var(--asset-neutral, #e2e8f0)" stroke-width="1.5" stroke-linecap="round"/>
    <!-- Node 3b -->
    <rect x="283" y="198" width="42" height="28" rx="5" fill="white" stroke="var(--asset-accent, #ec4899)" stroke-width="1.5"/>
    <line x1="293" y1="212" x2="315" y2="212" stroke="var(--asset-neutral, #e2e8f0)" stroke-width="1.5" stroke-linecap="round"/>
  </g>
  <!-- Progress bar at bottom -->
  <rect x="60" y="260" width="280" height="8" rx="4" fill="var(--asset-neutral, #e2e8f0)"/>
  <rect x="60" y="260" width="160" height="8" rx="4" fill="url(#prod-g1)"/>
  <circle cx="220" cy="264" r="6" fill="var(--asset-primary, #6366f1)" stroke="white" stroke-width="2"/>
  <!-- Decorative dots -->
  <circle cx="345" cy="80" r="3" fill="var(--asset-accent, #ec4899)" opacity="0.2"/>
  <circle cx="350" cy="250" r="4" fill="var(--asset-primary, #6366f1)" opacity="0.15"/>
  <circle cx="40" cy="260" r="3" fill="var(--asset-secondary, #8b5cf6)" opacity="0.2"/>
</svg>`,
  ],
};

export function getIllustration(
  category: IllustrationCategory,
  variant = 0,
): string {
  const variants = illustrations[category];
  return variants[variant % variants.length];
}

export function matchIllustration(
  componentType: string,
  semanticContext: string,
): IllustrationCategory {
  const type = componentType.toLowerCase();
  const ctx = semanticContext.toLowerCase();

  // Direct component type matches
  if (/emptystate|empty.?state|no.?data|no.?results/.test(type)) {
    return "empty-state";
  }
  if (/error(state|page|boundary)|not.?found|404|500/.test(type)) {
    return "error";
  }
  if (/success(state|page)?|confirmation|completed/.test(type)) {
    return "success";
  }
  if (/onboarding|welcome|getting.?started|setup.?wizard/.test(type)) {
    return "onboarding";
  }
  if (/feature(card|grid|section|highlight|list)/.test(type)) {
    return "features";
  }
  if (/pricing(card|table|section|plan|tier)/.test(type)) {
    return "pricing";
  }
  if (/team(section|card|grid|member|page)/.test(type)) {
    return "team";
  }
  if (/security|auth(card|section)?|login|shield|protect/.test(type)) {
    return "security";
  }
  if (/dashboard|analytics|chart|metric|stat/.test(type)) {
    return "analytics";
  }

  // Semantic context fallback
  if (/empty|no items|nothing|blank/.test(ctx)) return "empty-state";
  if (/error|fail|broken|issue|problem/.test(ctx)) return "error";
  if (/success|done|complete|celebrate|congrat/.test(ctx)) return "success";
  if (/welcome|start|begin|intro|onboard|tour/.test(ctx)) return "onboarding";
  if (/feature|capability|benefit|highlight/.test(ctx)) return "features";
  if (/price|plan|tier|billing|subscription|cost/.test(ctx)) return "pricing";
  if (/team|people|member|staff|crew|collaborat/.test(ctx)) return "team";
  if (/secur|protect|privacy|encrypt|auth|lock|shield/.test(ctx))
    return "security";
  if (/data|analytic|chart|metric|insight|dashboard|stat/.test(ctx))
    return "analytics";

  return "productivity";
}

export function listCategories(): IllustrationCategory[] {
  return Object.keys(illustrations) as IllustrationCategory[];
}
