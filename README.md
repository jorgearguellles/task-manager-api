# Task Manager API

API RESTful para la gestión de tareas con autenticación y autorización, implementando buenas prácticas de desarrollo y patrones de diseño.

## 🚀 Características

- Autenticación JWT
- Gestión de tareas (CRUD)
- Validación de datos
- Paginación y filtrado
- Manejo de errores centralizado
- Documentación con Swagger
- Tests unitarios e integración

## 🛠 Tecnologías

- **Node.js**: Runtime de JavaScript
- **Express**: Framework web
- **MongoDB**: Base de datos NoSQL
- **Mongoose**: ODM para MongoDB
- **JWT**: Autenticación
- **Jest**: Testing
- **Swagger**: Documentación de API
- **ESLint**: Linting
- **Prettier**: Formateo de código

## 📦 Patrones de Diseño Implementados

### 1. Arquitectura en Capas

- **Controllers**: Manejo de peticiones HTTP
- **Services**: Lógica de negocio
- **Repositories**: Acceso a datos
- **Models**: Esquemas de datos
- **Routes**: Definición de endpoints
- **Middleware**: Funciones intermedias
- **Validators**: Validación de datos
- **Utils**: Funciones de utilidad

### 2. Patrones de Diseño

- **Repository Pattern**: Abstracción del acceso a datos
- **Service Layer Pattern**: Separación de lógica de negocio
- **Middleware Pattern**: Procesamiento de peticiones
- **Factory Pattern**: Creación de objetos
- **Singleton Pattern**: Conexión a base de datos
- **Strategy Pattern**: Validación de datos
- **Chain of Responsibility**: Middleware de autenticación

### 3. Principios SOLID

- **Single Responsibility**: Cada clase tiene una única responsabilidad
- **Open/Closed**: Extensible sin modificar código existente
- **Liskov Substitution**: Subtipos son sustituibles
- **Interface Segregation**: Interfaces específicas
- **Dependency Inversion**: Dependencias a través de abstracciones

## 🏗 Estructura del Proyecto

```
src/
├── config/         # Configuraciones
├── controllers/    # Controladores
├── middleware/     # Middleware
├── models/         # Modelos
├── repositories/   # Repositorios
├── routes/         # Rutas
├── services/       # Servicios
├── tests/          # Tests
├── utils/          # Utilidades
└── validators/     # Validadores
```

## 🔒 Seguridad

- Autenticación JWT
- Validación de datos
- Sanitización de inputs
- Manejo de errores
- Rate limiting
- Headers de seguridad

## 🧪 Testing

- Tests unitarios con Jest
- Tests de integración
- Mocks y stubs
- Cobertura de código
- Tests de autenticación
- Tests de validación

## 📚 Documentación

- Swagger/OpenAPI
- JSDoc
- README detallado
- Comentarios en código
- Guías de uso

## 🚀 Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/tu-usuario/task-manager-api.git
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno:

```bash
cp .env.example .env
```

4. Iniciar el servidor:

```bash
npm run dev
```

## 📝 Uso

La API estará disponible en `http://localhost:3000`

Documentación Swagger: `http://localhost:3000/api-docs`

### Endpoints Principales

#### Autenticación

- POST `/api/auth/register` - Registro de usuario
- POST `/api/auth/login` - Inicio de sesión
- POST `/api/auth/logout` - Cierre de sesión

#### Tareas

- GET `/api/tasks` - Listar tareas
- POST `/api/tasks` - Crear tarea
- GET `/api/tasks/:id` - Obtener tarea
- PUT `/api/tasks/:id` - Actualizar tarea
- DELETE `/api/tasks/:id` - Eliminar tarea
- PATCH `/api/tasks/:id/status` - Actualizar estado

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## 👨‍💻 Autor

Jorge Arias - [jorgeariasarguelles@gmail.com](mailto:jorgeariasarguelles@gmail.com)

## 🙏 Agradecimientos

- Platzi
- Node.js Community
- MongoDB Community
- Express.js Team
