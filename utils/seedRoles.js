const Role = require('../models/Role');
const Permission = require('../models/Permission');

const seedRoles = async () => {
    try {
        // Obtenir tots els permisos un cop
        const allPermissions = await Permission.find();
        const getPermId = (name) => {
            const p = allPermissions.find(px => px.name === name);
            return p ? p._id : null;
        };

        const roles = [
            {
                name: 'admin',
                description: 'Administrador del sistema',
                permissions: allPermissions.map(p => p._id), // Tots
                isSystemRole: true
            },
            {
                name: 'user',
                description: 'Usuari estàndard',
                permissions: [
                    getPermId('tasks:create'),
                    getPermId('tasks:read'),
                    getPermId('tasks:update'),
                    getPermId('tasks:delete')
                ].filter(id => id), // Filtrar nuls
                isSystemRole: true
            },
            {
                name: 'viewer',
                description: 'Visualitzador',
                permissions: [
                    getPermId('tasks:read')
                ].filter(id => id),
                isSystemRole: false
            },
            {
                name: 'editor',
                description: 'Editor',
                permissions: [
                    getPermId('tasks:create'),
                    getPermId('tasks:read'),
                    getPermId('tasks:update'),
                    getPermId('tasks:delete')
                ].filter(id => id),
                isSystemRole: false
            }
        ];

        for (const r of roles) {
            const exists = await Role.findOne({ name: r.name });
            if (!exists) {
                await Role.create(r);
                console.log(`Rol creat: ${r.name}`);
            } else {
                 // actualitzar permisos de rols del sistema si cal? Potser saltar per evitar sobreescriure canvis personalitzats
            }
        }
    } catch (error) {
        console.error('Error seeding roles:', error);
    }
};

module.exports = seedRoles;
