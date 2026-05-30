import {
  getTemplateImportErrorMessage,
  parseTemplateJsonText,
} from "./templateImportService";
import { TemplateImportValidationError } from "../domain/template/templateImportValidation";

describe("templateImportService", () => {
  it("parses valid JSON text", () => {
    const result = parseTemplateJsonText('{"id":"template-1"}');

    expect(result).toEqual({
      id: "template-1",
    });
  });

  it("throws a friendly error for invalid JSON text", () => {
    expect(() => parseTemplateJsonText("{")).toThrow(
      "The selected file is not valid JSON. Check the syntax and try again.",
    );
  });

  it("formats template validation errors", () => {
    const message = getTemplateImportErrorMessage(
      new TemplateImportValidationError([
        "scenes must contain at least one scene.",
      ]),
    );

    expect(message).toBe(
      "Template is incomplete. scenes must contain at least one scene.",
    );
  });

  it("formats unknown import errors safely", () => {
    expect(getTemplateImportErrorMessage("broken")).toBe(
      "Template could not be imported. Please try another file.",
    );
  });
});
