const User = require('../models/User');
const Task = require('../models/Task');

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
            .populate('user', 'name email role') // Incloure info de l'usuari
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

        const newRole = req.body.role;
        if (!['user', 'admin'].includes(newRole)) {
             return res.status(400).json({
                 success: false,
                 error: 'Rol invàlid'
             });
        }

        user.role = newRole;
        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Error del servidor' });
    }
};
