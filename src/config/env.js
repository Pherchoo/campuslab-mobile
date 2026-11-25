export const env = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL?.trim() || "",
  appToken: process.env.EXPO_PUBLIC_API_APP_TOKEN?.trim() || "",
};

export const isApiConfigured = Boolean(env.apiUrl && env.appToken);
