# CampusLab Mobile

Proyecto C · equipo-c2 · IDGS, Universidad Tecnológica El Retoño.

## Avance del 25 de noviembre de 2026

Módulo Auth y vistas de usuario: Login, Registro con matrícula, laboratorio y disponibilidad de PCs (C1), asignación por materia y horas (C2), sesión propia y liberación con reporte de falla opcional (C3). Las pantallas siguen el diseño CampusLab aprobado. Los datos se obtienen de la API del docente.

El panel administrativo C4 corresponde al siguiente hito (26 al 30 de noviembre). Una cuenta ADMIN puede iniciar sesión en este avance y utilizar su sesión propia; aún no se incluyen altas de equipos, liberación de otros usuarios ni cambios de roles.

## API y seguridad

API: https://proyecto-idgs9-v1.onrender.com
Documentación: https://proyecto-idgs9-v1.onrender.com/api/docs/

Copiar `.env.example` a `.env` y completar el token de equipo entregado por el profesor. El `.env` local ya está configurado en la computadora de trabajo y está excluido de Git. No se guardan contraseñas en archivos fuente. El token de aplicación de Vite/Expo es visible en el cliente compilado, según el contrato de la clase; no es una clave de servidor.

Cada petición incluye `x-api-token`; las solicitudes protegidas agregan `Authorization: Bearer <JWT de usuario>`. El registro siempre crea un USER. Ante 401 se borra la sesión y vuelve el Login; ante 403 se muestra una alerta de acceso restringido. Un fallo temporal de red al restaurar el acceso permite reintentar sin perder el token. Se valida la sesión con `/api/auth/me`.

## Flujo de prueba

1. Iniciar sesión con las credenciales que entregó el profesor (no se publican en el repositorio).
2. Seleccionar Lab-A, Lab-B o Redes y revisar las estaciones y sus estados.
3. Seleccionar una PC disponible; indicar materia y entre 0.5 y 12 horas.
4. Revisar Mi sesión activa y liberar el equipo al terminar. Si se marca una falla, describirla con al menos 5 caracteres.
5. Cerrar sesión y comprobar que no sea posible acceder a las vistas protegidas.

Las pruebas contra la API generan registros reales de asignación. Usar una PC disponible y liberarla después. No liberar sesiones de otras personas. `npm test` usa respuestas simuladas y no modifica la API.

## Organización y GitFlow

`src/components`, `src/context`, `src/services`, `src/config` y `src/utils` separan presentación, estado y HTTP. Se usan formularios controlados, indicadores de carga, validación y bloqueo de doble envío.

Rama de este avance: `feature/auth-usuario`, basada en `develop`. Integración mediante Pull Request hacia `develop`; `main` se reserva para la versión final. Ver `docs/GITFLOW.md`.

## Ejecutar en Windows y Expo Go

```powershell
npm install
npx expo start
```

Abrir Expo Go en el celular y escanear el QR que imprime Metro. Usar la misma red Wi-Fi. El proyecto utiliza Expo SDK 58; Expo Go debe ser compatible con ese SDK. Si la red local impide conectar, revisar la conectividad antes de cambiar el código. Tras modificar `.env`, reiniciar Metro con `npx expo start --clear`.

Aplicación nativa con View, TextInput, Pressable, FlatList, Modal, ActivityIndicator y Switch. Expo Router utiliza Stack de React Navigation y protege el grupo de pantallas del usuario. JWT en expo-secure-store en Android/iOS; localStorage se utiliza únicamente en la previsualización web.

```powershell
npm test
npm run typecheck
npm run lint
npx expo export --platform android --output-dir dist-check
```

La exportación verifica el bundle Android, pero no genera un APK. La instalación y prueba en un dispositivo físico se realizan con Expo Go. Para revisar visualmente desde computadora puede usarse `npm run web`; esa vista previa no sustituye la prueba nativa.

## Entrega final posterior

El PDF pide compilar el APK localmente: `npx expo prebuild --platform android` y Gradle `assembleRelease`, con JDK/Android SDK configurados. Esa compilación y el panel ADMIN corresponden a los siguientes hitos. No se ha generado un APK en este avance.
