const Permission = require('../models/Permission');

const permissions = [
    { name: 'tasks:create', description: 'Crear tasques', category: 'tasks', isSystemPermission: true },
    { name: 'tasks:read', description: 'Veure tasques', category: 'tasks', isSystemPermission: true },
    { name: 'tasks:update', description: 'Editar tasques', category: 'tasks', isSystemPermission: true },
    { name: 'tasks:delete', description: 'Eliminar tasques', category: 'tasks', isSystemPermission: true },
    { name: 'users:manage', description: 'Gestionar usuaris', category: 'users', isSystemPermission: true },
    { name: 'users:read', description: 'Veure usuaris', category: 'users', isSystemPermission: true },
    { name: 'roles:manage', description: 'Gestionar rols', category: 'roles', isSystemPermission: true },
    { name: 'roles:read', description: 'Veure rols', category: 'roles', isSystemPermission: true },
    { name: 'permissions:manage', description: 'Gestionar permisos', category: 'permissions', isSystemPermission: true },
    { name: 'permissions:read', description: 'Veure permisos', category: 'permissions', isSystemPermission: true },
    { name: 'audit:read', description: 'Veure auditoria', category: 'audit', isSystemPermission: true },
    { name: 'reports:view', description: 'Veure informes', category: 'reports', isSystemPermission: true }

];

const seedPermissions = async () => {
    try {
        for (const p of permissions) {
            const exists = await Permission.findOne({ name: p.name });
            if (!exists) {
                await Permission.create(p);
                console.log(`Permís creat: ${p.name}`);
            }
        }
    } catch (error) {
        console.error('Error seeding permissions:', error);
    }
};

module.exports = seedPermissions;
