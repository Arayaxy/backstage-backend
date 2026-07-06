# PLAN DE DESARROLLO SECUENCIAL (TDD ESTRICTO): BACKEND ERP DE EVENTOS

Este documento establece el orden e instrucciones de ejecución para la construcción del Backend del ERP de Eventos, basado en las historias de usuario definidas en [AGENTS.md §3](./AGENTS.md#3-historias-de-usuario). El agente debe avanzar endpoint por endpoint y archivo por archivo, aplicando de forma obligatoria el flujo TDD antes de dar por completada cualquier tarea.

---

## PROTOCOLO TDD OBLIGATORIO

Para cada elemento del plan, aplicar el ciclo TDD definido en [AGENTS.md §4](./AGENTS.md#4-ciclo-de-desarrollo-tdd-estricto).

---

## FASE 0: INFRAESTRUCTURA BASE Y CONFIGURACIÓN

- [ ] **0.1. Configuración de Vitest + Supertest**
  - Instalar vitest y supertest como dependencias de desarrollo (`npm install -D vitest supertest`).
  - Crear `vitest.config.js` con entorno node.
  - Añadir script `"test": "vitest run"` en `package.json`.
  - Crear test de ejemplo para el health endpoint.

- [ ] **0.2. Refactorizar auth.middleware.js**
  - Migrar de `verifyAdmin` (JWT propio) a `authenticate` (Firebase Admin SDK).
  - Implementar `authorize(...roles)`.
  - **TDD:** Testear que authenticate rechaza peticiones sin token (401) y con token inválido (401). Testear que authorize restringe por rol (403).

- [ ] **0.3. Refactorizar respuestas al formato unificado**
  - Asegurar que todos los endpoints devuelvan `{ ok, data, meta }` / `{ ok, message, details }`.

- [ ] **0.4. Limpiar validationChains.js**
  - Eliminar o archivar el archivo legacy con imports de Mikro-ORM.

- [ ] **0.5. Configurar Multer + Cloudinary**
  - Instalar multer y cloudinary (`npm install multer cloudinary`).
  - Crear `src/utils/cloudinary.js`.
  - Crear `src/middlewares/upload.middleware.js` (memoryStorage, 10MB, PDF/JPG/PNG/PPT/PPTX).

---

## FASE 1: GESTIÓN DE EVENTOS

- [ ] **1.1. CRUD Eventos**
  - **TDD:** Testear creación, listado filtrable, detalle, edición y eliminación.
  - **Código:** Crear `src/validations/event.validation.js`, `src/models/Event.js`, `src/controllers/event.controller.js`, `src/routes/event.route.js`.

- [ ] **1.2. Endpoint /events/mis-eventos (Ponente Dashboard)**
  - **TDD:** Testear que devuelve solo los eventos asignados al ponente logueado.
  - **Código:** Endpoint `GET /api/v1/events/mis-eventos` con filtrado por id del ponente (desde `req.user`).

- [ ] **1.3. Evento detalle con datos del ponente**
  - **TDD:** Testear que al obtener detalle de un evento, si el usuario es ponente, se incluye su itinerario asociado.
  - **Código:** Enriquecer `event.getById` para incluir datos del ponente (itinerario, presentación).

---

## FASE 2: GESTIÓN DE SERVICIOS (CONTACTO)

- [ ] **2.1. CRUD Servicios**
  - **TDD:** Testear creación, listado, detalle, edición y eliminación solo por admin.
  - **Código:** Crear `src/validations/service.validation.js`, `src/models/Service.js`, `src/controllers/service.controller.js`, `src/routes/service.route.js`.

---

## FASE 3: GESTIÓN DE PONENTES

- [ ] **3.1. CRUD Ponentes**
  - **TDD:** Testear creación con itinerario completo, listado, detalle, edición y eliminación.
  - **Código:** Crear `src/validations/ponente.validation.js`, `src/models/Ponente.js`, `src/controllers/ponente.controller.js`, `src/routes/ponente.route.js`.

- [ ] **3.2. Subida y modificación de presentación (ponente)**
  - **TDD:** Testear que el ponente puede subir (POST) y modificar (PUT) su presentación, que rechaza archivos no permitidos.
  - **Código:** Endpoints `POST /api/v1/ponentes/:id/presentacion` y `PUT /api/v1/ponentes/:id/presentacion` con middleware `upload`.

---

## FASE 4: GESTIÓN DE CLIENTES Y USUARIOS

- [ ] **4.1. CRUD Clientes**
  - **TDD:** Testear creación, listado, edición y eliminación solo por admin.
  - **Código:** Crear `src/validations/client.validation.js`, `src/models/Client.js`, `src/controllers/client.controller.js`, `src/routes/client.route.js`.

- [ ] **4.2. Asignación de roles**
  - **TDD:** Testear que admin puede cambiar el rol de un usuario.
  - **Código:** Endpoint `PUT /api/v1/users/:id/role`.

---

## FASE 5: CHAT Y NOTIFICACIONES

- [ ] **5.1. Chat**
  - **TDD:** Testear envío y recepción de mensajes.
  - **Código:** Crear `src/models/Message.js`, `src/controllers/chat.controller.js`, `src/routes/chat.route.js`.

- [ ] **5.2. Notificaciones**
  - **TDD:** Testear creación y consulta de notificaciones por usuario.
  - **Código:** Crear `src/models/Notification.js`, `src/controllers/notification.controller.js`, `src/routes/notification.route.js`.

---

## FASE 6: SEGURIDAD Y CALIDAD

- [ ] **6.1. Swagger / OpenAPI**
  - Instalar swagger-ui-express y js-yaml (`npm install swagger-ui-express js-yaml`).
  - Crear archivo `openapi.yaml` con documentación de la API.
  - Integrar Swagger en `src/app.js`.

- [ ] **6.2. Rate limiting y seguridad**
  - Implementar helmet, express-rate-limit.
  - Validar CORS origins correctamente.

---

## REPORTE DE ENTREGA TDD OBLIGATORIO

Al finalizar cada subtarea, incluir el reporte del ciclo TDD siguiendo el formato definido en [AGENTS.md §12](./AGENTS.md#12-formato-de-salida-e-interacción).
