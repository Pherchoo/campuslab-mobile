import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, usePathname } from "expo-router";
import { useAuth } from "../context/AuthState";
import { initials } from "../utils/domain";
import { Button, C, Icon, Txt, s } from "./ui";
export default function Workspace({ children }) {
  const [menu, setMenu] = useState(false),
    [help, setHelp] = useState(false),
    { session, logout } = useAuth(),
    path = usePathname();
  const go = (route) => {
    setMenu(false);
    router.navigate(route);
  };
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: C.blue }}
      edges={["top", "left", "right"]}
    >
      <View style={w.header}>
        <Pressable
          accessibilityRole="link"
          onPress={() => go("/")}
          style={s.row}
        >
          <View style={w.dot} />
          <Txt style={w.brand}>CampusLab</Txt>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Abrir menú"
          onPress={() => setMenu(true)}
          style={w.iconButton}
        >
          <Icon name="menu" color="white" />
        </Pressable>
      </View>
      <SafeAreaView
        edges={["bottom"]}
        style={{ flex: 1, backgroundColor: C.bg }}
      >
        {children}
      </SafeAreaView>
      <Modal
        visible={menu}
        transparent
        animationType="fade"
        onRequestClose={() => setMenu(false)}
      >
        <View style={w.overlay}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cerrar menú"
            style={StyleSheet.absoluteFill}
            onPress={() => setMenu(false)}
          />
          <SafeAreaView style={w.drawer}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
              <View
                style={[
                  s.row,
                  { justifyContent: "space-between", marginBottom: 32 },
                ]}
              >
                <Txt style={w.brand}>CampusLab</Txt>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Cerrar menú"
                  onPress={() => setMenu(false)}
                  style={w.iconButton}
                >
                  <Icon name="x" color="white" />
                </Pressable>
              </View>
              <Txt style={w.section}>ESPACIO DE TRABAJO</Txt>
              {[
                ["/", "monitor", "Laboratorios"],
                ["/mi-sesion", "clock", "Mi sesión activa"],
              ].map(([route, icon, title]) => (
                <Pressable
                  key={route}
                  accessibilityRole="link"
                  accessibilityState={{ selected: path === route }}
                  onPress={() => go(route)}
                  style={[w.nav, path === route && w.selected]}
                >
                  <Icon name={icon} color="white" size={20} />
                  <Txt style={w.navText}>{title}</Txt>
                </Pressable>
              ))}
              <View style={w.footer}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    setMenu(false);
                    setHelp(true);
                  }}
                  style={w.nav}
                >
                  <Icon name="help-circle" color="white" size={20} />
                  <Txt style={w.navText}>Ayuda y soporte</Txt>
                </Pressable>
                <View style={w.user}>
                  <View style={w.avatar}>
                    <Txt
                      style={{ color: "white", fontFamily: "Inter_500Medium" }}
                    >
                      {initials(session.user.nombre)}
                    </Txt>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Txt
                      numberOfLines={2}
                      style={{ color: "white", fontSize: 13 }}
                    >
                      {session.user.nombre}
                    </Txt>
                    <Txt
                      style={{
                        color: "rgba(255,255,255,.75)",
                        fontSize: 11,
                        marginTop: 5,
                      }}
                    >
                      {session.user.rol === "ADMIN"
                        ? "Administrador"
                        : "Estudiante"}
                    </Txt>
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Cerrar sesión"
                    onPress={() => {
                      setMenu(false);
                      void logout();
                    }}
                    style={w.iconButton}
                  >
                    <Icon name="log-out" color="white" size={19} />
                  </Pressable>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>
      <Modal
        visible={help}
        transparent
        animationType="fade"
        onRequestClose={() => setHelp(false)}
      >
        <View style={w.helpOverlay}>
          <View style={w.help}>
            <Txt style={s.subtitle}>Ayuda y soporte</Txt>
            <Txt style={[s.muted, { marginVertical: 20 }]}>
              Selecciona una estación disponible e indica tu materia y las horas
              de uso. Al terminar, entra en Mi sesión activa para liberar el
              equipo. Si encuentras una falla, puedes reportarla al liberar tu
              estación.
            </Txt>
            <Button label="Entendido" onPress={() => setHelp(false)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
const w = StyleSheet.create({
  header: {
    height: 68,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: {
    color: "white",
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    letterSpacing: -0.5,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#FFFFE3" },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: { flex: 1, backgroundColor: "rgba(20,30,40,.35)" },
  drawer: { width: "88%", maxWidth: 310, flex: 1, backgroundColor: C.blue },
  section: {
    color: "rgba(255,255,255,.75)",
    fontSize: 11,
    letterSpacing: 0.8,
    marginBottom: 14,
    marginHorizontal: 10,
  },
  nav: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 8,
    padding: 13,
    minHeight: 48,
    borderWidth: 1,
    borderColor: "transparent",
    marginBottom: 6,
  },
  selected: {
    backgroundColor: "rgba(255,255,255,.20)",
    borderColor: "rgba(255,255,255,.28)",
  },
  navText: { color: "white", fontFamily: "Inter_500Medium", fontSize: 14 },
  footer: { marginTop: "auto", paddingTop: 30 },
  user: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,.11)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,.17)",
    marginTop: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,.19)",
    alignItems: "center",
    justifyContent: "center",
  },
  helpOverlay: {
    flex: 1,
    backgroundColor: "rgba(20,30,40,.4)",
    justifyContent: "center",
    padding: 16,
  },
  help: { backgroundColor: "white", padding: 24, borderRadius: 12 },
});
