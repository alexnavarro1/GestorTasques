const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { validationResult } = require('express-validator');

// Registrar un nou usuari
exports.register = async (req, res) => {
    // 1. Validar errors d'entrada (express-validator)
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

        // 3. Crear l'usuari (la contrasenya s'encripta automàticament al model User.js)
        const user = await User.create({
            name,
            email,
            password
        });

        // 4. Generar el tokenJWT
        const token = generateToken(user._id, user.email, user.role);

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
                    role: user.role,
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
    // 1. Validar entrades
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // 2. Validar manualment que hi hagi email i password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Si us plau, facilita un email i una contrasenya'
            });
        }

        // 3. Buscar usuari per email (incloent la contrasenya per poder comparar-la)
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Credencials incorrectes' // Missatge exacte demanat
            });
        }

        // 4. Comprovar si la contrasenya coincideix
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Credencials incorrectes' // Missatge exacte demanat
            });
        }

        // 5. Generar token JWT
        const token = generateToken(user._id, user.email, user.role);

        res.status(200).json({
            success: true,
            message: "Sessió iniciada correctament",
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
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
        // L'usuari ja està disponible a req.user gràcies al middleware 'protect'
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
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
        // Verificar duplicitat d'email si l'usuari intenta canviar-lo
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
        // Cal obtenir l'usuari amb la contrasenya actual per poder comparar-la
        const user = await User.findById(req.user.id).select('+password');

        // Verificar que la contrasenya actual és correcta
        if (!(await user.comparePassword(req.body.currentPassword))) {
            return res.status(401).json({
                success: false,
                error: 'La contrasenya actual és incorrecta'
            });
        }

        // Assignar la nova contrasenya
        user.password = req.body.newPassword;
        await user.save(); // Això activarà el xifrat automàtic al model (pre-save hook)

        res.status(200).json({
            success: true,
            message: "Contrasenya actualitzada correctament"
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Error del servidor' });
    }
};
