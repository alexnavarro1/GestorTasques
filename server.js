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

// Rutes de l'API - Gestió de tasques
// Rutes de l'API
app.use('/api/tasks', require('./routes/taskRoutes')); // Rutes de tasques
app.use('/api/auth', require('./routes/authRoutes'));   // Rutes d'autenticació
app.use('/api/admin', require('./routes/adminRoutes')); // Rutes d'administració
app.use('/api/upload', require('./routes/uploadRoutes')); // Rutes de pujada d'imatges

// Ruta principal de prova
app.get('/', (req, res) => {
    res.send({
        message: 'API Gestor de Tasques en funcionament!',
        version: '1.0.0',
        endpoints: {
            'Auth': {
                'POST /api/auth/register': 'Registrar usuari',
                'POST /api/auth/login': 'Iniciar sessió',
                'GET /api/auth/me': 'Perfil d\'usuari',
                'PUT /api/auth/profile': 'Actualitzar perfil',
                'PUT /api/auth/change-password': 'Canviar contrasenya'
            },
            'Tasks': {
                'GET /api/tasks': 'Llistar tasques (proves)',
                'POST /api/tasks': 'Crear tasca',
                'GET /api/tasks/stats': 'Estadístiques'
            },
            'Admin': {
                'GET /api/admin/users': 'Llistar usuaris',
                'GET /api/admin/tasks': 'Llistar totes les tasques'
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