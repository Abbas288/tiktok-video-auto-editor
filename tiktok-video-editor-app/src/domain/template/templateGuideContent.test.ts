import {
  TEMPLATE_GUIDE_PROMPT,
  TEMPLATE_GUIDE_SECTIONS,
  TEMPLATE_GUIDE_STEPS,
} from "./templateGuideContent";

describe("templateGuideContent", () => {
  it("contains short guide sections", () => {
    expect(TEMPLATE_GUIDE_SECTIONS.length).toBeGreaterThan(0);
    expect(TEMPLATE_GUIDE_SECTIONS[0].title).toBeTruthy();
    expect(TEMPLATE_GUIDE_SECTIONS[0].body).toBeTruthy();
  });

  it("contains a simple user flow", () => {
    expect(TEMPLATE_GUIDE_STEPS).toContain("Create or import a JSON template.");
    expect(TEMPLATE_GUIDE_STEPS).toContain("Compile and export.");
  });

  it("exposes the AI prompt used for template generation", () => {
    expect(TEMPLATE_GUIDE_PROMPT).toContain("JSON template");
    expect(TEMPLATE_GUIDE_PROMPT).toContain("scenes");
  });
});
