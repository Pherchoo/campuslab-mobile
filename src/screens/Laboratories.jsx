import { useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { router } from "expo-router";
import { useLabs } from "../context/LabsState";
import { statuses } from "../utils/domain";
import { Button, C, Icon, Loading, Notice, Txt, s } from "../components/ui";
import Workspace from "../components/Workspace";
import AssignmentModal from "../components/AssignmentModal";
export default function Laboratories() {
  const { computers, labs, loading, refreshing, error, refresh, active } =
      useLabs(),
    [selected, setSelected] = useState(""),
    [filter, setFilter] = useState("all"),
    [computer, setComputer] = useState(null);
  const lab = labs.includes(selected) ? selected : labs[0],
    list = computers.filter((c) => c.laboratorio === lab),
    shown = list.filter((c) => filter === "all" || c.estatus === filter);
  return (
    <Workspace>
      {loading ? (
        <Loading text="Consultando laboratorios…" />
      ) : (
        <FlatList
          data={shown}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={s.page}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              tintColor={C.blue}
              colors={[C.blue]}
            />
          }
          ListHeaderComponent={
            <>
              <View style={s.headerText}>
                <Txt style={s.title}>Control de Laboratorios</Txt>
                <Txt style={[s.muted, { marginTop: 12 }]}>
                  Consulta la disponibilidad y asigna una estación para tu
                  próxima clase.
                </Txt>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginBottom: 24 }}
                contentContainerStyle={l.tabs}
              >
                {labs.map((room) => (
                  <Pressable
                    key={room}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: room === lab }}
                    onPress={() => {
                      setSelected(room);
                      setFilter("all");
                    }}
                    style={[l.tab, room === lab && l.activeTab]}
                  >
                    <Txt style={[l.tabText, room === lab && { color: C.blue }]}>
                      {room}
                    </Txt>
                  </Pressable>
                ))}
              </ScrollView>
              <Notice message={error} onRetry={refresh} />
              <View style={l.stats}>
                {[
                  ["all", "Estaciones totales", C.text],
                  ["DISPONIBLE", "Disponibles", C.blue],
                  ["OCUPADA", "Ocupadas", "#4A4A4A"],
                  ["MANTENIMIENTO", "En mantenimiento", C.yellow],
                ].map(([status, label, color]) => (
                  <View key={status} style={l.stat}>
                    <Txt style={[l.value, { color }]}>
                      {status === "all"
                        ? list.length
                        : list.filter((c) => c.estatus === status).length}
                    </Txt>
                    <Txt style={l.statLabel}>{label}</Txt>
                  </View>
                ))}
              </View>
              {active && (
                <Notice
                  message="Ya tienes una estación asignada. Consúltala en Mi sesión activa."
                  success
                />
              )}
              <View
                style={[
                  s.row,
                  { justifyContent: "space-between", marginBottom: 14 },
                ]}
              >
                <Txt style={s.subtitle}>Estaciones</Txt>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Actualizar disponibilidad"
                  disabled={refreshing}
                  onPress={refresh}
                  style={{ padding: 12 }}
                >
                  <Icon name="refresh-cw" size={20} />
                </Pressable>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginBottom: 20 }}
                contentContainerStyle={{ gap: 8 }}
              >
                {[
                  ["all", "Todos"],
                  ["DISPONIBLE", "Disponibles"],
                  ["OCUPADA", "Ocupadas"],
                  ["MANTENIMIENTO", "Mantenimiento"],
                ].map(([value, label]) => (
                  <Pressable
                    key={value}
                    accessibilityRole="button"
                    accessibilityState={{ selected: filter === value }}
                    onPress={() => setFilter(value)}
                    style={[
                      l.filter,
                      filter === value && {
                        backgroundColor: C.blue,
                        borderColor: C.blue,
                      },
                    ]}
                  >
                    <Txt
                      style={{
                        fontSize: 12,
                        color: filter === value ? "white" : C.muted,
                      }}
                    >
                      {label}
                    </Txt>
                  </Pressable>
                ))}
              </ScrollView>
            </>
          }
          renderItem={({ item: c }) => (
            <View
              style={[
                l.card,
                c.estatus === "OCUPADA" && { backgroundColor: C.occupied },
                c.estatus === "MANTENIMIENTO" && { backgroundColor: C.cream },
              ]}
            >
              <View
                style={[
                  s.row,
                  { justifyContent: "space-between", marginBottom: 20 },
                ]}
              >
                <Txt
                  style={{
                    fontSize: 19,
                    fontFamily: "Inter_600SemiBold",
                    flex: 1,
                  }}
                >
                  {c.numeroInventario}
                </Txt>
                <View style={l.pcIcon}>
                  <Icon name="monitor" />
                </View>
              </View>
              <View style={[s.wrap, { marginBottom: 18 }]}>
                {c.especificaciones.split(",").map((spec, i) => (
                  <Txt key={i} style={s.chip}>
                    {spec.trim()}
                  </Txt>
                ))}
              </View>
              <View style={[s.row, { marginBottom: 24 }]}>
                <View
                  style={[
                    l.dot,
                    {
                      backgroundColor:
                        c.estatus === "DISPONIBLE"
                          ? "#4E8269"
                          : c.estatus === "OCUPADA"
                            ? "#B56862"
                            : "#A18A42",
                    },
                  ]}
                />
                <Txt
                  style={{
                    fontSize: 12,
                    color:
                      c.estatus === "DISPONIBLE"
                        ? "#4E8269"
                        : c.estatus === "OCUPADA"
                          ? "#B56862"
                          : "#A18A42",
                  }}
                >
                  {statuses[c.estatus] || c.estatus}
                </Txt>
              </View>
              <Button
                label={
                  c.estatus === "DISPONIBLE"
                    ? active
                      ? "Ver mi sesión"
                      : "Asignar"
                    : c.estatus === "OCUPADA"
                      ? "No disponible"
                      : "En revisión"
                }
                disabled={c.estatus !== "DISPONIBLE"}
                onPress={() =>
                  active ? router.navigate("/mi-sesion") : setComputer(c)
                }
              />
            </View>
          )}
          ListEmptyComponent={
            <View style={s.panel}>
              <Txt style={s.muted}>
                {error
                  ? "No pudimos cargar las estaciones. Intenta actualizar."
                  : "No hay estaciones con este estado."}
              </Txt>
            </View>
          }
          ListFooterComponent={
            <Txt style={[s.muted, { fontSize: 12, marginTop: 8 }]}>
              Mostrando {shown.length} de {list.length} estaciones
              {lab ? ` de ${lab}` : ""}.
            </Txt>
          }
        />
      )}
      {computer && (
        <AssignmentModal
          computer={computer}
          onClose={() => setComputer(null)}
        />
      )}
    </Workspace>
  );
}
const l = StyleSheet.create({
  tabs: {
    flexDirection: "row",
    padding: 4,
    backgroundColor: "#F0F0F2",
    borderRadius: 8,
  },
  tab: {
    minWidth: 85,
    minHeight: 44,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: "white",
    boxShadow: "0 2px 6px rgba(0,0,0,.04)",
  },
  tabText: { fontSize: 13, color: C.muted, fontFamily: "Inter_500Medium" },
  stats: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 26,
  },
  stat: {
    width: "48%",
    flexGrow: 1,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    padding: 20,
  },
  value: {
    fontSize: 30,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: -1,
    marginBottom: 8,
  },
  statLabel: { fontSize: 11, color: C.muted },
  filter: {
    minHeight: 40,
    paddingHorizontal: 14,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 8,
    backgroundColor: "white",
  },
  card: {
    backgroundColor: "white",
    padding: 22,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    marginBottom: 16,
    boxShadow: "0 4px 24px rgba(0,0,0,.025)",
  },
  pcIcon: {
    padding: 10,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 8,
    backgroundColor: C.bg,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
});
