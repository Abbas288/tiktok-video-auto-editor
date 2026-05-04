import { Stack } from "expo-router";

/**
 * Root layout component defining the global navigation stack.
 */
export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#000" },
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen name="(home)/index" options={{ title: "Mina Projekt" }} />
      <Stack.Screen
        name="(editor)/[id]"
        options={{ title: "Redigerare", headerShown: false }}
      />
      <Stack.Screen
        name="(preview)/[id]"
        options={{ title: "Förhandsgranskning" }}
      />
    </Stack>
  );
}
