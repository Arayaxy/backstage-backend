# Backend del proyecto de tripulaciones

## Estructura de archivos

Se usa una estructura Model-View-Controller (MVC) para el proyecto como la del siguiente ejemplo:
```
proyecto/
├── config/             # Variables de entorno, conexión de la base de datos
├── controllers/        # Lógica de peticiones
│   ├── auth.controller.js
│   └── user.controller.js
├── middlewares/        # Middlewares propios
├── models/             # Esquema de la base de datos y lógica de datos
│   ├── User.js
│   └── Product.js
├── routes/             # Definiciones de los endpoints
│   ├── auth.route.js
│   └── user.route.js
├── validations/        # Validaciones de campos
│   ├── auth.validation.js
│   └── user.validation.js
├── app.js              # Punto de entrada principal
└── package.json
```

## Estructura de respuesta

// Éxito
```
{
  "ok": true,
  "data": { ... },  // datos en sí
  "meta": { ... }   // datos adicionales como elementos totales, paginado
}
```

// Error único
```
{
  "ok": false,
  "message": "Credenciales inválidas"
}
```

// Varios errores (ejemplo validaciones de campos)
```
{
  "ok": false,
  "message": "Falló la validación",
  "details": [
    {
      "path": "email",
      "type": "field",
      "title": "Atributo inválido",
      "detail": "El correo debe tener..."
    },
    {
      "path": "password",
      "type": "field",
      "title": "Atributo inválido",
      "detail": "La contraseña debe tener..."
    }
  ]
}
```

## Dependencias

- express: Servidor Web.
- express-validator: Validaciones de campos obtenidos en peticiones.
- dotenv: Adquisición de variables de entorno de .env en procees.env
- cors: Configuración de orígenes curzados permitidos

## Instalación

```console
pnpm install
```

## Variables de entorno

Para desarrollo local:

- Copiar .env.example a .env.
- Ajustar:
```
PORT=3000
API_URL_BASE=/api/v1
CORS_ORIGINS=http://localhost:5173
```

Para despliegue:

- Ajustar en la plataforma utilizada:
```
API_URL_BASE=/api/v1
CORS_ORIGINS=(URL del frontend en despliegue)
```

## Ejecución

- Producción:
```console
pnpm start
```
- Desarrollo:
```console
pnpm dev
```
