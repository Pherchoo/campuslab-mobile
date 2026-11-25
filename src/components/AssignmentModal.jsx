import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useLabs } from "../context/LabsState";
import { validateAssignment, validateRelease } from "../utils/domain";
import { Button, C, Icon, Input, Notice, Txt, s } from "./ui";
export default function AssignmentModal({
  computer = null,
  assignment = null,
  onClose,
}) {
  const { assign, release, refresh } = useLabs(),
    insets = useSafeAreaInsets();
  const [materia, setMateria] = useState(""),
    [hours, setHours] = useState("2"),
    [fault, setFault] = useState(false),
    [description, setDescription] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const releasing = Boolean(assignment);
  async function handleSubmit() {
    if (busy) return;
    const message = releasing
      ? validateRelease(fault, description)
      : validateAssignment(materia, hours.replace(",", "."));
    if (message) {
      setError(message);
      return;
    }
    setBusy(true);
    setError("");
    try {
      if (releasing) await release(assignment.assignmentId, fault, description);
      else await assign(computer.id, materia, hours.replace(",", "."));
      onClose();
      router.navigate({
        pathname: "/mi-sesion",
        params: {
          message: releasing
            ? "La estación se liberó correctamente."
            : "Tu estación está lista. Al terminar, recuerda liberarla.",
        },
      });
    } catch (e) {
      setError(e.message);
      if (e.status === 409) void refresh();
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal
      visible
      transparent
      animationType="fade"
      onRequestClose={() => {
        if (!busy) onClose();
      }}
    >
      <KeyboardAvoidingView
        style={[
          m.overlay,
          {
            paddingTop: Math.max(insets.top, 12),
            paddingBottom: Math.max(insets.bottom, 12),
          },
        ]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={m.dialog}>
          <View style={m.head}>
            <Txt
              accessibilityRole="header"
              style={[s.subtitle, { fontSize: 18, flex: 1 }]}
            >
              {releasing ? "Liberar equipo" : "Asignar estación"}
            </Txt>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cerrar diálogo"
              disabled={busy}
              onPress={onClose}
              style={m.close}
            >
              <Icon name="x" color={C.muted} />
            </Pressable>
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ padding: 20 }}
          >
            <View style={[s.hero, { marginTop: 0 }]}>
              <Icon name="monitor" size={34} />
              <View style={{ flex: 1 }}>
                <Txt style={{ fontFamily: "Inter_600SemiBold" }}>
                  {assignment?.pc || computer?.numeroInventario}
                </Txt>
                <Txt style={s.muted}>
                  {assignment?.laboratorio || computer?.laboratorio}
                </Txt>
              </View>
            </View>
            <Notice message={error} />
            {releasing ? (
              <>
                <Txt style={[s.muted, { marginBottom: 20 }]}>
                  ¿Terminaste de usar tu estación? Confirma para dejarla
                  disponible.
                </Txt>
                <View style={[s.row, { marginBottom: 18 }]}>
                  <Switch
                    accessibilityLabel="Reportar una falla en el equipo"
                    value={fault}
                    onValueChange={setFault}
                    disabled={busy}
                    trackColor={{ false: C.border, true: C.blue }}
                    thumbColor="white"
                  />
                  <Txt style={{ flex: 1, lineHeight: 22 }}>
                    Reportar una falla en el equipo
                  </Txt>
                </View>
                {fault && (
                  <Input
                    label="Descripción de la falla"
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Describe qué ocurrió con el equipo"
                    multiline
                    disabled={busy}
                  />
                )}
              </>
            ) : (
              <>
                <Input
                  label="Materia"
                  value={materia}
                  onChangeText={setMateria}
                  placeholder="Ej. Desarrollo Web"
                  disabled={busy}
                />
                <Input
                  label="Horas de uso"
                  value={hours}
                  onChangeText={setHours}
                  keyboardType="decimal-pad"
                  disabled={busy}
                />
                <Txt style={[s.muted, { fontSize: 12 }]}>
                  Puedes reservar entre 0.5 y 12 horas. La estación quedará
                  asignada a tu cuenta.
                </Txt>
              </>
            )}
          </ScrollView>
          <View style={m.footer}>
            <Button
              label="Cancelar"
              secondary
              onPress={onClose}
              disabled={busy}
              style={{ flex: 1 }}
            />
            <Button
              label={releasing ? "Liberar equipo" : "Confirmar asignación"}
              onPress={handleSubmit}
              busy={busy}
              style={{ flex: 1.5 }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
const m = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(20,30,40,.4)",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  dialog: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 12,
    maxHeight: "100%",
    overflow: "hidden",
  },
  head: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: C.border,
  },
  close: {
    height: 44,
    width: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    flexDirection: "row",
    padding: 16,
    gap: 10,
    borderTopWidth: 1,
    borderColor: C.border,
  },
});
