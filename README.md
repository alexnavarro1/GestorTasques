# Gestor de Tasques (Backend)

Una API senzilla per gestionar tasques i usuaris amb autenticació.

## Tecnologies

- Node.js i Express
- MongoDB (Mongoose)
- JWT per a l'autenticació

## Com fer-ho funcionar

1. Clona el repositori.
2. Instal·la les llibreries amb:
   ```bash
   npm install
   ```
3. Crea un fitxer `.env` i posa les teves dades (MongoDB URI, JWT Secret, Cloudinary).
4. Engega el servidor:
   ```bash
   npm run dev
   ```

## Endpoints Principals

- **Auth**: `/api/auth` (Registre, Login, Perfil)
- **Tasques**: `/api/tasks` (CRUD de tasques)
- **Admin**: `/api/admin` (Gestió d'usuaris)

Fet per Àlex Navarro.
