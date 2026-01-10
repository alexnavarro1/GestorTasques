const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Esquema de l'usuari amb mongoose
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true // Elimina espais al principi i al final
    },
    email: {
        type: String,
        required: [true, 'Si us plau, afegeix un correu electrònic'],
        unique: true, // L'email ha de ser únic
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Si us plau, afegeix un correu electrònic vàlid'
        ]
    },
    password: {
        type: String,
        required: [true, 'Si us plau, afegeix una contrasenya'],
        minlength: [6, 'La contrasenya ha de tenir com a mínim 6 caràcters'],
        select: false // Per defecte, no retornar la contrasenya en les consultes
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Valors permesos
        default: 'user' // Valor per defecte
    },
    createdAt: {
        type: Date,
        default: Date.now // Data de creació automàtica
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // Afegeix automàticament createdAt i updatedAt
});

// Encriptar la contrasenya utilitzant bcrypt
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Mètode per comparar contrasenyes
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Eliminar password quan es retorna l'objecte JSON (encara que select: false ja ajuda)
userSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

module.exports = mongoose.model('User', userSchema);
