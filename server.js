require('dotenv').config(); // Cargar variables d'entorn
const express = require('express'); // Framework Express
const bodyParser = require('body-parser'); // Middleware per processar el cos de les peticions
const cors = require('cors'); // Middleware per permetre CORS
const connectDB = require('./config/db'); // Funció per connectar a la base de dades

// Connectar a la base de dades MongoDB
connectDB();

// Inicialitzar l'aplicació Express
const app = express();

// Middleware de configuració
app.use(cors());  // Permet peticions d'origen creuat (CORS)
app.use(bodyParser.json());  // Processa dades JSON
app.use(bodyParser.urlencoded({ extended: true }));  // Processa formularis

// Middleware per servir imatges estàtiques
const path = require('path');
app.use('/images', express.static(path.join(__dirname, 'uploads')));

// També servim /uploads directament per si es demana la ruta física
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware d'auditoria (registra activitat en acabar la petició)
app.use(require('./middleware/auditMiddleware'));

// Rutes de l'API - Gestió de registres principals
app.use('/api/tasks', require('./routes/taskRoutes')); // Rutes dels registres
app.use('/api/auth', require('./routes/authRoutes'));   // Rutes d'autenticació
app.use('/api/admin/roles', require('./routes/roleRoutes')); // Rutes de rols
app.use('/api/admin/permissions', require('./routes/permissionRoutes')); // Rutes de permisos
app.use('/api/admin/audit-logs', require('./routes/auditRoutes')); // Rutes d'auditoria
app.use('/api/admin', require('./routes/adminRoutes')); // Rutes d'administració (users)
app.use('/api/upload', require('./routes/uploadRoutes')); // Rutes de pujada d'imatges

// Seeds
const seedPermissions = require('./utils/seedPermissions');
const seedRoles = require('./utils/seedRoles');
seedPermissions().then(() => seedRoles());

// Ruta principal de prova
app.get('/', (req, res) => {
    res.send({
        message: 'Benvingut a l\'API del Gestor de Tasques',
        description: 'Aquesta API RESTful permet gestionar tasques, usuaris i pujada d\'imatges. Utilitza autenticació JWT.',
        version: '1.0.0',
        author: 'Àlex Navarro',
        documentation: {
            auth: {
                info: 'Gestió d\'usuaris i sessions',
                endpoints: {
                    'POST /api/auth/register': 'Registrar un nou usuari',
                    'POST /api/auth/login': 'Iniciar sessió per obtenir el token',
                    'GET /api/auth/me': 'Obtenir dades de l\'usuari autenticat',
                    'PUT /api/auth/profile': 'Actualitzar informació del perfil',
                    'PUT /api/auth/change-password': 'Canviar la contrasenya'
                }
            },
            tasks: {
                info: 'Operacions CRUD sobre les tasques (Requereix Header: Authorization: Bearer <token>)',
                endpoints: {
                    'GET /api/tasks': 'Llistar les teves tasques',
                    'POST /api/tasks': 'Crear una nova tasca',
                    'GET /api/tasks/:id': 'Obtenir detalls d\'una tasca',
                    'PUT /api/tasks/:id': 'Modificar una tasca',
                    'DELETE /api/tasks/:id': 'Eliminar una tasca',
                    'GET /api/tasks/stats': 'Veure estadístiques de rendiment',
                    'PUT /api/tasks/:id/image': 'Actualitzar la imatge d\'una tasca',
                    'PUT /api/tasks/:id/image/reset': 'Esborrar la imatge d\'una tasca'
                }
            },
            upload: {
                info: 'Pujada d\'arxius (Imatges)',
                endpoints: {
                    'POST /api/upload/local': 'Pujar imatge al servidor',
                    'POST /api/upload/cloud': 'Pujar imatge a Cloudinary'
                }
            },
            admin: {
                info: 'Zona d\'administració (Només rol Admin)',
                endpoints: {
                    'GET /api/admin/users': 'Veure tots els usuaris',
                    'GET /api/admin/tasks': 'Veure totes les tasques globals',
                    'DELETE /api/admin/users/:id': 'Eliminar un usuari',
                    'PUT /api/admin/users/:id/role': 'Modificar rol d\'usuari'
                }
            }
        }
    });
});

// Middleware de gestió d'errors (ha d'anar al final)
app.use(require('./middleware/error'));

// Inicialitzar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor en funcionament a http://localhost:${PORT}`);
});