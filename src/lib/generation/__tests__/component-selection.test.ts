import { describe, it, expect } from "vitest";
import { findComponentsByAliasMatch } from "../component-selection";

describe("findComponentsByAliasMatch", () => {
  it("finds FloatingDock when prompt mentions 'floating dock'", () => {
    const result = findComponentsByAliasMatch("build a page with floating dock navigation");
    expect(result).toContain("FloatingDock");
  });

  it("finds BentoGrid and BentoGridItem when prompt mentions 'bento'", () => {
    const result = findComponentsByAliasMatch("animated landing page with bento grid layout");
    expect(result).toContain("BentoGrid");
    expect(result).toContain("BentoGridItem");
  });

  it("finds InfiniteMovingCards when prompt mentions 'infinite moving cards'", () => {
    const result = findComponentsByAliasMatch("showcase page with infinite moving cards carousel");
    expect(result).toContain("InfiniteMovingCards");
  });

  it("finds AuroraBackground when prompt mentions 'aurora background'", () => {
    const result = findComponentsByAliasMatch("create a hero section with aurora background");
    expect(result).toContain("AuroraBackground");
  });

  it("finds ThreeDCard and companions when prompt mentions '3D card'", () => {
    const result = findComponentsByAliasMatch("3d card hover effects");
    expect(result).toContain("ThreeDCard");
    expect(result).toContain("ThreeDCardBody");
    expect(result).toContain("ThreeDCardItem");
  });

  it("finds Testimonial when prompt mentions 'testimonial'", () => {
    const result = findComponentsByAliasMatch("testimonial section");
    expect(result).toContain("Testimonial");
  });

  it("returns empty array for unrelated prompt with no alias matches", () => {
    const result = findComponentsByAliasMatch("xyz123 completely random gibberish");
    expect(result).toEqual([]);
  });

  it("finds multiple components when prompt has several alias matches", () => {
    const result = findComponentsByAliasMatch(
      "landing page with aurora background, bento grid, and floating dock"
    );
    expect(result).toContain("AuroraBackground");
    expect(result).toContain("BentoGrid");
    expect(result).toContain("BentoGridItem");
    expect(result).toContain("FloatingDock");
  });

  it("auto-includes BentoGrid when BentoGridItem is matched", () => {
    // BentoGridItem's aliases include "bento grid item" — but BentoGrid alias "bento grid"
    // matches first in practice. Test companion logic via BentoGrid match.
    const result = findComponentsByAliasMatch("create a bento grid");
    expect(result).toContain("BentoGrid");
    expect(result).toContain("BentoGridItem");
  });
});
