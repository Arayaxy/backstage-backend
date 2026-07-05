# PLAN DE DESARROLLO SECUENCIAL (TDD ESTRICTO): BACKEND ERP DE EVENTOS

Este documento establece el orden e instrucciones de ejecución para la construcción del Backend del ERP de Eventos. El agente debe avanzar endpoint por endpoint y archivo por archivo, aplicando de forma obligatoria el flujo TDD (Test-Driven Development) antes de dar por completada cualquier tarea.

---

## PROTOCOLO TDD OBLIGATORIO PARA EL AGENTE

Para cada elemento del plan, el agente debe proceder aplicando el ciclo TDD definido en [AGENTS.md §4](./AGENTS.md#4-ciclo-de-desarrollo-tdd-estricto).

---

## FASE 0: INFRAESTRUCTURA BASE Y CONFIGURACIÓN

- [ ] **0.1. Configuración de Vitest**
  - Instalar vitest y supertest como dependencias de desarrollo (`pnpm add -D vitest supertest`).
  - Crear `vitest.config.js` con entorno node.
  - Añadir script `"test": "vitest run"` en `package.json`.
  - Crear test de ejemplo para el health endpoint.

- [ ] **0.2. Variables de Entorno y Configuración**
  - Actualizar `.env.example` con todas las variables necesarias (Firebase, Cloudinary, BD pendiente).
  - Crear `.env` para desarrollo local.
  - Asegurar que `src/config/env.js` valida las nuevas variables.

- [ ] **0.3. Configuración de Firebase Admin SDK**
  - **TDD:** Testear que el middleware authenticate rechaza peticiones sin token (401) y con token inválido (401).
  - **Código:** Crear `src/utils/firebase.js` con inicialización de Firebase Admin. Implementar `src/middlewares/auth.middleware.js` con `authenticate` y `authorize`.

- [ ] **0.4. Configuración de Multer + Cloudinary**
  - **TDD:** Testear que el middleware upload rechaza archivos de tipo no permitido y archivos que exceden el límite de tamaño.
  - **Código:** Crear `src/utils/cloudinary.js` con configuración de Cloudinary. Crear `src/middlewares/upload.middleware.js` con Multer + subida a Cloudinary.

- [ ] **0.5. Configuración de Swagger / OpenAPI**
  - Instalar swagger-ui-express y js-yaml.
  - Crear archivo `openapi.yaml` con la definición base de la API.
  - Integrar Swagger en `src/app.js`.

---

## FASE 1: AUTENTICACIÓN Y USUARIOS

- [ ] **1.1. Endpoint auth/register**
  - **TDD:** Testear que solo administrador puede crear clientes, que rechaza campos inválidos (400), y que responde correctamente (201).
  - **Código:** Crear `src/validations/user.validation.js` (nombre, email, rol), `src/controllers/auth.controller.js` (register), `src/routes/auth.route.js`.
  - **Modelo:** Crear `src/models/User.js` con funciones para crear y consultar usuarios.

- [ ] **1.2. Endpoint auth/me**
  - **TDD:** Testear que devuelve los datos del usuario autenticado, y que rechaza sin token (401).
  - **Código:** Añadir controlador `auth.getMe` y ruta correspondiente.

- [ ] **1.3. CRUD de Usuarios (admin)**
  - **TDD:** Testear listado, edición y eliminación de usuarios solo por administrador.
  - **Código:** Crear `src/controllers/user.controller.js` (getAll, update, remove) y `src/routes/user.route.js`.

---

## FASE 2: PRESUPUESTOS (CORE DEL PRODUCTO)

- [ ] **2.1. CRUD de Presupuestos**
  - **TDD:** Testear creación, listado, detalle, edición y eliminación solo por administrador. Validar que los importes sean positivos y la moneda válida.
  - **Código:** Crear `src/validations/budget.validation.js`, `src/models/Budget.js`, `src/controllers/budget.controller.js`, `src/routes/budget.route.js`.

- [ ] **2.2. Partidas de Presupuesto**
  - **TDD:** Testear añadir, editar y eliminar partidas dentro de un presupuesto. Validar tipo ('ingreso' | 'gasto') e importe.
  - **Código:** Añadir funciones al modelo Budget para gestionar partidas, y endpoints anidados (`/api/v1/budgets/:id/items`).

---

## FASE 3: GESTIÓN DE EVENTOS

- [ ] **3.1. Crear Evento**
  - **TDD:** Testear que solo administrador puede crear, que valida campos obligatorios (título, fechas), y que el evento se asocia a un presupuesto opcionalmente.
  - **Código:** Crear `src/validations/event.validation.js`, `src/models/Event.js`, `src/controllers/event.controller.js` (create), `src/routes/event.route.js`.

- [ ] **3.2. Listar Eventos**
  - **TDD:** Testear que administrador ve todos los eventos, cliente ve solo los suyos, y que filtra por estado/fecha/presupuesto si se proporciona.
  - **Código:** Añadir controlador `event.getAll` con filtrado por rol.

- [ ] **3.3. Detalle, Edición y Eliminación de Eventos**
  - **TDD:** Testear detalle con datos del presupuesto asociado, edición y eliminación solo por administrador.
  - **Código:** Añadir controladores `event.getById`, `event.update`, `event.remove`.

---

## FASE 4: PRESENTACIONES

- [ ] **4.1. Subir Presentación**
  - **TDD:** Testear que cliente puede subir presentaciones a sus eventos, que rechaza archivos no permitidos, y que almacena la URL de Cloudinary.
  - **Código:** Crear `src/validations/presentation.validation.js`, `src/models/Presentation.js`, `src/controllers/presentation.controller.js` (upload), `src/routes/presentation.route.js`. Usar middleware `upload` de la Fase 0.

- [ ] **4.2. Consultar Presentaciones**
  - **TDD:** Testear que administrador ve todas las presentaciones de un evento y cliente solo las suyas.
  - **Código:** Añadir controladores `presentation.getByEvent`, `presentation.getById`.

---

## REPORTE DE ENTREGA TDD OBLIGATORIO

Al finalizar cada subtarea, el agente debe incluir el reporte del ciclo TDD siguiendo el formato definido en [AGENTS.md §13](./AGENTS.md#13-formato-de-salida-e-interacción).
