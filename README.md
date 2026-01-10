# Gestor de Tasques (Backend)

Una API completa per gestionar tasques i usuaris amb autenticació segura.

## 🛠️ Tecnologies

- **Node.js** i **Express**
- **MongoDB** (amb Mongoose)
- **JWT** (JSON Web Tokens) per a l'autenticació
- **Cloudinary** / **Multer** per a la gestió d'imatges

## 🚀 Instal·lació i Configuració

1. Clona el repositori:

   ```bash
   git clone https://github.com/alexnavarro1/GestorTascques.git
   ```

2. Instal·la les dependències:

   ```bash
   npm install
   ```

3. Configura les variables d'entorn:
   Crea un fitxer `.env` a l'arrel i afegeix:

   ```env
   PORT=3000
   MONGO_URL=la_teva_mongo_uri
   JWT_SECRET=el_teu_secret
   JWT_EXPIRES_IN=30d
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   ```

4. Inicia el servidor:
   ```bash
   npm run dev
   ```

## 📊 Llistat Complet de Rutes

### 🔐 Rutes d'Autenticació (`/api/auth`)

| Mètode   | Ruta                        | Descripció            | Auth | Rol |
| :------- | :-------------------------- | :-------------------- | :--- | :-- |
| **POST** | `/api/auth/register`        | Registrar nou usuari  | No   | -   |
| **POST** | `/api/auth/login`           | Iniciar sessió        | No   | -   |
| **GET**  | `/api/auth/me`              | Obtenir perfil actual | Si   | -   |
| **PUT**  | `/api/auth/profile`         | Actualitzar perfil    | Si   | -   |
| **PUT**  | `/api/auth/change-password` | Canviar contrasenya   | Si   | -   |

### 🎯 Rutes de Tasques (`/api/tasks`)

_Totes les rutes de tasques estan protegides._

| Mètode     | Ruta                         | Descripció                   | Auth | Rol |
| :--------- | :--------------------------- | :--------------------------- | :--- | :-- |
| **GET**    | `/api/tasks/stats`           | Estadístiques de l'usuari    | Si   | -   |
| **POST**   | `/api/tasks`                 | Crear tasca                  | Si   | -   |
| **GET**    | `/api/tasks`                 | Obtenir tasques de l'usuari  | Si   | -   |
| **GET**    | `/api/tasks/:id`             | Obtenir tasca per ID         | Si   | -   |
| **PUT**    | `/api/tasks/:id`             | Actualitzar tasca            | Si   | -   |
| **DELETE** | `/api/tasks/:id`             | Eliminar tasca               | Si   | -   |
| **PUT**    | `/api/tasks/:id/image`       | Actualitzar imatge           | Si   | -   |
| **PUT**    | `/api/tasks/:id/image/reset` | Restablir imatge per defecte | Si   | -   |

### 📤 Rutes d'Upload (`/api/upload`)

| Mètode   | Ruta                | Descripció             | Auth | Rol |
| :------- | :------------------ | :--------------------- | :--- | :-- |
| **POST** | `/api/upload/local` | Pujar imatge localment | Si   | -   |
| **POST** | `/api/upload/cloud` | Pujar imatge a cloud   | Si   | -   |

### 👑 Rutes d'Administració (`/api/admin`)

_Només accessibles per usuaris amb rol 'admin'._

| Mètode     | Ruta                        | Descripció                | Auth | Rol   |
| :--------- | :-------------------------- | :------------------------ | :--- | :---- |
| **GET**    | `/api/admin/users`          | Obtenir tots els usuaris  | Si   | admin |
| **GET**    | `/api/admin/tasks`          | Obtenir totes les tasques | Si   | admin |
| **DELETE** | `/api/admin/users/:id`      | Eliminar usuari           | Si   | admin |
| **PUT**    | `/api/admin/users/:id/role` | Canviar rol d'usuari      | Si   | admin |

---

Creat per **Àlex Navarro**.
