import { Stack } from "expo-router";
import { LabsProvider } from "../../context/LabsContext";
export default function WorkspaceLayout() {
  return (
    <LabsProvider>
      <Stack id="workspace" screenOptions={{ headerShown: false }} />
    </LabsProvider>
  );
}
