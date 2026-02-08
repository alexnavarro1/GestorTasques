const User = require('../models/User'); // Model d'Usuari
const Task = require('../models/Task'); // Model de Tasca
const Role = require('../models/Role'); // Model de Rol

// Obtenir tots els usuaris
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Error obtingut usuaris' });
    }
};

// Obtenir totes les tasques (amb dades d'usuari)
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate('user', 'name email role') // Incloure informació de l'usuari (nom, email, rol)
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Error obtingut tasques' });
    }
};

// Eliminar usuari
exports.deleteUser = async (req, res) => {
    try {
        // No permetre eliminar-se un mateix
        if (req.params.id === req.user.id) {
             return res.status(400).json({
                 success: false,
                 error: 'No pots eliminar el teu pròpi compte'
             });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'Usuari no trobat'
            });
        }

        // Eliminar tasques associades primer
        await Task.deleteMany({ user: user._id });
        
        // Eliminar l'usuari
        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Usuari i dades eliminades correctament'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Error del servidor' });
    }
};

// Canviar rol d'usuari
// Canviar rol d'usuari (Suport per a versions anteriors: substitueix els rols actuals pel rol especificat)
exports.changeUserRole = async (req, res) => {
    try {
        if (req.params.id === req.user.id) {
             return res.status(400).json({
                 success: false,
                 error: 'No pots canviar el teu propi rol'
             });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'Usuari no trobat'
            });
        }

        const newRoleName = req.body.role;
        // Validació per nom de rol (compatibilitat amb versions anteriors on s'enviava 'admin' o 'user')
        // Ara buscarem el rol per nom.
        
        const role = await Role.findOne({ name: newRoleName });
        if (!role) {
             return res.status(400).json({
                 success: false,
                 error: 'Rol invàlid o no trobat'
             });
        }

        // Substituir array de rols
        user.roles = [role._id];
        await user.save();

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Error del servidor' });
    }
};

// Assignar rol a un usuari
exports.assignRoleToUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { roleId } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, error: 'Usuari no trobat' });

        const role = await Role.findById(roleId);
        if (!role) return res.status(404).json({ success: false, error: 'El rol no existeix' });

        await user.addRole(roleId);
        
        // Poblar els rols i permisos per retornar la resposta completa
        await user.populate({
            path: 'roles',
            populate: { path: 'permissions' }
        });

        res.status(200).json({
            success: true,
            message: 'Rol assignat correctament',
            data: {
                userId: user._id,
                roles: user.roles
            }
        });
    } catch (err) {
        console.error(err);
        if (err.name === 'CastError') {
             // Si l'ID no té el format correcte (és invàlid), considerem que no existeix
             // Detall: diferenciem si és roleId o userId si volem ser precisos, però 404 genèric funciona
             return res.status(404).json({ success: false, error: 'El rol no existeix' });
        }
        res.status(500).json({ success: false, error: 'Error del servidor' });
    }
};

// Eliminar rol d'un usuari
exports.removeRoleFromUser = async (req, res) => {
    try {
        const { userId, roleId } = req.params;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, error: 'Usuari no trobat' });

        // No permetre que un usuari quedi sense rol?
        // Comprovar si eliminar aquest rol deixa l'usuari amb 0 rols
        const roleIndex = user.roles.findIndex(r => r.toString() === roleId);
        if (roleIndex === -1) return res.status(404).json({ success: false, error: 'L\'usuari no té aquest rol' });

        if (user.roles.length === 1) {
             return res.status(400).json({ success: false, error: 'No es pot deixar un usuari sense cap rol' });
        }

        await user.removeRole(roleId);

        res.status(200).json({
            success: true,
            message: 'Rol eliminat correctament'
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Error del servidor' });
    }
};

// Obtenir tots els permisos efectius d'un usuari
exports.getUserPermissions = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, error: 'Usuari no trobat' });

        const permissions = await user.getEffectivePermissions();

        res.status(200).json({
            success: true,
            data: permissions
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Error del servidor' });
    }
};
