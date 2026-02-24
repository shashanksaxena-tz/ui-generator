import type { AssetType } from "./types";

const ILLUSTRATION_COMPONENTS = new Set([
  "EmptyState",
  "ErrorState",
  "SuccessState",
  "OnboardingStep",
  "FeatureCard",
  "PricingCard",
  "FeatureHighlight",
  "WelcomeCard",
]);

const IMAGE_PROP_KEYS = new Set([
  "src",
  "image",
  "photo",
  "avatar",
  "cover",
  "thumbnail",
  "banner",
]);

const TRAVEL_KEYWORDS = ["travel", "trip", "destination", "vacation", "flight", "hotel", "tourism"];
const FOOD_KEYWORDS = ["food", "restaurant", "recipe", "cook", "cuisine", "meal", "dining"];
const FITNESS_KEYWORDS = ["fitness", "gym", "workout", "exercise", "health", "training", "yoga"];

function extractTextKeywords(props: Record<string, unknown>): string[] {
  const text = [props.title, props.description]
    .filter((v): v is string => typeof v === "string")
    .join(" ")
    .toLowerCase();

  if (!text) return [];

  if (TRAVEL_KEYWORDS.some((kw) => text.includes(kw))) {
    return ["travel", "destination", "landscape"];
  }
  if (FOOD_KEYWORDS.some((kw) => text.includes(kw))) {
    return ["food", "restaurant", "cuisine"];
  }
  if (FITNESS_KEYWORDS.some((kw) => text.includes(kw))) {
    return ["fitness", "gym", "workout"];
  }

  return text.split(/\s+/).filter((w) => w.length > 3).slice(0, 5);
}

export function shouldUseIllustration(componentType: string): boolean {
  return ILLUSTRATION_COMPONENTS.has(componentType);
}

export function buildPhotoQuery(
  componentType: string,
  props: Record<string, unknown>
): string[] {
  // Check for contextual keywords in props first (applies across all component types)
  const textKeywords = extractTextKeywords(props);
  const text = [props.title, props.description]
    .filter((v): v is string => typeof v === "string")
    .join(" ")
    .toLowerCase();

  if (text && TRAVEL_KEYWORDS.some((kw) => text.includes(kw))) {
    return ["travel", "destination", "landscape"];
  }
  if (text && FOOD_KEYWORDS.some((kw) => text.includes(kw))) {
    return ["food", "restaurant", "cuisine"];
  }
  if (text && FITNESS_KEYWORDS.some((kw) => text.includes(kw))) {
    return ["fitness", "gym", "workout"];
  }

  switch (componentType) {
    case "HeroSection":
      return textKeywords.length > 0
        ? textKeywords
        : ["modern", "technology", "business"];

    case "ProductCard":
      return ["product", "ecommerce", "shopping"];

    case "ProfileCard":
    case "AvatarCard":
      return ["person", "portrait", "professional"];

    case "TeamSection":
    case "TeamCard":
      return ["team", "office", "collaboration"];

    case "TestimonialCard":
      return ["person", "smile", "professional"];

    case "BlogCard":
    case "ArticleCard":
    case "PostCard":
      return ["writing", "content", "creative"];

    case "EventCard":
      return ["event", "conference", "gathering"];

    default:
      return ["abstract", "minimal", "modern"];
  }
}

const ALT_STOP_WORDS = new Set([
  "front", "back", "side", "view", "detail", "shot",
  "worn", "by", "model", "a", "an", "the", "of", "in",
  "on", "at", "with", "and", "or", "for", "image", "photo",
]);

// Extract meaningful query keywords from an image alt text.
// "Everest Expedition Parka front view" → ["everest", "expedition", "parka"]
export function buildQueryFromAltText(altText: string): string[] {
  const words = altText
    .toLowerCase()
    .split(/[\s\-_,]+/)
    .filter((w) => w.length > 2 && !ALT_STOP_WORDS.has(w));
  return words.slice(0, 4);
}

export function resolveAssetType(
  componentType: string,
  props: Record<string, unknown>
): AssetType {
  if (shouldUseIllustration(componentType)) {
    return "illustration";
  }

  const propKeys = Object.keys(props);
  if (propKeys.some((key) => IMAGE_PROP_KEYS.has(key))) {
    return "photo";
  }

  return "icon";
}
