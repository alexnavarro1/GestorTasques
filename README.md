# Gestor de Tasques - API RESTful

Aquesta és una API RESTful completa per a la gestió de tasques, desenvolupada amb Node.js, Express i MongoDB. El projecte inclou autenticació segura, gestió de rols d'usuari i càrrega d'imatges.

## 🚀 Tecnologies Utilitzades

- **Node.js**: Entorn d'execució de JavaScript.
- **Express**: Framework web per a Node.js.
- **MongoDB**: Base de dades NoSQL (Mongoose com a ODM).
- **JWT (JSON Web Tokens)**: Per a l'autenticació segura.
- **Bcrypt**: Per al xifrat de contrasenyes.
- **Multer / Cloudinary**: Per a la gestió i pujada d'imatges.
- **Express Validator**: Per a la validació de dades d'entrada.

## 🛠️ Instal·lació i Configuració

1. **Clonar el repositori**

   ```bash
   git clone https://github.com/alexnavarro1/GestorTascques.git
   cd GestorTascques
   ```

2. **Instal·lar dependències**

   ```bash
   npm install
   ```

3. **Configurar variables d'entorn**
   Crea un fitxer `.env` a l'arrel del projecte basat en:

   ```env
   PORT=3000
   MONGO_URI=la_teva_uri_de_mongodb
   JWT_SECRET=el_teu_secret_jwt
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   ```

4. **Executar el servidor**
   - Mode desenvolupament:
     ```bash
     npm run dev
     ```
   - Mode producció:
     ```bash
     npm start
     ```

## 📚 Documentació de l'API

### Autenticació (`/api/auth`)

- `POST /register`: Registrar un nou usuari.
- `POST /login`: Iniciar sessió i obtenir token.
- `GET /me`: Obtenir dades del perfil (requereix token).
- `PUT /profile`: Actualitzar perfil.
- `PUT /change-password`: Canviar contrasenya.

### Tasques (`/api/tasks`)

- `GET /`: Llistar les tasques de l'usuari.
- `POST /`: Crear una nova tasca.
- `GET /stats`: Obtenir estadístiques de tasques.

### Administració (`/api/admin`)

- `GET /users`: Llistar tots els usuaris (Admin).
- `GET /tasks`: Llistar totes les tasques del sistema (Admin).

### Càrrega d'arxius (`/api/upload`)

- `POST /`: Pujar una imatge.

## 👤 Autor

**Àlex Navarro Martínez**
