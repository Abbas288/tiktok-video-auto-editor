import { createGoogleAiStudioTemplatePrompt } from "./templateAiPrompt";

export interface TemplateGuideSection {
  title: string;
  body: string;
}

export const TEMPLATE_GUIDE_SECTIONS: TemplateGuideSection[] = [
  {
    title: "What is included",
    body: "Scenes, timing, text, effects, transitions, audio and instructions.",
  },
  {
    title: "What you add",
    body: "One approved video clip per scene. Longer clips can be trimmed.",
  },
  {
    title: "How it works",
    body: "The app applies the template styling to your selected scene videos.",
  },
];

export const TEMPLATE_GUIDE_STEPS = [
  "Create or import a JSON template.",
  "Add one video per scene.",
  "Preview and adjust edits.",
  "Compile and export.",
];

export const TEMPLATE_GUIDE_PROMPT = createGoogleAiStudioTemplatePrompt();
