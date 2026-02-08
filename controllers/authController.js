const User = require('../models/User'); // Model d'Usuari
const Role = require('../models/Role'); // Model de Rol
const Permission = require('../models/Permission'); // Model de Permís
const generateToken = require('../utils/generateToken'); // Utilitat per generar tokens JWT
const { validationResult } = require('express-validator'); // Llibreria per validació de dades

// Registrar un nou usuari
exports.register = async (req, res) => {
    // 1. Validació d'errors d'entrada (express-validator)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        // 2. Comprovar si l'usuari ja existeix a la base de dades
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                success: false,
                error: 'Aquest email ja està registrat' // Missatge exacte demanat
            });
        }

        // Cerca del rol 'user' per defecte per assignar-lo
        const userRole = await Role.findOne({ name: 'user' });
        let roles = [];
        if (userRole) {
            roles.push(userRole._id);
        } else {
             // Si no s'han executat els seeds, avisar i crear usuari sense rol
             console.warn("Role 'user' not found. Creating user without role.");
        }

        // 3. Creació de l'usuari (la contrasenya s'encripta automàticament al model)
        const user = await User.create({
            name,
            email,
            password,
            roles: roles
        });
        
        // Poblar rols per a la resposta
        await user.populate('roles');

        // 4. Generar el tokenJWT
        // Inclou el rol per defecte 'user' al token per compatibilitat
        const token = generateToken(user._id, user.email, 'user');

        // 5. Respondre amb èxit i retornar el token
        res.status(201).json({
            success: true,
            message: "Usuari registrat correctament",
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    roles: user.roles,
                    createdAt: user.createdAt
                }
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Error del servidor' });
    }
};

// Iniciar sessió (Login)
exports.login = async (req, res) => {
    // 1. Validació de les dades d'entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // 2. Comprovació manual de la presència de credencials
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Si us plau, facilita un email i una contrasenya'
            });
        }

        // 3. Cerca de l'usuari per email i càrrega de rols i permisos
        const user = await User.findOne({ email }).select('+password').populate({
            path: 'roles',
            populate: { path: 'permissions' }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Credencials incorrectes' // Missatge exacte demanat
            });
        }

        // 4. Verificació de la contrasenya
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Credencials incorrectes' // Missatge exacte demanat
            });
        }

        // 5. Generació del token JWT amb el rol principal
        const roleName = (user.roles && user.roles.length > 0) ? user.roles[0].name : 'user';
        const token = generateToken(user._id, user.email, roleName);

        res.status(200).json({
            success: true,
            message: "Sessió iniciada correctament",
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    roles: user.roles,
                    permissions: await user.getEffectivePermissions()
                }
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Error del servidor' });
    }
};

// Obtenir l'usuari actual (Me)
exports.getMe = async (req, res) => {
    try {
        // L'usuari està disponible a req.user gràcies al middleware 'protect'
        // Es carreguen els rols i permisos complets si no estan disponibles
        const user = await User.findById(req.user.id).populate({
            path: 'roles',
            populate: { path: 'permissions' }
        });

        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                roles: user.roles,
                permissions: await user.getEffectivePermissions(),
                createdAt: user.createdAt
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Error del servidor' });
    }
};

// Actualitzar perfil de l'usuari
exports.updateProfile = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        // Verificació d'unicitat de l'email si es modifica
        if (req.body.email && req.body.email !== req.user.email) {
            const userExists = await User.findOne({ email: req.body.email });
            if (userExists) {
                return res.status(400).json({
                    success: false,
                    error: 'Aquest email ja està en ús'
                });
            }
        }

        const fieldsToUpdate = {
            name: req.body.name,
            email: req.body.email
        };

        const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
            new: true, // Retorna l'objecte actualitzat
            runValidators: true // Executa les validacions del model
        });

        res.status(200).json({
            success: true,
            data: user
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Error del servidor' });
    }
};

// Canviar contrasenya
exports.changePassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        // Obtenció de l'usuari amb la contrasenya per a la comparació
        const user = await User.findById(req.user.id).select('+password');

        // Verificació de la contrasenya actual
        if (!(await user.comparePassword(req.body.currentPassword))) {
            return res.status(401).json({
                success: false,
                error: 'La contrasenya actual és incorrecta'
            });
        }

        // Actualització a la nova contrasenya
        user.password = req.body.newPassword;
        await user.save(); // Dispara el xifrat automàtic al model

        res.status(200).json({
            success: true,
            message: "Contrasenya actualitzada correctament"
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Error del servidor' });
    }
};

// Verificar si l'usuari té un permís específic
exports.checkPermissionEndpoint = async (req, res) => {
    try {
        const { permission } = req.body;
        
        // Verificació de l'existència del permís a la base de dades
        const permExists = await Permission.findOne({ name: permission });
        if (!permExists) {
             return res.status(400).json({ success: false, error: 'El permís especificat no existeix' });
        }

        const hasPermission = await req.user.hasPermission(permission);

        if (hasPermission) {
            res.status(200).json({
                success: true,
                hasPermission: true,
                message: 'Tens permís per fer aquesta acció'
            });
        } else {
            res.status(403).json({
                success: false,
                hasPermission: false,
                message: 'No tens permís per fer aquesta acció'
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Error del servidor' });
    }
};
