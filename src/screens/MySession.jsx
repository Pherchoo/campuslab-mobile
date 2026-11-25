import { useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "../context/AuthState";
import { useLabs } from "../context/LabsState";
import { dateTime } from "../utils/domain";
import { Button, C, Icon, Loading, Notice, Txt, s } from "../components/ui";
import Workspace from "../components/Workspace";
import AssignmentModal from "../components/AssignmentModal";
export default function MySession() {
  const { session } = useAuth(),
    { active, computers, loading, refreshing, error, refresh } = useLabs(),
    [release, setRelease] = useState(false),
    params = useLocalSearchParams();
  const pc = computers.find((c) => c.id === active?.computerId);
  return (
    <Workspace>
      {loading ? (
        <Loading text="Consultando tu sesión…" />
      ) : (
        <ScrollView
          contentContainerStyle={s.page}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              tintColor={C.blue}
              colors={[C.blue]}
            />
          }
        >
          <View style={s.headerText}>
            <Txt style={s.title}>Mi sesión activa</Txt>
            <Txt style={[s.muted, { marginTop: 12 }]}>
              Consulta tu estación asignada y libérala al terminar.
            </Txt>
          </View>
          <Notice message={error} onRetry={refresh} />
          <Notice
            message={typeof params.message === "string" ? params.message : ""}
            success
          />
          {active ? (
            <>
              <View style={s.panel}>
                <Txt style={s.subtitle}>Tu estación</Txt>
                <Txt
                  style={[
                    s.chip,
                    { alignSelf: "flex-start", color: C.blue, marginTop: 12 },
                  ]}
                >
                  Sesión activa
                </Txt>
                <View style={s.hero}>
                  <Icon name="monitor" size={36} />
                  <View style={{ flex: 1 }}>
                    <Txt
                      style={{ fontFamily: "Inter_600SemiBold", fontSize: 18 }}
                    >
                      {active.pc}
                    </Txt>
                    <Txt style={s.muted}>{active.laboratorio}</Txt>
                  </View>
                </View>
                <Txt style={[s.muted, { marginBottom: 22 }]}>
                  {active.especificaciones}
                </Txt>
                <View style={s.details}>
                  {[
                    ["Estudiante", session.user.nombre],
                    ["Matrícula", session.user.matricula],
                    ["Materia", active.materia],
                    ["Horas de uso", `${active.horasUso} h`],
                    ["Inicio", dateTime(active.inicio)],
                    ["Fin estimado", dateTime(active.finEstimado)],
                  ].map(([label, value]) => (
                    <View key={label} style={s.detail}>
                      <Txt style={s.eyebrow}>{label}</Txt>
                      <Txt style={s.detailValue}>{value || "—"}</Txt>
                    </View>
                  ))}
                </View>
                {pc?.perifericosIncluidos?.length > 0 && (
                  <>
                    <Txt style={s.eyebrow}>Periféricos incluidos</Txt>
                    <View style={s.wrap}>
                      {pc.perifericosIncluidos.map((p) => (
                        <Txt key={p} style={s.chip}>
                          {p}
                        </Txt>
                      ))}
                    </View>
                  </>
                )}
                <View style={s.rule}>
                  <Button
                    label="Liberar equipo"
                    onPress={() => setRelease(true)}
                  />
                </View>
              </View>
              <View style={[s.panel, { marginTop: 20 }]}>
                <Txt style={s.subtitle}>Cuida tu espacio</Txt>
                <Txt style={[s.muted, { marginTop: 16 }]}>
                  Cierra tus archivos y libera la estación al terminar. Si
                  encuentras una falla, puedes reportarla durante la liberación.
                  Recuerda que solo puedes tener una estación activa.
                </Txt>
              </View>
            </>
          ) : (
            <View style={[s.panel, s.empty]}>
              <Icon name="monitor" size={48} color="#CBCBCB" />
              <Txt
                style={[s.subtitle, { textAlign: "center", lineHeight: 27 }]}
              >
                Todavía no tienes un equipo asignado
              </Txt>
              <Txt style={[s.muted, { textAlign: "center" }]}>
                Explora los laboratorios y elige una estación disponible.
              </Txt>
              <Button
                label="Explorar laboratorios"
                icon="arrow-right"
                onPress={() => router.navigate("/")}
                style={{ alignSelf: "stretch", marginTop: 10 }}
              />
            </View>
          )}
        </ScrollView>
      )}
      {release && active && (
        <AssignmentModal
          assignment={active}
          onClose={() => setRelease(false)}
        />
      )}
    </Workspace>
  );
}
