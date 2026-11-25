import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "../context/AuthState";
import { validateAccount } from "../utils/domain";
import { Button, C, Icon, Input, Notice, Txt, s } from "../components/ui";

export default function AuthScreen({ register = false }) {
  const { login, register: createAccount, error: sessionError } = useAuth(),
    params = useLocalSearchParams();
  const [values, setValues] = useState({
      nombre: "",
      matricula: "",
      email: "",
      password: "",
      confirm: "",
    }),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const handleChange = (name) => (text) => {
    setValues((v) => ({ ...v, [name]: text }));
    setError("");
  };
  async function handleSubmit() {
    if (busy) return;
    const message = validateAccount(values, register);
    if (message) {
      setError(message);
      return;
    }
    setBusy(true);
    setError("");
    try {
      if (register) {
        await createAccount(values);
        router.replace({ pathname: "/login", params: { registered: "1" } });
      } else {
        await login(values.email, values.password);
        router.replace("/");
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            a.content,
            register && { justifyContent: "flex-start", paddingTop: 28 },
          ]}
        >
          <View style={{ width: "100%", maxWidth: 440, alignSelf: "center" }}>
            <View style={[s.row, { marginBottom: register ? 32 : 52 }]}>
              <Icon name="monitor" size={25} />
              <Txt
                style={{
                  fontFamily: "Inter_700Bold",
                  fontSize: 20,
                  letterSpacing: -0.6,
                }}
              >
                CampusLab
              </Txt>
            </View>
            <View style={{ marginBottom: 32 }}>
              <Txt style={a.title}>
                {register ? "Crear cuenta" : "Bienvenido de nuevo"}
              </Txt>
              <Txt style={[s.muted, { marginTop: 12 }]}>
                {register
                  ? "Regístrate para comenzar a usar los laboratorios."
                  : "Ingresa tus credenciales para acceder al panel."}
              </Txt>
            </View>
            {!register && params.registered === "1" && (
              <Notice
                message="Tu cuenta está lista. Inicia sesión para continuar."
                success
              />
            )}
            <Notice message={error || sessionError} />
            {register && (
              <>
                <Input
                  label="Nombre completo"
                  value={values.nombre}
                  onChangeText={handleChange("nombre")}
                  placeholder="Tu nombre completo"
                  autoComplete="name"
                  disabled={busy}
                />
                <Input
                  label="Matrícula"
                  value={values.matricula}
                  onChangeText={handleChange("matricula")}
                  placeholder="Tu matrícula"
                  disabled={busy}
                />
              </>
            )}
            <Input
              label="Correo electrónico"
              value={values.email}
              onChangeText={handleChange("email")}
              placeholder="tu@correo.edu"
              keyboardType="email-address"
              autoComplete="email"
              autoCapitalize="none"
              disabled={busy}
            />
            <Input
              label="Contraseña"
              value={values.password}
              onChangeText={handleChange("password")}
              placeholder={register ? "Mínimo 6 caracteres" : "••••••••"}
              password
              autoComplete={register ? "new-password" : "current-password"}
              disabled={busy}
              returnKeyType={register ? "next" : "go"}
              onSubmitEditing={register ? undefined : handleSubmit}
            />
            {register && (
              <Input
                label="Confirmar contraseña"
                value={values.confirm}
                onChangeText={handleChange("confirm")}
                placeholder="Repite tu contraseña"
                password
                autoComplete="new-password"
                disabled={busy}
                returnKeyType="go"
                onSubmitEditing={handleSubmit}
              />
            )}
            <Button
              label={register ? "Crear cuenta" : "Iniciar sesión"}
              onPress={handleSubmit}
              busy={busy}
              icon="arrow-right"
              style={{ marginTop: 8, minHeight: 52 }}
            />
            <View style={{ marginTop: 24, alignItems: "center" }}>
              <Txt style={{ fontSize: 13, color: C.muted }}>
                {register ? "¿Ya tienes una cuenta?" : "¿No tienes cuenta?"}
              </Txt>
              <Pressable
                accessibilityRole="link"
                disabled={busy}
                onPress={() =>
                  router.replace(register ? "/login" : "/registro")
                }
              >
                <Txt style={s.link}>
                  {register ? "Iniciar sesión" : "Crear una cuenta"}
                </Txt>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const a = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingTop: 40,
    paddingBottom: 28,
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 30,
    lineHeight: 35,
    letterSpacing: -1.1,
  },
});
