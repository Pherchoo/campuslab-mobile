import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useState } from "react";
import Feather from "@expo/vector-icons/Feather";
export const C = {
  blue: "#6D8196",
  bg: "#FAFAFC",
  white: "#FFFFFF",
  text: "#1D1D1F",
  muted: "#86868B",
  border: "#E5E5EA",
  occupied: "#F0F0F2",
  cream: "#FDFDF5",
  yellow: "#C4B97A",
};
/** @param {import('react-native').TextProps} props */
export function Txt({ children, style = null, ...props }) {
  return (
    <Text {...props} style={[s.text, style]}>
      {children}
    </Text>
  );
}
/** @param {{name?:string,size?:number,color?:string}} props */
export function Icon({ name = "monitor", size = 22, color = C.blue }) {
  return (
    <Feather
      name={
        /** @type {import('react').ComponentProps<typeof Feather>['name']} */ (
          name
        )
      }
      size={size}
      color={color}
    />
  );
}
/** @param {{label:string,onPress:()=>void,secondary?:boolean,disabled?:boolean,busy?:boolean,style?:import('react-native').StyleProp<import('react-native').ViewStyle>,icon?:string}} props */
export function Button({
  label,
  onPress,
  secondary = false,
  disabled = false,
  busy = false,
  style = null,
  icon = null,
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled || busy}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        secondary && s.secondary,
        (disabled || busy) && s.disabled,
        pressed && { opacity: 0.8 },
        style,
      ]}
    >
      {busy ? (
        <ActivityIndicator color={secondary ? C.blue : C.white} />
      ) : (
        <>
          {icon && (
            <Icon name={icon} color={secondary ? C.blue : C.white} size={18} />
          )}
          <Txt style={[s.buttonText, secondary && { color: C.blue }]}>
            {label}
          </Txt>
        </>
      )}
    </Pressable>
  );
}
/** @param {import('react-native').TextInputProps & {label:string,password?:boolean,disabled?:boolean}} props */
export function Input({
  label,
  value,
  onChangeText,
  placeholder = "",
  password = false,
  keyboardType = "default",
  autoComplete = "off",
  multiline = false,
  disabled = false,
  autoCapitalize = "sentences",
  returnKeyType = "next",
  onSubmitEditing = undefined,
}) {
  const [visible, setVisible] = useState(false);
  return (
    <View style={s.field}>
      <Txt style={s.label}>{label}</Txt>
      <View style={s.inputWrapper}>
        <TextInput
          accessibilityLabel={label}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#B2B2B8"
          secureTextEntry={password && !visible}
          keyboardType={keyboardType}
          autoComplete={autoComplete}
          autoCapitalize={password ? "none" : autoCapitalize}
          autoCorrect={!password && keyboardType !== "email-address"}
          editable={!disabled}
          multiline={multiline}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          style={[
            s.input,
            password && { paddingRight: 54 },
            multiline && { height: 112, textAlignVertical: "top" },
          ]}
        />
        {password && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              visible ? "Ocultar contraseña" : "Mostrar contraseña"
            }
            onPress={() => setVisible(!visible)}
            style={s.eye}
          >
            <Icon
              name={visible ? "eye-off" : "eye"}
              size={20}
              color={C.muted}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}
export function Notice({ message, success = false, onRetry = undefined }) {
  return message ? (
    <View accessibilityRole="alert" style={[s.notice, success && s.success]}>
      <Txt style={{ color: success ? "#435E73" : "#89443E", lineHeight: 22 }}>
        {message}
      </Txt>
      {onRetry && (
        <Pressable
          accessibilityRole="button"
          onPress={onRetry}
          style={{ paddingVertical: 10 }}
        >
          <Txt style={{ color: C.blue, fontFamily: "Inter_600SemiBold" }}>
            Reintentar
          </Txt>
        </Pressable>
      )}
    </View>
  ) : null;
}
export function Loading({ text = "Cargando tu espacio…" }) {
  return (
    <View style={s.center}>
      <ActivityIndicator color={C.blue} />
      <Txt style={s.muted}>{text}</Txt>
    </View>
  );
}
export const s = StyleSheet.create({
  text: { fontFamily: "Inter_400Regular", color: C.text, fontSize: 14 },
  muted: { color: C.muted, lineHeight: 23, fontSize: 14 },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 27,
    letterSpacing: -1,
    lineHeight: 33,
  },
  subtitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 19,
    letterSpacing: -0.4,
  },
  button: {
    backgroundColor: C.blue,
    borderRadius: 8,
    minHeight: 50,
    paddingHorizontal: 16,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  secondary: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
  },
  buttonText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: C.white,
    textAlign: "center",
  },
  disabled: { opacity: 0.5 },
  field: { marginBottom: 20 },
  label: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    marginBottom: 9,
    color: "#4A4A4A",
  },
  inputWrapper: { position: "relative" },
  input: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    minHeight: 52,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.white,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: C.text,
  },
  eye: {
    position: "absolute",
    right: 4,
    top: 4,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  notice: {
    borderRadius: 8,
    padding: 15,
    backgroundColor: "#FCF3F2",
    borderWidth: 1,
    borderColor: "#E1BCB8",
    marginBottom: 20,
  },
  success: { backgroundColor: "#EEF3F5", borderColor: "#B8C6D2" },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
    gap: 18,
    backgroundColor: C.bg,
  },
  panel: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    padding: 22,
  },
  chip: {
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    fontSize: 11,
    color: "#4A4A4A",
    overflow: "hidden",
  },
  hero: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    backgroundColor: C.bg,
    padding: 18,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 8,
    marginVertical: 22,
  },
  eyebrow: {
    fontSize: 11,
    color: C.muted,
    letterSpacing: 0.7,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  rule: {
    borderTopWidth: 1,
    borderColor: C.border,
    marginTop: 20,
    paddingTop: 20,
  },
  page: { padding: 22, paddingBottom: 36, gap: 0 },
  headerText: { marginBottom: 26 },
  empty: { alignItems: "center", paddingVertical: 40, gap: 16 },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  link: { color: C.blue, fontFamily: "Inter_600SemiBold", paddingVertical: 12 },
  detail: { width: "48%", marginBottom: 22 },
  details: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  detailValue: { fontSize: 14, lineHeight: 22 },
});
