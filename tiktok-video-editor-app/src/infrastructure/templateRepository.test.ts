import { Template } from "../types/template";
import { TemplateRepository, TemplateStorage } from "./templateRepository";
import { TemplateImportValidationError } from "../domain/template/templateImportValidation";

class MemoryStorage implements TemplateStorage {
  private readonly values = new Map<string, string>();

  public getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  public setItem(key: string, value: string): void {
    this.values.set(key, value);
  }

  public removeItem(key: string): void {
    this.values.delete(key);
  }
}

function createTemplate(overrides: Partial<Template> = {}): Template {
  return {
    id: "custom-template",
    title: "Custom Template",
    sourceVideoUrl: "https://example.com/source.mp4",
    orientation: "landscape",
    originalVolume: 1,
    scenes: [
      {
        id: "scene-1",
        orderIndex: 0,
        startSeconds: 0,
        durationSeconds: 3,
        instruction: "Show the main product clearly.",
        textOverlays: [],
        effects: [],
      },
    ],
    ...overrides,
  };
}

describe("TemplateRepository", () => {
  it("imports a valid template and returns it by id", async () => {
    const repository = new TemplateRepository(new MemoryStorage());
    const template = createTemplate();

    await repository.importTemplate(template);

    const result = await repository.getTemplateById("custom-template");

    expect(result?.title).toBe("Custom Template");
  });

  it("includes imported templates in available templates", async () => {
    const repository = new TemplateRepository(new MemoryStorage());

    await repository.importTemplate(createTemplate());

    const templates = await repository.getAvailableTemplates();

    expect(
      templates.some((template) => template.id === "custom-template"),
    ).toBe(true);
  });

  it("persists imported templates through storage", async () => {
    const storage = new MemoryStorage();
    const firstRepository = new TemplateRepository(storage);

    await firstRepository.importTemplate(createTemplate());

    const secondRepository = new TemplateRepository(storage);
    const result = await secondRepository.getTemplateById("custom-template");

    expect(result?.title).toBe("Custom Template");
  });

  it("rejects templates without scenes", async () => {
    const repository = new TemplateRepository(new MemoryStorage());

    await expect(
      repository.importTemplate(
        createTemplate({
          scenes: [],
        }),
      ),
    ).rejects.toThrow(TemplateImportValidationError);
  });

  it("rejects templates with missing scene instructions", async () => {
    const repository = new TemplateRepository(new MemoryStorage());
    const template = createTemplate({
      scenes: [
        {
          id: "scene-1",
          orderIndex: 0,
          startSeconds: 0,
          durationSeconds: 3,
          instruction: "",
          textOverlays: [],
          effects: [],
        },
      ],
    });

    await expect(repository.importTemplate(template)).rejects.toThrow(
      TemplateImportValidationError,
    );
  });

  it("keeps seed templates available as fallback examples", async () => {
    const repository = new TemplateRepository(new MemoryStorage());

    const templates = await repository.getAvailableTemplates();

    expect(templates.length).toBeGreaterThan(0);
  });
});
