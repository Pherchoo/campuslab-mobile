import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
const key = "campuslab.session";
export const sessionStorage = {
  get: () =>
    Platform.OS === "web"
      ? Promise.resolve(localStorage.getItem(key))
      : SecureStore.getItemAsync(key),
  set: (token) =>
    Platform.OS === "web"
      ? Promise.resolve(localStorage.setItem(key, token))
      : SecureStore.setItemAsync(key, token),
  remove: () =>
    Platform.OS === "web"
      ? Promise.resolve(localStorage.removeItem(key))
      : SecureStore.deleteItemAsync(key),
};
