const PHOTO_PROP_KEYS = new Set([
  'src', 'image', 'photo', 'avatar', 'thumbnail',
  'cover', 'banner', 'backgroundImage', 'heroImage',
]);

const PHOTO_COMPONENT_PATTERNS = [
  'Hero', 'Banner', 'Profile', 'Product', 'Blog',
  'Article', 'Event', 'Team', 'Testimonial',
];

function hashKeywords(keywords: string[]): string {
  const str = keywords.join('-');
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString();
}

export function buildImageDimensions(componentType: string): { w: number; h: number } {
  if (/Hero(Section|Banner)?$|BannerSection/.test(componentType)) {
    return { w: 1200, h: 600 };
  }
  if (/ProductCard|BlogCard|ArticleCard|NewsCard/.test(componentType)) {
    return { w: 400, h: 300 };
  }
  if (/ProfileCard|TestimonialCard|AvatarCard/.test(componentType)) {
    return { w: 200, h: 200 };
  }
  if (/FeatureCard|PricingCard/.test(componentType)) {
    return { w: 600, h: 400 };
  }
  return { w: 800, h: 450 };
}

export async function fetchContextualPhoto(
  keywords: string[],
  dimensions: { w: number; h: number },
  imageIndex = 0,
): Promise<string> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (accessKey) {
    try {
      const orientation =
        dimensions.w > dimensions.h ? 'landscape' :
        dimensions.h > dimensions.w ? 'portrait' : 'squarish';

      const params = new URLSearchParams({
        query: keywords.join(' '),
        orientation,
      });

      const res = await fetch(
        `https://api.unsplash.com/photos/random?${params.toString()}`,
        { headers: { Authorization: `Client-ID ${accessKey}` } },
      );

      if (!res.ok) {
        const body = await res.text().catch(() => "");
        console.error(`[Assets] Unsplash failed ${res.status} for "${keywords.join(' ')}": ${body}`);
        throw new Error(`Unsplash ${res.status}`);
      }

      const data = await res.json();
      return data.urls.regular;
    } catch (err) {
      console.error('[Assets] Unsplash error, falling back to picsum:', err);
    }
  } else {
    console.warn('[Assets] UNSPLASH_ACCESS_KEY not set — using seeded picsum');
  }

  // Append imageIndex to seed so array items each get a different placeholder
  const seed = `${hashKeywords(keywords)}-${imageIndex}`;
  return `https://picsum.photos/seed/${seed}/${dimensions.w}/${dimensions.h}`;
}

export function isPhotoComponent(componentType: string, propKey: string): boolean {
  if (PHOTO_PROP_KEYS.has(propKey)) return true;
  return PHOTO_COMPONENT_PATTERNS.some((p) => componentType.includes(p));
}
