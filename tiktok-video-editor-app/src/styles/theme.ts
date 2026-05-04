/**
 * Color palette for the application.
 */
export const colors = {
  primary: "#00D6F9",
  background: "#000000",
  surface: "#141414",
  text: "#F5F7FA",
  textSecondary: "#8D94A1",
  accent: "#00FFD0",
  error: "#FF5D73",
};

/**
 * Spacing constants for layouts.
 */
export const spacing = {
  s: 8,
  m: 16,
  l: 24,
};

/**
 * Typography styles for the application.
 */
export const typography = {
  header: {
    fontSize: 24,
    fontWeight: "bold" as const,
    color: colors.text,
  },
  body: {
    fontSize: 16,
    color: colors.text,
  },
};
