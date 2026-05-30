import { mockBunnyTemplate } from "../data/mockTemplate";
import { parseImportedTemplate } from "../domain/template/templateImportValidation";
import { Template } from "../types/template";

export interface ITemplateRepository {
  getTemplateById(id: string): Promise<Template | null>;
  getAvailableTemplates(): Promise<Template[]>;
  importTemplate(input: unknown): Promise<Template>;
  renameTemplate(id: string, title: string): Promise<Template>;
  deleteTemplate(id: string): Promise<void>;
}

export interface TemplateStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}

export class TemplateRepositoryError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "TemplateRepositoryError";
  }
}

type TemplatesById = Record<string, Template>;

const IMPORTED_TEMPLATES_STORAGE_KEY =
  "tiktok-video-editor-app:imported-templates:v1";

const DELETED_TEMPLATE_IDS_STORAGE_KEY =
  "tiktok-video-editor-app:deleted-template-ids:v1";

export class TemplateRepository implements ITemplateRepository {
  private readonly runtimeImportedTemplates = new Map<string, Template>();
  private readonly runtimeDeletedTemplateIds = new Set<string>();

  public constructor(
    private readonly storage: TemplateStorage | null = getBrowserStorage(),
  ) {}

  public async getTemplateById(id: string): Promise<Template | null> {
    const normalizedId = normalizeTemplateId(id);

    if (!normalizedId || this.readDeletedTemplateIds().has(normalizedId)) {
      return null;
    }

    const templates = await this.getAvailableTemplates();

    return templates.find((template) => template.id === normalizedId) ?? null;
  }

  public async getAvailableTemplates(): Promise<Template[]> {
    const deletedTemplateIds = this.readDeletedTemplateIds();
    const templatesById = new Map<string, Template>();

    for (const template of Object.values(this.readImportedTemplates())) {
      if (!deletedTemplateIds.has(template.id)) {
        templatesById.set(template.id, template);
      }
    }

    for (const template of getSeedTemplates()) {
      if (
        !deletedTemplateIds.has(template.id) &&
        !templatesById.has(template.id)
      ) {
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
    const deletedTemplateIds = this.readDeletedTemplateIds();

    deletedTemplateIds.delete(template.id);
    this.runtimeDeletedTemplateIds.delete(template.id);
    this.runtimeImportedTemplates.set(template.id, template);

    this.writeImportedTemplates(importedTemplates);
    this.writeDeletedTemplateIds(deletedTemplateIds);

    return template;
  }

  public async renameTemplate(id: string, title: string): Promise<Template> {
    const normalizedId = normalizeTemplateId(id);
    const normalizedTitle = normalizeProjectTitle(title);

    if (!normalizedId) {
      throw new TemplateRepositoryError("Project not found.");
    }

    if (!normalizedTitle) {
      throw new TemplateRepositoryError("Project name is required.");
    }

    const existingTemplate = await this.getTemplateById(normalizedId);

    if (!existingTemplate) {
      throw new TemplateRepositoryError("Project not found.");
    }

    const updatedTemplate = parseImportedTemplate({
      ...existingTemplate,
      title: normalizedTitle,
    });
    const importedTemplates = {
      ...this.readImportedTemplates(),
      [updatedTemplate.id]: updatedTemplate,
    };

    this.runtimeImportedTemplates.set(updatedTemplate.id, updatedTemplate);
    this.writeImportedTemplates(importedTemplates);

    return updatedTemplate;
  }

  public async deleteTemplate(id: string): Promise<void> {
    const normalizedId = normalizeTemplateId(id);

    if (!normalizedId) {
      throw new TemplateRepositoryError("Project not found.");
    }

    const existingTemplate = await this.getTemplateById(normalizedId);

    if (!existingTemplate) {
      throw new TemplateRepositoryError("Project not found.");
    }

    const importedTemplates = this.readImportedTemplates();
    const deletedTemplateIds = this.readDeletedTemplateIds();

    delete importedTemplates[normalizedId];
    deletedTemplateIds.add(normalizedId);

    this.runtimeImportedTemplates.delete(normalizedId);
    this.runtimeDeletedTemplateIds.add(normalizedId);

    this.writeImportedTemplates(importedTemplates);
    this.writeDeletedTemplateIds(deletedTemplateIds);
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

  private readDeletedTemplateIds(): Set<string> {
    const deletedTemplateIds = new Set(this.runtimeDeletedTemplateIds);

    if (!this.storage) {
      return deletedTemplateIds;
    }

    try {
      const rawValue = this.storage.getItem(DELETED_TEMPLATE_IDS_STORAGE_KEY);

      if (!rawValue) {
        return deletedTemplateIds;
      }

      const parsedValue: unknown = JSON.parse(rawValue);

      if (!Array.isArray(parsedValue)) {
        return deletedTemplateIds;
      }

      for (const value of parsedValue) {
        if (typeof value === "string" && value.trim().length > 0) {
          deletedTemplateIds.add(value.trim());
        }
      }

      return deletedTemplateIds;
    } catch {
      return deletedTemplateIds;
    }
  }

  private writeDeletedTemplateIds(templateIds: Set<string>): void {
    if (!this.storage) {
      return;
    }

    try {
      this.storage.setItem(
        DELETED_TEMPLATE_IDS_STORAGE_KEY,
        JSON.stringify(Array.from(templateIds)),
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

function normalizeTemplateId(value: string): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeProjectTitle(value: string): string {
  return typeof value === "string" ? value.trim() : "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
