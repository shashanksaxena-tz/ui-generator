// Asset system type definitions

export type AssetType = "photo" | "illustration" | "icon" | "gradient";

export interface AssetContext {
  componentType: string;
  semanticContext: string;
  dominantTheme?: string;
}

export interface AssetResult {
  type: AssetType;
  url?: string;
  svgContent?: string;
  altText: string;
}

export interface AssetQuery {
  keywords: string[];
  style: "photo" | "illustration";
  aspectRatio: "landscape" | "portrait" | "square";
}
