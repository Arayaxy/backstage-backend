# PLAN DE DESARROLLO — Backend Tripulaciones

## PROTOCOLO TDD OBLIGATORIO

Para cada elemento del plan, aplicar el ciclo TDD definido en [AGENTS.md §4](./AGENTS.md#4-ciclo-de-desarrollo-tdd-estricto).

---

## Fase 0: Infraestructura y Setup Inicial

### 0.1 Cloudinary / File Upload (YA IMPLEMENTADO)
- [x] Instalar `cloudinary`, `multer-storage-cloudinary`
- [x] Crear `src/config/cloudinary.js` — Configuración de Cloudinary
- [x] Crear `src/config/upload.js` — Configuración Multer + CloudinaryStorage
- [x] Crear `src/middlewares/upload.middleware.js` — Middleware Multer
- [x] Crear `src/controllers/upload.controller.js` — Controlador de subida
- [x] Crear `src/routes/upload.route.js` — POST `/api/v1/upload`
- [x] Actualizar `src/config/env.js` con variables Cloudinary
- [x] Actualizar `.env.example` con `CLOUDINARY_*`

### 0.2 Prisma (PENDIENTE)
- [ ] Instalar `@prisma/client`, `@prisma/adapter-pg`, `pg`
- [ ] Instalar `prisma` como devDependency
- [ ] Ejecutar `npx prisma init`
- [ ] Actualizar `.env.example` con `DATABASE_URL`
- [ ] Agregar `DATABASE_URL` como variable requerida en `src/config/env.js`
- [ ] Crear `src/lib/prisma.js` con `PrismaPg` + `pg.Pool`
- [ ] Escribir modelos en `prisma/schema.prisma`
- [ ] Ejecutar `npx prisma generate`
- [ ] Ejecutar `npx prisma migrate dev --name init`

### 0.3 Testing
- [ ] Configurar Supertest + framework de testing
- [ ] Crear test de health check
- [ ] Crear test de autenticación
- [ ] Crear test de subida de archivos

---

## Fase 1: Autenticación y Usuarios

### 1.1 Auth (ya implementado parcialmente)
- [x] POST `/api/v1/auth/login` — Recibe Firebase ID token, verifica, crea JWT en cookie
- [x] GET `/api/v1/auth/verify` — Verifica cookie JWT
- [x] POST `/api/v1/auth/logout` — Limpia cookie

### 1.2 Mejoras a Auth
- [ ] Refactorizar `auth.controller.js` para usar Prisma (buscar/crear usuario en BD al login)
- [ ] Actualizar `auth.middleware.js`: implementar `authenticate` (genérico) y `authorize` (por roles)
- [ ] Sincronizar usuarios de Firebase con tabla `users` en PostgreSQL

### 1.3 Gestión de Usuarios (Admin)
- [ ] GET `/api/v1/users` — Listar usuarios
- [ ] PUT `/api/v1/users/:id/role` — Asignar rol

---

## Fase 2: Gestión de Eventos (Admin)

### 2.1 CRUD Eventos
- [ ] Crear `routes/event.route.js`
- [ ] Crear `controllers/event.controller.js`
- [ ] Crear `validations/event.validation.js`
- [ ] GET `/api/v1/events` — Listar eventos (con filtros: estado, fecha, búsqueda)
- [ ] GET `/api/v1/events/:id` — Detalle de evento (con ponentes, itinerarios)
- [ ] POST `/api/v1/events` — Crear evento
- [ ] PUT `/api/v1/events/:id` — Actualizar evento
- [ ] DELETE `/api/v1/events/:id` — Eliminar evento

---

## Fase 3: Gestión de Servicios (Admin)

### 3.1 CRUD Servicios
- [ ] Crear `routes/service.route.js`
- [ ] Crear `controllers/service.controller.js`
- [ ] GET `/api/v1/services` — Listar servicios
- [ ] GET `/api/v1/services/:id` — Ver servicio
- [ ] POST `/api/v1/services` — Crear servicio
- [ ] PUT `/api/v1/services/:id` — Actualizar servicio
- [ ] DELETE `/api/v1/services/:id` — Eliminar servicio

---

## Fase 4: Gestión de Ponentes (Admin)

### 4.1 CRUD Ponentes
- [ ] Crear `routes/ponente.route.js`
- [ ] Crear `controllers/ponente.controller.js`
- [ ] GET `/api/v1/ponentes` — Listar ponentes
- [ ] GET `/api/v1/ponentes/:id` — Ver ponente con itinerario
- [ ] POST `/api/v1/ponentes` — Crear ponente (con itinerario: transporte, ponencia, hotel)
- [ ] PUT `/api/v1/ponentes/:id` — Actualizar ponente
- [ ] DELETE `/api/v1/ponentes/:id` — Eliminar ponente

---

## Fase 5: Dominio Ponente (Dashboard + Eventos + Chat)

### 5.1 Dashboard Ponente
- [ ] GET `/api/v1/events/mis-eventos` — Eventos asignados al ponente logueado

### 5.2 Detalle de Evento (Ponente)
- [ ] GET `/api/v1/events/:id` — Info completa: estado, fechas, ubicación, documentación, itinerario

### 5.3 Presentaciones (infraestructura Cloudinary lista, ver Fase 0.1)
- [ ] POST `/api/v1/ponentes/:id/presentacion` — Subir presentación (usar upload existente)
- [ ] PUT `/api/v1/ponentes/:id/presentacion` — Modificar presentación

### 5.4 Notificaciones
- [ ] Crear `routes/notification.route.js`
- [ ] Crear `controllers/notification.controller.js`
- [ ] GET `/api/v1/notifications` — Obtener notificaciones del usuario
- [ ] PUT `/api/v1/notifications/:id/read` — Marcar como leída
- [ ] Lógica de creación automática al modificar horario/perfil del ponente

### 5.5 Chat
- [ ] Crear `routes/chat.route.js`
- [ ] Crear `controllers/chat.controller.js`
- [ ] GET `/api/v1/chat/:eventoId` — Obtener mensajes de un evento
- [ ] POST `/api/v1/chat` — Enviar mensaje

---

## Fase 6: Gestión de Clientes (Admin)

### 6.1 CRUD Clientes
- [ ] Crear `routes/client.route.js`
- [ ] Crear `controllers/client.controller.js`
- [ ] GET `/api/v1/clients` — Listar clientes
- [ ] POST `/api/v1/clients` — Crear cliente
- [ ] PUT `/api/v1/clients/:id` — Actualizar cliente
- [ ] DELETE `/api/v1/clients/:id` — Eliminar cliente

---

## Fase 7: Seguridad y Mejoras

- [x] Implementar Multer + Cloudinary para subida de archivos (Fase 0.1)
- [ ] Rate limiting
- [ ] Helmet para seguridad de headers
- [ ] Swagger / OpenAPI para documentación de endpoints
- [ ] Logging estructurado
- [ ] Paginación en listados
