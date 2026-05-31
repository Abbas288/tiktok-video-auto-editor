import { Stack } from "expo-router";

/**
 * Defines the global app layout.
 */
export default function RootLayout(): React.JSX.Element {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#000000" },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: {
          fontWeight: "900",
        },
      }}
    >
      <Stack.Screen name="(home)/index" options={{ headerShown: false }} />
      <Stack.Screen name="template-guide" options={{ headerShown: false }} />
      <Stack.Screen
        name="editor/[id]"
        options={{ title: "Editor", headerShown: false }}
      />
    </Stack>
  );
}
