import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Layout() {
  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#1A8E2D",
        }}
      >
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "white" },
            animation: "slide_from_right",
            header: () => null,
            navigationBarHidden: true,
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
          name="index/medications/add"
          options={{
            headerShown: false,
          }}
          />
        </Stack>
      </SafeAreaView>
    </>
  );
}
