import { describe, it, expect } from "vitest";
import { selectRelevantComponents } from "../component-selection";

describe("selectRelevantComponents", () => {
  // Alias matching tests (no LLM needed — LLM errors are caught internally)
  it("finds FloatingDock when prompt mentions 'floating dock'", async () => {
    const result = await selectRelevantComponents("build a page with floating dock navigation");
    expect(result).toContain("FloatingDock");
  });

  it("finds BentoGrid when prompt mentions 'bento'", async () => {
    const result = await selectRelevantComponents("create a bento grid layout");
    expect(result).toContain("BentoGrid");
    expect(result).toContain("BentoGridItem");
  });

  it("finds InfiniteMovingCards when prompt mentions 'infinite carousel'", async () => {
    const result = await selectRelevantComponents("add an infinite scrolling testimonial carousel");
    expect(result).toContain("InfiniteMovingCards");
  });

  it("never returns fewer than 6 components", async () => {
    const result = await selectRelevantComponents("a showcase page");
    expect(result.length).toBeGreaterThanOrEqual(6);
  });

  it("always includes core layout components", async () => {
    const result = await selectRelevantComponents("make something");
    expect(result).toContain("Flex");
    expect(result).toContain("Container");
    expect(result).toContain("Grid");
    expect(result).toContain("Section");
    expect(result).toContain("Stack");
    expect(result).toContain("Center");
  });
});
