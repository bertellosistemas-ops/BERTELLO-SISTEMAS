# Biblioteca Escolar - Implementación Integral

## Estructura

- `/app/` - Aplicación principal (Electron)
  - `main.js` - Entrada principal
  - `package.json` - Configuración y build
  - `/ui/` - Interfaz de usuario
  - `/modules/` - Módulos funcionales (usuarios, libros, préstamos, cámara, voz, respaldo, auditoría, importación, chatbot, consola oculta)
  - `/db/` - Base de datos SQLite
  - `/assets/` - Archivos adjuntos
  - `/consola/` - Consola web de administración (GitHub Pages)

## Módulos implementados

- **Base de datos**: SQLite, esquema robusto y persistente
- **Usuarios**: alta, búsqueda por DNI
- **Libros**: alta, búsqueda por ISBN
- **Préstamos**: registrar, devolver
- **Auditoría**: log de acciones
- **Respaldo**: backup ZIP de la base y adjuntos
- **Importación**: CSV funcional, extensible a MARC21/DBF
- **Cámara/Voz**: stubs listos para integrar ZXing/WebSpeech
- **Chatbot IA**: stub para Llama 3 local/API
- **Consola oculta**: cliente real, comunicación con GitHub Pages
- **Consola web**: panel de administración, envío de comandos, filtro y control de copias

## Flujos clave

- Activación de consola oculta: triple clic en campo ISBN + clave 2003
- Reporte diario de cada copia a GitHub Pages
- Ejecución y confirmación de comandos desde la consola web
- Permisos, auditoría y respaldo integrados

## Empaquetado

1. Instalar dependencias:
   ```bash
   cd app
   npm install
   ```
2. Probar en desarrollo:
   ```bash
   npm start
   ```
3. Generar ejecutable portable:
   ```bash
   npm run build
   ```

## Personalización

- Cambia los valores de `REPO`, `TOKEN`, `ID_COPIA` en `modules/console_client.js` y `consola/consola.js` por los de tu organización.
- Integra ZXing/Quagga para cámara y WebSpeech para voz según hardware.
- Extiende importación a MARC21/DBF según tus fuentes.
- Integra Llama 3 local/API en `chatbot.js`.

## Seguridad

- Consola oculta solo accesible con clave.
- Tokens GitHub deben ser técnicos y guardados seguros.
- Auditoría y respaldo automáticos.

## Checklist de aceptación

- Inventario único por ejemplar
- Estructura E–A–P operativa
- Préstamos con control de límite y excepción
- Importación y backup funcionales
- Mensajería y consola web operativas
- Roles y permisos configurables
- Reportes y confirmaciones diarias

---

**Listo para que la IA de GitHub o cualquier desarrollador continúe, mejore o despliegue el sistema completo.**