import { mockBunnyTemplate } from "../data/mockTemplate";
import { parseImportedTemplate } from "../domain/template/templateImportValidation";
import { Template } from "../types/template";

export interface ITemplateRepository {
  getTemplateById(id: string): Promise<Template | null>;
  getAvailableTemplates(): Promise<Template[]>;
  importTemplate(input: unknown): Promise<Template>;
}

export interface TemplateStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}

type TemplatesById = Record<string, Template>;

const IMPORTED_TEMPLATES_STORAGE_KEY =
  "tiktok-video-editor-app:imported-templates:v1";

export class TemplateRepository implements ITemplateRepository {
  private readonly runtimeImportedTemplates = new Map<string, Template>();

  public constructor(
    private readonly storage: TemplateStorage | null = getBrowserStorage(),
  ) {}

  public async getTemplateById(id: string): Promise<Template | null> {
    const normalizedId = id.trim();

    if (!normalizedId) {
      return null;
    }

    const templates = await this.getAvailableTemplates();

    return templates.find((template) => template.id === normalizedId) ?? null;
  }

  public async getAvailableTemplates(): Promise<Template[]> {
    const templatesById = new Map<string, Template>();

    for (const template of Object.values(this.readImportedTemplates())) {
      templatesById.set(template.id, template);
    }

    for (const template of getSeedTemplates()) {
      if (!templatesById.has(template.id)) {
        templatesById.set(template.id, template);
      }
    }

    return Array.from(templatesById.values());
  }

  public async importTemplate(input: unknown): Promise<Template> {
    const template = parseImportedTemplate(input);
    const importedTemplates = {
      ...this.readImportedTemplates(),
      [template.id]: template,
    };

    this.runtimeImportedTemplates.set(template.id, template);
    this.writeImportedTemplates(importedTemplates);

    return template;
  }

  private readImportedTemplates(): TemplatesById {
    return {
      ...this.readStoredTemplates(),
      ...Object.fromEntries(this.runtimeImportedTemplates),
    };
  }

  private readStoredTemplates(): TemplatesById {
    if (!this.storage) {
      return {};
    }

    try {
      const rawValue = this.storage.getItem(IMPORTED_TEMPLATES_STORAGE_KEY);

      if (!rawValue) {
        return {};
      }

      const parsedValue: unknown = JSON.parse(rawValue);

      if (!isRecord(parsedValue)) {
        return {};
      }

      const templates: TemplatesById = {};

      for (const value of Object.values(parsedValue)) {
        const template = safeParseTemplate(value);

        if (template) {
          templates[template.id] = template;
        }
      }

      return templates;
    } catch {
      return {};
    }
  }

  private writeImportedTemplates(templates: TemplatesById): void {
    if (!this.storage) {
      return;
    }

    try {
      this.storage.setItem(
        IMPORTED_TEMPLATES_STORAGE_KEY,
        JSON.stringify(templates),
      );
    } catch {
      return;
    }
  }
}

export const templateRepository = new TemplateRepository();

function getSeedTemplates(): Template[] {
  const template = safeParseTemplate(mockBunnyTemplate);

  return template ? [template] : [];
}

function safeParseTemplate(value: unknown): Template | null {
  try {
    return parseImportedTemplate(value);
  } catch (error) {
    console.error("Failed to parse template:", error);
    return null;
  }
}

function getBrowserStorage(): TemplateStorage | null {
  if (typeof globalThis === "undefined") {
    return null;
  }

  try {
    const candidate = globalThis as typeof globalThis & {
      localStorage?: TemplateStorage;
    };

    return candidate.localStorage ?? null;
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
