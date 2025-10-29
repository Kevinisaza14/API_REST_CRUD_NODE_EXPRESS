# Proyectos
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

## Tecnologías y Estructura Básica del Proyecto
### Estructura del Proyecto ### Tecnologías Utilizadas
1. **Front-end**:
    - **HTML**: Estructura de las páginas web.
    - **CSS**: Estilos y diseño responsivo.
    - **JavaScript**: Interactividad y lógica del lado del cliente.

2. **Back-end**:
    - **Node.js**: Servidor y lógica del lado del servidor.
    - **Express.js**: Rutas y middleware para manejar solicitudes HTTP.

3. **Base de Datos**:
    - **MySQL**: Gestión de usuarios, productos y logs de acciones.

### Librerías Utilizadas
En el archivo `package.json` de tu proyecto, asegúrate de incluir las siguientes librerías necesarias para el desarrollo y funcionamiento de tu aplicación:

    ```json
    {
    "name": "ecommerce-app",
    "version": "1.0.0",
    "description": "Aplicación web de E-commerce",
    "main": "api.js",
    "scripts": {
        "start": "node index.js",
        "dev": "node --watch src/api.js"
    },
    "dependencies": {
        "express": "^4.17.1",
        "mysql2": "^2.2.5",
        "sequelize": "^6.6.5",
        "dotenv": "^10.0.0",
        "bcryptjs": "^2.4.3",
        "jsonwebtoken": "^8.5.1"
    },
    "devDependencies": {
        "nodemon": "^2.0.12"
    },
    "author": "Kevin Isaza",
    "license": "ISC"
    }
    ```
Estas librerías incluyen:
- **express**: Framework para aplicaciones web Node.js.
- **mysql2**: Cliente MySQL para Node.js.
- **sequelize**: ORM para Node.js que soporta MySQL.
- **dotenv**: Carga variables de entorno desde un archivo `.env`.
- **bcryptjs**: Biblioteca para hashing de contraseñas.
- **jsonwebtoken**: Implementación de JSON Web Tokens.
- **nodemon**: Herramienta para reiniciar automáticamente el servidor durante el desarrollo.

### Funcionalidades Clave
- **Autenticación de Usuarios**: Registro, login y gestión de roles.
- **Carrito de Compras**: Añadir productos, verificar stock y realizar compras.
- **Gestión de Productos**: CRUD de productos y actualización de stock.

### Desarrollo Futuro

- Mejoras en la interfaz del carrito de compras.
- Integración de métodos de pago.
- Envío de confirmaciones por email.

# Despliegue del Proyecto en un Servidor

Para desplegar tu proyecto en un servidor o en un servidor de pruebas como Render.com, sigue estos pasos:

### 1. Preparación del Proyecto
1. **Actualizar Configuraciones**:
    - Asegúrate de que todas las configuraciones de tu aplicación (como las variables de entorno) estén listas para un entorno de producción.
    - Crea un archivo `.env` en la raíz de tu proyecto con las siguientes variables:
        ```plaintext
        NODE_ENV=production
        PORT=your_port_number
        DATABASE_URL=your_database_url
        ```

2. **Instalar Dependencias**:
    - Asegúrate de que todas las dependencias estén instaladas y actualizadas:
        ```bash
        npm install
        ```

### 2. Configuración del Servidor
1. **Render.com**:
    - Crea una cuenta en [Render.com](https://render.com/).
    - Crea un nuevo servicio web y conecta tu repositorio de GitHub.
    - Configura las variables de entorno en Render.com usando las mismas variables que definiste en tu archivo `.env`.

2. **Configuración de la Base de Datos**:
    - Si estás utilizando MySQL, puedes optar por servicios como Amazon RDS, Heroku Postgres, o cualquier otro proveedor de bases de datos en la nube.
    - Asegúrate de actualizar la URL de la base de datos en tus variables de entorno `.env`.

### 3. Despliegue
1. **Deploy en Render.com**:
    - Render.com detectará automáticamente tu aplicación y comenzará el proceso de despliegue.
    - Verifica los logs para asegurarte de que no haya errores durante el despliegue.

### 4. Actualización del Código
1. **Actualizar Conexión a la Base de Datos**:
    - En tu archivo de configuración de la base de datos, asegúrate de que la conexión utilice la variable de entorno `DATABASE_URL`:
        ```javascript
        const { Sequelize } = require('sequelize');
        const sequelize = new Sequelize(process.env.DATABASE_URL, {
            dialect: 'mysql',
            protocol: 'mysql',
            logging: false,
        });
        ```

2. **Actualizar Configuración del Servidor**:
    - Asegúrate de que tu servidor escuche en el puerto definido en las variables de entorno codigo de `api.js` :
        ```javascript
        const express = require('express');
        const app = express();
        const port = process.env.PORT || 3000;

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
        ```

### 5. Verificación
1. **Pruebas**:
    - Realiza pruebas exhaustivas para asegurarte de que todas las funcionalidades estén operativas en el entorno de producción.
    - Verifica la conexión a la base de datos y la funcionalidad del servidor.

Siguiendo estos pasos, podrás desplegar tu proyecto en un servidor real o de pruebas, asegurando que tanto el servidor backend como la base de datos estén correctamente configurados y operativos.


# Control de Versiones
Para mantener un buen control de versiones de tu proyecto en GitHub, sigue estos pasos:

### 1. Inicialización del Repositorio
### 2. Configuración Inicial
### 3. Buenas Prácticas de Control de Versiones
1. **Commits Frecuentes y Descriptivos**
2. **Uso de Ramas**
3. **Revisiones de Código**
4. **Etiquetas y Versiones**:
    - Utiliza etiquetas para marcar versiones específicas de tu proyecto:
        ```bash
        git tag -a v1.0 -m "Versión 1.0"
        git push origin v1.0
        ```

### 4. Mantenimiento del Repositorio
1. **Sincronización con el Repositorio Remoto**
2. **Resolución de Conflictos**
3. **Documentación**:
    - Mantén una buena documentación de tu proyecto, incluyendo un archivo `README.md` con instrucciones claras sobre cómo configurar y ejecutar el proyecto.

Siguiendo estos pasos, podrás mantener un control de versiones eficiente y organizado para tu proyecto, facilitando la colaboración y el mantenimiento del código.