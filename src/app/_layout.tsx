import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { Inter_400Regular } from "@expo-google-fonts/inter/400Regular";
import { Inter_500Medium } from "@expo-google-fonts/inter/500Medium";
import { Inter_600SemiBold } from "@expo-google-fonts/inter/600SemiBold";
import { Inter_700Bold } from "@expo-google-fonts/inter/700Bold";
import { View } from "react-native";
import { AuthProvider } from "../context/AuthContext";
import { useAuth } from "../context/AuthState";
import { Button, Loading, Notice, Txt, s } from "../components/ui";
function Routes() {
  const { session, status, error, restore, logout } = useAuth();
  if (status === "loading") return <Loading />;
  if (status === "restore-error")
    return (
      <View style={s.center}>
        <Txt style={s.subtitle}>No pudimos recuperar tu sesión</Txt>
        <Notice message={error} />
        <Button label="Reintentar" onPress={restore} />
        <Button label="Volver al acceso" onPress={logout} secondary />
      </View>
    );
  return (
    <>
      <StatusBar style={session ? "light" : "dark"} />
      <Stack id="root" screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!session}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
        <Stack.Protected guard={!!session}>
          <Stack.Screen name="(workspace)" />
        </Stack.Protected>
      </Stack>
    </>
  );
}
export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  if (!loaded && !error) return <Loading />;
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
