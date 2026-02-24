export { enrichSchema } from "./enricher";
export { resolveAssetType, buildPhotoQuery, shouldUseIllustration } from "./resolver";
export { fetchContextualPhoto, buildImageDimensions, isPhotoComponent } from "./photos";
export { getIllustration, matchIllustration, listCategories } from "./illustrations";
export type { AssetType, AssetContext, AssetResult, AssetQuery } from "./types";
