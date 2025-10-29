# Proyecto aplicación web de E-commerce
Proyectos Alumnos IFCD0112 
Alumno Kevin Isaza

## Descripción del Proyecto
Este proyecto es una aplicación web de E-commerce desarrollada con JavaScrip, node, Express.js y en el fron-end html y css, que incluye funcionalidades de login de usuarios y un carrito de compras. El diseño de la interfaz de usuario es responsive, asegurando una experiencia óptima en diferentes dispositivos.

### Funcionalidades Principales
- **Login de Usuarios**: Página de login que permite a los usuarios autenticarse. Incluye métodos para la creación y actualización de usuarios, así como la gestión de roles de administrador.
- **Carrito de Compras**: Componente que permite a los usuarios añadir productos al carrito, verificar el stock, y realizar compras. Incluye alertas de stock, opciones para modificar la cantidad de productos y funcionalidades para limpiar el carrito.

### Diseño de Base de Datos
- Creación de tablas en SQL para gestionar usuarios, productos y logs de acciones.
- Implementación de tokens de autenticación y métodos para la gestión de contraseñas.

### Desarrollo Pendiente
- Implementación de una nueva interfaz para el carrito de compras.
- Verificación de stock y alertas de cantidad.
- Integración de métodos de pago y envío de confirmaciones por email.

Este proyecto busca ofrecer una solución completa para la gestión de un E-commerce, desde la autenticación de usuarios hasta la gestión de productos y compras.

## Login de usuarios Carrito de compras - $ E-commerce
## Ejemplo de diseño a seguir.
Una página de login responsive.
![database](/database/image.png)

### Diseño Web Carrito de Compras con Angular
Un componente extraíble a cada página de la web de carrito de compras responsive.
![database](/database/image-1.png)

### Diseño de Base de Datos
- Creación diseño de tablas en MySQL

### Completo:
- Método de login
- Un usuario puede actualizar su propio usuario pero no otro diferente.
- Lógica de creación de usuario admin en el registro, un usuario no debería poder crearse como admin. (eliminacion de rol)
- Crear un token autoken, a nivel de DB se debe eliminar 1 vez al día.
- `deletetoken()` trigger depuracion de token con limite de tiempo.
- `Tabladelogs()`, tabla de logs.
- Quién? Qué hizo? Detalle de acción CRUD. tabla en DB de UserLogs
- Únicamente los admin pueden crear o eliminar admins.
- Un usuario admin debe crear otro admin.
- Verificar y actualizar la contraseña.
- Crear método de "olvidé mi contraseña".
- Configurar nuevo email para restablecer la contraseña: infotoplistapps@gmail.com.
- Verificar qué funciones dentro del CRUD pueden convertirse en métodos de la DB.

- Crear botón de cerrar sesión dentro de la App web.
- Si se añade el mismo producto al carrito, este no debe crearse como un nuevo ítem sino sumarse al que ya existe.

### Pedientes de desarrollo
-# El carrito deberá ser una interfaz nueva.
- El carrito debe verificar que el producto tenga stock. (Creacion de middleware)
- Alerta de cantidad de stock, últimas unidades.
- Se debe poder disminuir la cantidad o eliminar el producto del carrito.
- Botón de comprar, enviar a direcciones.
- Test de librería de tarjeta de crédito para simular compra.
- Enviar email con la compra realizada.
- Enviar email recordando al usuario que tienes productos en tu carrito de compras.
- Botón de eliminar producto del carrito.
- Limpiar carrito completamente.
- Botón de comprar.

## Estructura del Proyecto

```
API_REST_CRUD_NODE_EXPRESS/
├── src/
│   ├── controllers/
│   │   ├── authController.js     # Controlador de autenticación y JWT
│   │   ├── userController.js     # CRUD de usuarios y gestión de roles admin
│   │   ├── productController.js  # Gestión de productos y Fake Store API
│   │   └── cartController.js     # Lógica del carrito de compras
│   ├── middleware/
│   │   ├── authMiddleware.js     # Verificación de tokens JWT
│   │   └── validation.js         # Validación de entrada de datos
│   ├── routes/
│   │   ├── authRoutes.js        # Rutas de login y registro
│   │   ├── userRoutes.js        # Rutas CRUD de usuarios
│   │   ├── productRoutes.js     # Rutas de productos
│   │   └── cartRoutes.js        # Rutas del carrito
│   └── config/
│       ├── database.js          # Configuración de conexión MySQL
│       └── emailConfig.js       # Configuración SMTP para emails
├── public/
│   └── html/
│       ├── index.html         # Página principal
│       ├── login.html         # Interfaz de login responsive
│       ├── register.html      # Página de registro
│       ├── products.html      # Catálogo de productos
│       └── cart.html          # Interfaz del carrito (pendiente)
├── app.js                     # Configuración principal del servidor Express
├── server.js                  # Punto de entrada de la aplicación
├── package.json              # Dependencias del proyecto Node.js
└── README.md                 # Documentación del proyecto
```

## Tecnologías Utilizadas

### Backend
- **Node.js**: Runtime de JavaScript para el servidor
- **Express.js**: Framework web para APIs REST
- **MySQL**: Base de datos relacional para usuarios, productos y logs
- **JWT (JSON Web Tokens)**: Autenticación segura de usuarios
- **bcrypt**: Encriptación de contraseñas de usuarios
- **nodemailer**: Servicio de envío de emails (infotoplistapps@gmail.com)
- **cors**: Manejo de políticas CORS

### Frontend
- **HTML5**: Estructura semántica responsive
- **CSS3**: Estilos modernos y diseño responsive
- **JavaScript (Vanilla)**: Lógica del lado del cliente
- **Fetch API**: Comunicación asíncrona con la API REST

### Base de Datos
- **MySQL**: Gestión de tablas (users, products, shopping_cart, logs)
- **SQL Triggers**: Limpieza automática de tokens (`deletetoken()`)
- **Stored Procedures**: Optimización de consultas CRUD

### APIs y Servicios Externos
- **Fake Store API**: Población automática de productos al iniciar servidor
- **SMTP Email Service**: Notificaciones y recuperación de contraseñas

## Características Técnicas Implementadas

### Sistema de Autenticación Completo
- Login con JWT y roles de usuario/administrador
- Registro con validación de roles (usuarios no pueden auto-asignarse admin)
- Sistema de tokens con expiración y limpieza automática
- Recuperación de contraseñas vía email
- Actualización segura de contraseñas

### Gestión Avanzada de Usuarios
- CRUD completo con restricciones de seguridad
- Usuarios solo pueden modificar su propio perfil
- Solo administradores pueden crear/eliminar otros administradores
- Sistema de logs detallado (UserLogs) con auditoría de acciones

### Funcionalidades del E-commerce
- Carrito persistente por usuario
- Sistema de notificaciones por email
- Recuperación de contraseñas
- Catálogo de productos desde Fake Store API
- Carrito de compras con persistencia por usuario

- Validación de stock y alertas de cantidadmi portafolio profesional, demostrando competencias en desarrollo full-stack con tecnologías modernas de JavaScript. La aplicación integra conceptos avanzados de seguridad, arquitectura de software y experiencia de usuario, reflejando mi capacidad para desarrollar soluciones web completas y escalables.
- Botones para añadir productos y gestionar cantidades
- Sistema de logout integrado 
Puedes contactarme a través de [mi perfil de GitHub](https://github.com/Kevinisaza14) o a traves de [Mi linkedin](https://www.linkedin.com/in/kevin-isaza-35a202275) para colaboraciones, sugerencias o propuestas laborales.
## Estado del Desarrollo
- Si la tabla `products` tiene datos, se eliminan y se crean nuevamente: [Fake Store API](https://fakestoreapi.com/products).
### ✅ Funcionalidades Completadasniciar la tabla de productos en la ejecución del servidor.
- Sistema completo de autenticación y autorización
- CRUD de usuarios con gestión de roles
- Integración con Fake Store API para productos
- Base de datos con triggers y logs
- Interfaz responsive de login

### 🚧 En Desarrollo
- Nueva interfaz del carrito de compras
- Middleware de verificación de stock
- Sistema de alertas de inventario
- Funcionalidades de modificación de cantidad en carrito
- Botón de limpieza completa del carrito

### 📋 Pendientes
- Integración de métodos de pago
- Sistema de direcciones de envío
- Pruebas de tarjeta de crédito
- Emails de confirmación de compra
- Recordatorios de carrito abandonado

## Sobre el Desarrollador

Este proyecto demuestra mis habilidades en desarrollo full-stack con el stack MEAN/MERN, implementando una arquitectura escalable y segura para aplicaciones de e-commerce. La aplicación integra patrones de diseño modernos, seguridad robusta y una experiencia de usuario optimizada, siendo una pieza clave de mi portafolio profesional.