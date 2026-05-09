import { mockBunnyTemplate } from "../data/mockTemplate";
import { parseTemplate } from "../domain/parseTemplate";
import { Template } from "../types/template";
/**
 * Interface defining the contract for template data retrieval.
 * Following the Dependency Inversion Principle, the application should rely on this abstraction.
 *
 * @interface ITemplateRepository
 */
export interface ITemplateRepository {
  /**
   * Retrieves a template by its unique identifier.
   *
   * @param {string} id - The unique identifier of the template.
   * @returns {Promise<Template | null>} A promise resolving to the validated Template, or null if not found.
   */
  getTemplateById(id: string): Promise<Template | null>;

  /**
   * Retrieves a list of all available templates.
   *
   * @returns {Promise<Template[]>} A promise resolving to an array of validated Templates.
   */
  getAvailableTemplates(): Promise<Template[]>;
}

/**
 * Concrete implementation of the template repository.
 * Currently uses local mock data, but is designed to be easily swapped for an API/Supabase implementation.
 *
 * @class TemplateRepository
 * @implements {ITemplateRepository}
 */
class TemplateRepository implements ITemplateRepository {
  public async getTemplateById(id: string): Promise<Template | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (id === mockBunnyTemplate.id) {
      try {
        return parseTemplate(mockBunnyTemplate);
      } catch (error) {
        console.error("Failed to parse template:", error);
        throw new Error("Template data is corrupted or invalid.");
      }
    }

    return null;
  }

  public async getAvailableTemplates(): Promise<Template[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      const validTemplate = parseTemplate(mockBunnyTemplate);
      return [validTemplate];
    } catch (error) {
      console.error("Failed to parse available templates:", error);
      return [];
    }
  }
}

export const templateRepository = new TemplateRepository();
