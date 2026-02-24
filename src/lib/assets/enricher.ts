import type { ReactInterfaceSchema, SchemaNode } from "@/types";
import { buildPhotoQuery, shouldUseIllustration, buildQueryFromAltText } from "./resolver";
import { fetchContextualPhoto, buildImageDimensions, isPhotoComponent } from "./photos";
import { getIllustration, matchIllustration } from "./illustrations";

const IMAGE_ARRAY_KEYS = new Set([
  "images", "items", "gallery", "slides", "photos",
  "thumbnails", "cards", "media", "assets",
]);

function isPlaceholderUrl(url: string): boolean {
  return (
    url.includes("picsum.photos") ||
    url.includes("placeholder.com") ||
    url.includes("via.placeholder")
  );
}

// Enrich an array of image objects: [{src, alt, ...}]
async function enrichImageArray(
  items: Record<string, unknown>[],
  componentType: string,
  componentContext: Record<string, unknown>
): Promise<Record<string, unknown>[]> {
  return Promise.all(
    items.map(async (item, i) => {
      if (typeof item.src === "string" && isPlaceholderUrl(item.src)) {
        // Prefer alt text for semantic query — it's the most specific context available
        const altText = typeof item.alt === "string" ? item.alt : "";
        const keywords =
          altText.length > 3
            ? buildQueryFromAltText(altText)
            : buildPhotoQuery(componentType, componentContext);
        const dims = buildImageDimensions(componentType);
        // Pass index so each image in the array gets a unique picsum seed
        return { ...item, src: await fetchContextualPhoto(keywords, dims, i) };
      }
      return item;
    })
  );
}

async function enrichNode(node: SchemaNode): Promise<SchemaNode> {
  const props = { ...(node.props ?? {}) };
  const componentType = node.type;

  // Enrich illustration components
  if (shouldUseIllustration(componentType) && !props.illustration) {
    const semanticContext = String(props.title ?? props.heading ?? "");
    const category = matchIllustration(componentType, semanticContext);
    props.illustration = getIllustration(category);
  }

  // Enrich top-level string props (src, image, cover, etc.)
  for (const key of Object.keys(props)) {
    const val = props[key];
    if (
      typeof val === "string" &&
      isPlaceholderUrl(val) &&
      isPhotoComponent(componentType, key)
    ) {
      const keywords = buildPhotoQuery(componentType, props as Record<string, unknown>);
      const dims = buildImageDimensions(componentType);
      props[key] = await fetchContextualPhoto(keywords, dims);
    }
  }

  // Enrich nested image arrays: images/gallery/slides/etc.
  for (const key of Object.keys(props)) {
    if (!IMAGE_ARRAY_KEYS.has(key)) continue;
    const val = props[key];
    if (!Array.isArray(val)) continue;

    const isImageArray = val.some(
      (item) => item && typeof item === "object" && typeof (item as Record<string, unknown>).src === "string"
    );
    if (isImageArray) {
      props[key] = await enrichImageArray(
        val as Record<string, unknown>[],
        componentType,
        props as Record<string, unknown>
      );
    }
  }

  // Recurse into children
  if (Array.isArray(node.children)) {
    node.children = await Promise.all(node.children.map(enrichNode));
  }

  return { ...node, props };
}

export async function enrichSchema(schema: ReactInterfaceSchema): Promise<ReactInterfaceSchema> {
  const enrichedRoot = await enrichNode(schema.root);
  return { ...schema, root: enrichedRoot };
}
