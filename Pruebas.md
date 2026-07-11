# Plan de Pruebas — Backend Proyecto Tripulaciones

> **Nota:** Todas las rutas protegidas requieren cookie `token` con JWT válido (obtenido via `POST /auth/login` con Firebase ID token).
> A menos que se indique lo contrario, los cuerpos usan `Content-Type: application/json`.

---

## Globales

| # | Test | Método | URL | Expected |
|---|---|---|---|---|
| G1 | Ruta inexistente | GET | `/api/v1/noexiste` | 404 + `{ ok: false, message: "..." }` |
| G2 | Sin token JWT | GET | `/api/v1/eventos` (sin cookie) | 401 + `"Autenticación requerida"` |
| G3 | Token inválido | GET | `/api/v1/eventos` con cookie `token=basura` | 401 + `"Sesión inválida o expirada"` |
| G4 | Método no soportado | PUT | `/api/v1/eventos` | 404 |
| G5 | Content-Type incorrecto | POST | `/api/v1/eventos` con `Content-Type: application/xml` | 400 |
| G6 | Body vacío en POST obligatorio | POST | `/api/v1/eventos` con `{}` | 400 + errores validación |

---

## Health

| # | Test | Método | URL | Expected |
|---|---|---|---|---|
| H1 | Health check ok | GET | `/api/v1/health` | 200 + `{ ok: true, data: {...} }` |
| H2 | Force error (dev) | GET | `/api/v1/debug/force-error` | 500 + `{ ok: false, error: [...] }` |

---

## Auth

| # | Test | Método | URL | Body / Headers | Expected |
|---|---|---|---|---|---|
| A1 | Login sin token | POST | `/api/v1/auth/login` | Sin `Authorization` | 400 + `"No Token Encontrado"` |
| A2 | Login token Firebase inválido | POST | `/api/v1/auth/login` | `Authorization: Bearer token-falso` | 401 + `"El token no es valido"` |
| A3 | Verify sin cookie | GET | `/api/v1/auth/verify` | — | 401 + `"No esta logeado"` |
| A4 | Verify con cookie válida | GET | `/api/v1/auth/verify` | cookie `token=<jwt_valido>` | 200 + `{ ok: true, user: {...} }` |
| A5 | Logout | POST | `/api/v1/auth/logout` | — | 200 + `"Session Cerrada!"` + cookie eliminada |
| A6 | Login sin prefijo Bearer | POST | `/api/v1/auth/login` | `Authorization: Basic token-falso` | 400 |
| A7 | Login Bearer token vacío | POST | `/api/v1/auth/login` | `Authorization: Bearer ` | 401 |
| A8 | Logout invalida acceso | GET | `/api/v1/eventos/<id>` tras logout | cookie eliminada | 401 |

---

## Eventos

| # | Test | Método | URL | Body / Params | Expected |
|---|---|---|---|---|---|
| E1 | Listar eventos | GET | `/api/v1/eventos` | — | 200 + array de eventos |
| E2 | Filtrar por ciudad | GET | `/api/v1/eventos?ciudad=Bilbao` | — | 200 + solo eventos en Bilbao |
| E3 | Filtrar por tipo | GET | `/api/v1/eventos?tipoEvento=Congreso` | — | 200 + solo Congresos |
| E4 | Crear evento ok | POST | `/api/v1/eventos` | `{ nombreEvento: "Test", ciudad: "Madrid", tipoEvento: "Conferencia", numeroPersonas: 50, fechaInicio: "2026-08-01T10:00:00Z", fechaFin: "2026-08-02T18:00:00Z", idCliente: "<uuid>", idEstado: "<uuid>" }` | 201 + evento creado |
| E5 | Crear evento sin nombre | POST | `/api/v1/eventos` | `{ ciudad: "Madrid", tipoEvento: "X", numeroPersonas: 10, fechaInicio: "...", fechaFin: "...", idCliente: "<uuid>", idEstado: "<uuid>" }` | 400 + error validación `nombreEvento` |
| E6 | Crear evento idCliente no UUID | POST | `/api/v1/eventos` | `{ nombreEvento: "Test", ciudad: "Madrid", tipoEvento: "X", numeroPersonas: 10, fechaInicio: "...", fechaFin: "...", idCliente: "no-uuid", idEstado: "<uuid>" }` | 400 + error validación `idCliente` |
| E7 | Crear evento FK inexistente | POST | `/api/v1/eventos` | body ok pero `idCliente: "<uuid_valido_inexistente>"` | 400 + error foreign key (P2003) |
| E8 | Get evento por ID existente | GET | `/api/v1/eventos/<id_existente>` | — | 200 + evento |
| E9 | Get evento ID inexistente | GET | `/api/v1/eventos/<uuid_inexistente>` | — | 404 + `"Evento no encontrado"` |
| E10 | Get evento ID no UUID | GET | `/api/v1/eventos/123` | — | 400 + error validación `id` |
| E11 | Actualizar evento ok | PATCH | `/api/v1/eventos/<id_existente>` | `{ nombreEvento: "Actualizado" }` | 200 + evento actualizado |
| E12 | Actualizar evento ID inexistente | PATCH | `/api/v1/eventos/<uuid_inexistente>` | `{ nombreEvento: "Test" }` | 404 |
| E13 | Eliminar evento ok | DELETE | `/api/v1/eventos/<id_existente>` | — | 200 + `"Evento eliminado correctamente"` |
| E14 | Eliminar evento ID inexistente | DELETE | `/api/v1/eventos/<uuid_inexistente>` | — | 404 |
| E15 | Crear evento fechaFin < fechaInicio | POST | `/api/v1/eventos` | `{ ... fechaInicio: "2026-08-10T00:00:00Z", fechaFin: "2026-08-05T00:00:00Z" ... }` | 400 + error validación custom |
| E16 | PATCH fechaFin anterior a fechaInicio | PATCH | `/api/v1/eventos/<id_existente>` | `{ fechaFin: "2020-01-01T00:00:00Z" }` | 400 (si fechaInicio posterior) |
| E17 | Crear evento nombreEvento 1 char | POST | `/api/v1/eventos` | `{ nombreEvento: "A", ... }` | 400 (min: 2) |
| E18 | Crear evento numeroPersonas = 0 | POST | `/api/v1/eventos` | `{ ... numeroPersonas: 0 ... }` | 400 (min: 1) |
| E19 | Crear evento fechaInicio no ISO | POST | `/api/v1/eventos` | `{ ... fechaInicio: "no-es-fecha" ... }` | 400 |
| E20 | PATCH body vacío | PATCH | `/api/v1/eventos/<id_existente>` | `{}` | 200 sin cambios |
| E21 | PATCH idCliente a UUID inexistente | PATCH | `/api/v1/eventos/<id_existente>` | `{ idCliente: "<uuid_inexistente>" }` | 400 P2003 |
| E22 | DELETE evento con ponencias asociadas | DELETE | `/api/v1/eventos/<id_con_ponencias>` | — | Error FK (P2003 / P2014) |
| E23 | PATCH numeroPersonas = 0 | PATCH | `/api/v1/eventos/<id_existente>` | `{ numeroPersonas: 0 }` | 400 (min: 1) |
| E24 | GET filtros combinados | GET | `/api/v1/eventos?ciudad=Bilbao&tipoEvento=Congreso` | — | 200 + solo eventos que cumplen ambos |
| E25 | GET filtro sin resultados | GET | `/api/v1/eventos?ciudad=NoExiste` | — | 200 + `[]` |

---

## Clientes

| # | Test | Método | URL | Body / Params | Expected |
|---|---|---|---|---|---|
| C1 | Listar clientes | GET | `/api/v1/clientes` | — | 200 + array |
| C2 | Filtrar por sector | GET | `/api/v1/clientes?sector=Tecnologia` | — | 200 + filtrados |
| C3 | Crear cliente ok | POST | `/api/v1/clientes` | `{ cliente: "Test", email: "test@test.com" }` | 201 |
| C4 | Crear cliente sin email | POST | `/api/v1/clientes` | `{ cliente: "Test" }` | 400 + error `email` |
| C5 | Crear cliente email repetido | POST | `/api/v1/clientes` | `{ cliente: "Test", email: "<email_existente>" }` | 409 P2002 |
| C6 | Get cliente ID inexistente | GET | `/api/v1/clientes/<uuid_inexistente>` | — | 404 |
| C7 | Actualizar cliente ok | PATCH | `/api/v1/clientes/<id_existente>` | `{ telefono: "944000000" }` | 200 |
| C8 | Actualizar cliente ID inexistente | PATCH | `/api/v1/clientes/<uuid_inexistente>` | `{ telefono: "944000000" }` | 404 |
| C9 | Eliminar cliente ok | DELETE | `/api/v1/clientes/<id_existente>` | — | 200 |
| C10 | Crear cliente sin nombre | POST | `/api/v1/clientes` | `{ email: "test@test.com" }` | 400 + error `cliente` |
| C11 | Crear email mal formado | POST | `/api/v1/clientes` | `{ cliente: "Test", email: "invalido" }` | 400 |
| C12 | PATCH body vacío | PATCH | `/api/v1/clientes/<id_existente>` | `{}` | 200 sin cambios |
| C13 | PATCH email a duplicado | PATCH | `/api/v1/clientes/<id_existente>` | `{ email: "<email_de_otro_cliente>" }` | 409 P2002 *(bug: puede dar 500)* |
| C14 | DELETE cliente con eventos | DELETE | `/api/v1/clientes/<id_con_eventos>` | — | Error FK |
| C15 | Filtrar por ciudad | GET | `/api/v1/clientes?ciudad=Bilbao` | — | 200 + filtrados |

---

## Espacios

| # | Test | Método | URL | Body / Params | Expected |
|---|---|---|---|---|---|
| ES1 | Listar espacios | GET | `/api/v1/espacios` | — | 200 |
| ES2 | Buscar por capacidad (min y max) | GET | `/api/v1/espacios/buscar?min=100&max=500` | — | 200 + espacios y salas en rango |
| ES3 | Buscar solo min | GET | `/api/v1/espacios/buscar?min=200` | — | 200 + espacios con aforo >= 200 |
| ES4 | Buscar solo max | GET | `/api/v1/espacios/buscar?max=300` | — | 200 + espacios con aforo <= 300 |
| ES5 | Buscar sin filtros | GET | `/api/v1/espacios/buscar` | — | 200 + todos (min=0, max=999999) |
| ES6 | Crear espacio ok | POST | `/api/v1/espacios` | `{ nombreEspacio: "Test", ciudad: "Bilbao", direccion: "Calle 1", aforo: 100 }` | 201 |
| ES7 | Crear espacio sin nombre | POST | `/api/v1/espacios` | `{ ciudad: "Bilbao", direccion: "C/ 1", aforo: 100 }` | 400 + error `nombreEspacio` |
| ES8 | Actualizar espacio ok | PATCH | `/api/v1/espacios/<id_existente>` | `{ aforo: 300 }` | 200 |
| ES9 | Actualizar espacio ID inexistente | PATCH | `/api/v1/espacios/<uuid_inexistente>` | `{ aforo: 300 }` | 404 |
| ES10 | Eliminar espacio ok | DELETE | `/api/v1/espacios/<id_existente>` | — | 200 |
| ES11 | Eliminar espacio con salas asociadas | DELETE | `/api/v1/espacios/<id_con_salas>` | — | Error FK |
| ES12 | Crear espacio sin ciudad | POST | `/api/v1/espacios` | `{ nombreEspacio: "Test", direccion: "C/ 1", aforo: 100 }` | 400 + error `ciudad` |
| ES13 | Crear espacio aforo = 0 | POST | `/api/v1/espacios` | `{ nombreEspacio: "Test", ciudad: "Bilbao", direccion: "C/ 1", aforo: 0 }` | 400 (min: 1) |
| ES14 | Crear espacio sin dirección | POST | `/api/v1/espacios` | `{ nombreEspacio: "Test", ciudad: "Bilbao", aforo: 100 }` | 400 + error `direccion` |
| ES15 | PATCH body vacío | PATCH | `/api/v1/espacios/<id_existente>` | `{}` | 200 sin cambios |
| ES16 | Filtrar por ciudad | GET | `/api/v1/espacios?ciudad=Bilbao` | — | 200 + filtrados |
| ES17 | Buscar min > max | GET | `/api/v1/espacios/buscar?min=500&max=100` | — | 200 + `[]` |
| ES18 | Buscar min negativo | GET | `/api/v1/espacios/buscar?min=-10` | — | 200 + `[]` |

---

## Ponentes

| # | Test | Método | URL | Body / Params | Expected |
|---|---|---|---|---|---|
| P1 | Listar ponentes | GET | `/api/v1/ponentes` | — | 200 |
| P2 | Filtrar por sector | GET | `/api/v1/ponentes?sector=Tecnologia` | — | 200 |
| P3 | Crear ponente ok | POST | `/api/v1/ponentes` | `{ nombrePonente: "Test", email: "p@test.com" }` | 201 |
| P4 | Crear ponente sin email | POST | `/api/v1/ponentes` | `{ nombrePonente: "Test" }` | 400 |
| P5 | Crear ponente email repetido | POST | `/api/v1/ponentes` | `{ nombrePonente: "Test", email: "<existente>" }` | 409 P2002 |
| P6 | Get ponente ID inexistente | GET | `/api/v1/ponentes/<uuid_inexistente>` | — | 404 |
| P7 | Actualizar ponente ok | PATCH | `/api/v1/ponentes/<id_existente>` | `{ cargo: "Nuevo cargo" }` | 200 |
| P8 | Actualizar ponente ID inexistente | PATCH | `/api/v1/ponentes/<uuid_inexistente>` | `{ cargo: "Test" }` | 404 |
| P9 | Eliminar ponente con ponencias | DELETE | `/api/v1/ponentes/<id_con_ponencias>` | — | Error FK |
| P10 | Crear sin nombrePonente | POST | `/api/v1/ponentes` | `{ email: "p@test.com" }` | 400 |
| P11 | Crear email mal formado | POST | `/api/v1/ponentes` | `{ nombrePonente: "Test", email: "invalido" }` | 400 |
| P12 | PATCH body vacío | PATCH | `/api/v1/ponentes/<id_existente>` | `{}` | 200 |
| P13 | DELETE ponente sin ponencias | DELETE | `/api/v1/ponentes/<id_sin_ponencias>` | — | 200 |
| P14 | PATCH email a duplicado | PATCH | `/api/v1/ponentes/<id_existente>` | `{ email: "<email_de_otro_ponente>" }` | 409 P2002 |
| P15 | Filtrar sector sin resultados | GET | `/api/v1/ponentes?sector=NoExiste` | — | 200 + `[]` |

---

## Salas

| # | Test | Método | URL | Body / Params | Expected |
|---|---|---|---|---|---|
| S1 | Listar salas | GET | `/api/v1/salas` | — | 200 |
| S2 | Filtrar por espacio | GET | `/api/v1/salas?idEspacio=<uuid>` | — | 200 + solo salas de ese espacio |
| S3 | Crear sala ok | POST | `/api/v1/salas` | `{ nombreSala: "Sala A", tipoSala: "Conferencias", capacidadMaxSala: 100, idEspacio: "<uuid>" }` | 201 |
| S4 | Crear sala sin capacidad | POST | `/api/v1/salas` | `{ nombreSala: "Sala A", tipoSala: "X", idEspacio: "<uuid>" }` | 400 + error `capacidadMaxSala` |
| S5 | Crear sala idEspacio inexistente | POST | `/api/v1/salas` | body ok pero `idEspacio: "<uuid_inexistente>"` | 400 + error FK |
| S6 | Get sala ID inexistente | GET | `/api/v1/salas/<uuid_inexistente>` | — | 404 |
| S7 | Actualizar sala ok | PATCH | `/api/v1/salas/<id_existente>` | `{ nombreSala: "Sala renovada" }` | 200 |
| S8 | Actualizar sala ID inexistente | PATCH | `/api/v1/salas/<uuid_inexistente>` | `{ nombreSala: "Test" }` | 404 |
| S9 | Eliminar sala con eventos | DELETE | `/api/v1/salas/<id_con_eventos>` | — | Error FK |
| S10 | Crear capacidadMaxSala = 0 | POST | `/api/v1/salas` | `{ nombreSala: "S", tipoSala: "X", capacidadMaxSala: 0, idEspacio: "<uuid>" }` | 400 (min: 1) |
| S11 | Crear idEspacio no UUID | POST | `/api/v1/salas` | `{ nombreSala: "S", tipoSala: "X", capacidadMaxSala: 50, idEspacio: "no-uuid" }` | 400 |
| S12 | PATCH body vacío | PATCH | `/api/v1/salas/<id_existente>` | `{}` | 200 |
| S13 | Filtrar idEspacio inexistente | GET | `/api/v1/salas?idEspacio=<uuid_inexistente>` | — | 200 + `[]` |
| S14 | PATCH idEspacio a UUID inexistente | PATCH | `/api/v1/salas/<id_existente>` | `{ idEspacio: "<uuid_inexistente>" }` | 400 P2003 |
| S15 | Crear tipoSala vacío | POST | `/api/v1/salas` | `{ nombreSala: "S", tipoSala: "", capacidadMaxSala: 50, idEspacio: "<uuid>" }` | 400 |

---

## Ponencias

| # | Test | Método | URL | Body / Params | Expected |
|---|---|---|---|---|---|
| PO1 | Listar ponencias | GET | `/api/v1/ponencias` | — | 200 |
| PO2 | Filtrar por ponente | GET | `/api/v1/ponencias?idPonente=<uuid>` | — | 200 |
| PO3 | Crear ponencia ok | POST | `/api/v1/ponencias` | `{ nombreHotel: "Hotel", localizacionHotel: "Calle 1", horarioPonencia: "2026-07-15T10:00:00Z", ponenteEstado: "Confirmado", tipoPonencia: "Charla", idPonente: "<uuid>" }` | 201 |
| PO4 | Crear ponencia sin datos | POST | `/api/v1/ponencias` | `{}` | 400 (varios campos requeridos) |
| PO5 | Crear ponencia idPonente inexistente | POST | `/api/v1/ponencias` | body ok pero `idPonente: "<uuid_inexistente>"` | 400 + error FK |
| PO6 | Get ponencia ID inexistente | GET | `/api/v1/ponencias/<uuid_inexistente>` | — | 404 |
| PO7 | Actualizar ponencia ok | PATCH | `/api/v1/ponencias/<id_existente>` | `{ ponenteEstado: "Pendiente" }` | 200 |
| PO8 | Actualizar ponencia ID inexistente | PATCH | `/api/v1/ponencias/<uuid_inexistente>` | `{ ponenteEstado: "Test" }` | 404 |
| PO9 | Crear sin nombreHotel | POST | `/api/v1/ponencias` | `{ localizacionHotel: "C/ 1", horarioPonencia: "...", ponenteEstado: "C", tipoPonencia: "X", idPonente: "<uuid>" }` | 400 |
| PO10 | Crear sin localizacionHotel | POST | `/api/v1/ponencias` | `{ nombreHotel: "H", horarioPonencia: "...", ponenteEstado: "C", tipoPonencia: "X", idPonente: "<uuid>" }` | 400 |
| PO11 | Crear idPonente no UUID | POST | `/api/v1/ponencias` | body ok pero `idPonente: "no-uuid"` | 400 |
| PO12 | Crear horarioPonencia inválido | POST | `/api/v1/ponencias` | `{ ..., horarioPonencia: "no-es-fecha", ... }` | 400 |
| PO13 | PATCH body vacío | PATCH | `/api/v1/ponencias/<id_existente>` | `{}` | 200 |
| PO14 | DELETE ponencia ok | DELETE | `/api/v1/ponencias/<id_existente>` | — | 200 |
| PO15 | Filtrar idPonente inexistente | GET | `/api/v1/ponencias?idPonente=<uuid_inexistente>` | — | 200 + `[]` |
| PO16 | PATCH idPonente a UUID inexistente | PATCH | `/api/v1/ponencias/<id_existente>` | `{ idPonente: "<uuid_inexistente>" }` | 400 P2003 |

---

## Estados

| # | Test | Método | URL | Body / Params | Expected |
|---|---|---|---|---|---|
| ST1 | Listar estados | GET | `/api/v1/estados` | — | 200 |
| ST2 | Crear estado ok | POST | `/api/v1/estados` | `{ descripcion: "Planificado" }` | 201 |
| ST3 | Crear estado sin descripción | POST | `/api/v1/estados` | `{}` | 400 |
| ST4 | Get estado ID inexistente | GET | `/api/v1/estados/<uuid_inexistente>` | — | 404 |
| ST5 | Actualizar estado ok | PATCH | `/api/v1/estados/<id_existente>` | `{ descripcion: "Actualizado" }` | 200 |
| ST6 | Actualizar estado ID inexistente | PATCH | `/api/v1/estados/<uuid_inexistente>` | `{ descripcion: "Test" }` | 404 |
| ST7 | Eliminar estado con eventos | DELETE | `/api/v1/estados/<id_con_eventos>` | — | Error FK |
| ST8 | DELETE estado sin eventos | DELETE | `/api/v1/estados/<id_sin_eventos>` | — | 200 |
| ST9 | PATCH body vacío | PATCH | `/api/v1/estados/<id_existente>` | `{}` | 200 |
| ST10 | POST descripción vacía | POST | `/api/v1/estados` | `{ descripcion: "" }` | 400 |

---

## Usuarios

| # | Test | Método | URL | Body / Params | Expected |
|---|---|---|---|---|---|
| U1 | Listar usuarios | GET | `/api/v1/usuarios` | — | 200 |
| U2 | Crear usuario ok | POST | `/api/v1/usuarios` | `{ nombreUsuario: "Admin2", rol: "admin" }` | 201 |
| U3 | Crear usuario rol inválido | POST | `/api/v1/usuarios` | `{ nombreUsuario: "Test", rol: "superadmin" }` | 400 + error rol debe ser `admin` |
| U4 | Crear usuario sin nombre | POST | `/api/v1/usuarios` | `{ rol: "admin" }` | 400 |
| U5 | Get usuario ID inexistente | GET | `/api/v1/usuarios/<uuid_inexistente>` | — | 404 |
| U6 | Actualizar usuario ok | PATCH | `/api/v1/usuarios/<id_existente>` | `{ nombreUsuario: "Modificado" }` | 200 |
| U7 | Actualizar usuario ID inexistente | PATCH | `/api/v1/usuarios/<uuid_inexistente>` | `{ nombreUsuario: "Test" }` | 404 |
| U8 | DELETE usuario ok | DELETE | `/api/v1/usuarios/<id_existente>` | — | 200 |
| U9 | PATCH body vacío | PATCH | `/api/v1/usuarios/<id_existente>` | `{}` | 200 |
| U10 | POST rol vacío | POST | `/api/v1/usuarios` | `{ nombreUsuario: "Test", rol: "" }` | 400 |
| U11 | PATCH rol inválido | PATCH | `/api/v1/usuarios/<id_existente>` | `{ rol: "superadmin" }` | 400 |

---

## Presupuestos

| # | Test | Método | URL | Body / Params | Expected |
|---|---|---|---|---|---|
| PR1 | Listar presupuestos | GET | `/api/v1/presupuestos` | — | 200 |
| PR2 | Filtrar por estado | GET | `/api/v1/presupuestos?estadoPresupuesto=true` | — | 200 + solo aprobados |
| PR3 | Crear presupuesto ok (mínimo) | POST | `/api/v1/presupuestos` | `{ estadoPresupuesto: true, total: 10000, catering: true, audiovisuales: false, otros: false }` | 201 + `precioUbicacion` = 0, `precioCatering` = 0, etc. (defaults) |
| PR4 | Crear presupuesto completo | POST | `/api/v1/presupuestos` | `{ estadoPresupuesto: true, total: 15000, precioUbicacion: 5000, catering: true, precioCatering: 3000, audiovisuales: true, precioAudiovisuales: 2000, otros: false, precioOtros: 0, notaUbicacion: "Palacio", observaciones: "Ok" }` | 201 |
| PR5 | Crear presupuesto sin `total` | POST | `/api/v1/presupuestos` | `{ estadoPresupuesto: true, catering: true, audiovisuales: false, otros: false }` | 400 + error `total` |
| PR6 | Crear presupuesto `total` negativo | POST | `/api/v1/presupuestos` | `{ estadoPresupuesto: true, total: -100, catering: true, audiovisuales: false, otros: false }` | 400 + error `min: 0` |
| PR7 | Crear `estadoPresupuesto` como string | POST | `/api/v1/presupuestos` | `{ estadoPresupuesto: "si", total: 1000, catering: true, audiovisuales: false, otros: false }` | 400 + error `isBoolean` |
| PR8 | Get presupuesto ID inexistente | GET | `/api/v1/presupuestos/<uuid_inexistente>` | — | 404 |
| PR9 | Actualizar presupuesto ok | PATCH | `/api/v1/presupuestos/<id_existente>` | `{ total: 20000, catering: false }` | 200 |
| PR10 | Actualizar presupuesto ID inexistente | PATCH | `/api/v1/presupuestos/<uuid_inexistente>` | `{ total: 100 }` | 404 |
| PR11 | Eliminar presupuesto con evento asociado | DELETE | `/api/v1/presupuestos/<id_con_evento>` | — | Error FK |
| PR12 | Crear total = 0 | POST | `/api/v1/presupuestos` | `{ estadoPresupuesto: true, total: 0, catering: true, audiovisuales: false, otros: false }` | 201 (min: 0, edge case) |
| PR13 | Crear fecha inválida | POST | `/api/v1/presupuestos` | `{ ..., fecha: "invalida" }` | 400 |
| PR14 | PATCH body vacío | PATCH | `/api/v1/presupuestos/<id_existente>` | `{}` | 200 |
| PR15 | DELETE presupuesto sin evento | DELETE | `/api/v1/presupuestos/<id_sin_evento>` | — | 200 |
| PR16 | Crear precioUbicacion negativo | POST | `/api/v1/presupuestos` | `{ ..., precioUbicacion: -100 }` | 400 |

---

**Total: ~125 casos de prueba**
