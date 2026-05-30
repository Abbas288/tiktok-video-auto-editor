import * as DocumentPicker from "expo-document-picker";
import { File as ExpoFile } from "expo-file-system";
import { Platform } from "react-native";
import { TemplateImportValidationError } from "../domain/template/templateImportValidation";

export interface PickedTemplateFile {
  fileName: string;
  text: string;
}

type WebDocumentPickerAsset = DocumentPicker.DocumentPickerAsset & {
  file?: Blob & {
    text: () => Promise<string>;
  };
};

export async function pickTemplateFile(): Promise<PickedTemplateFile | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: ["application/json", "text/plain", "text/*"],
    multiple: false,
    copyToCacheDirectory: true,
  });

  if (result.canceled || result.assets.length === 0) {
    return null;
  }

  const asset = result.assets[0];

  return {
    fileName: normalizePickedFileName(asset.name),
    text: await readPickedAssetText(asset),
  };
}

export function parseTemplateJsonText(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      "The selected file is not valid JSON. Check the syntax and try again.",
    );
  }
}

export function getTemplateImportErrorMessage(error: unknown): string {
  if (error instanceof TemplateImportValidationError) {
    return `Template is incomplete. ${error.details.slice(0, 3).join(" ")}`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Template could not be imported. Please try another file.";
}

async function readPickedAssetText(
  asset: DocumentPicker.DocumentPickerAsset,
): Promise<string> {
  try {
    const webAsset = asset as WebDocumentPickerAsset;

    if (Platform.OS === "web" && webAsset.file) {
      return webAsset.file.text();
    }

    const file = new ExpoFile(asset.uri);

    return file.textSync();
  } catch {
    throw new Error("Could not read the selected template file.");
  }
}

function normalizePickedFileName(value: string | null | undefined): string {
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }

  return "template.json";
}
