# CampusLab Mobile

Proyecto C del proyecto integrador de IDGS de la Universidad Tecnológica El Retoño. Sistema de Control de Laboratorios de Cómputo.

## Estado del avance

Base inicial en React Native con Expo, estructura modular, GitFlow y configuración de variables de entorno. La API todavía está pendiente de los datos del docente. Esta entrega no representa la aplicación final ni incluye autenticación funcional.

## Instalación

```bash
npm install
```

Copiar `.env.example` como `.env` y completar `EXPO_PUBLIC_API_URL` y `EXPO_PUBLIC_API_APP_TOKEN` cuando el docente los proporcione. Los valores vacíos son intencionales. Ambas aplicaciones consumirán la misma API REST.

```bash
npm start
```

Para probar en un celular: abrir Expo Go y escanear el QR que muestre Expo. La compatibilidad depende de que Expo Go soporte el SDK del proyecto.

## Organización

```text
src/
  components/
  screens/
  services/
  context/
  config/
  utils/
```

## Entorno y seguridad

`EXPO_PUBLIC_API_APP_TOKEN` se enviará como `x-api-token`. El JWT de usuario se recibirá al iniciar sesión y se enviará como `Authorization: Bearer <token>`; no se almacena en `.env`. El cliente base permite callbacks para limpiar la sesión ante 401 y mostrar acceso restringido ante 403; las pantallas de autenticación y su almacenamiento se implementarán después.

Las variables con prefijos VITE_ y EXPO_PUBLIC_ son visibles en el cliente compilado. No colocar contraseñas ni claves privadas en ellas. Se sigue el contrato de token de aplicación del documento de clase.

`.env` está excluido de Git; `.env.example` sí se versiona.

## GitFlow

Ver `docs/GITFLOW.md`. Se preparan main, develop, feature/base-entorno y fix/ajustes.

## Próximas etapas

Login y Registro, laboratorios y PCs, asignación y liberación con reporte de falla, panel administrativo y permisos por rol.
Navegación móvil y almacenamiento de sesión. El APK final se generará localmente con Expo prebuild y Gradle, como exige la asignación; no mediante EAS Build en la nube.
