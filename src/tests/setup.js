const mongoose = require('mongoose');

// Configurar variables de entorno para pruebas
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.MONGODB_TEST_URI = 'mongodb://localhost:27017/task-manager-test';

// Configuración de timeout para las pruebas
jest.setTimeout(10000);

// Conectar a la base de datos de prueba
beforeAll(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_TEST_URI);
  } catch (error) {
    console.error('Error connecting to test database:', error);
    process.exit(1);
  }
});

// Limpiar la base de datos después de cada prueba
afterEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// Cerrar la conexión a la base de datos después de todas las pruebas
afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
});
