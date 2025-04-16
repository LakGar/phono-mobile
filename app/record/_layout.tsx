import { Stack } from "expo-router";

export default function RecordLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="[id]"
        options={{
          title: "Record Details",
        }}
      />
    </Stack>
  );
}
