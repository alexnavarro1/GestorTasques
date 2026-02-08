const mongoose = require('mongoose'); // Llibreria Mongoose
const bcrypt = require('bcryptjs'); // Llibreria per encriptar contrasenyes

// Esquema d'Usuari a la base de dades
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
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    }],
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

// Encriptació automàtica de la contrasenya abans de guardar
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Mètode d'instància per verificar la contrasenya
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Elimina el camp password al convertir l'objecte a JSON
userSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

// Mètodes per a la gestió de Rols i Permisos (RBAC)
userSchema.methods.addRole = function(roleId) {
    if (!this.roles.includes(roleId)) {
        this.roles.push(roleId);
    }
    return this.save();
};

userSchema.methods.removeRole = function(roleId) {
    this.roles = this.roles.filter(r => r.toString() !== roleId.toString());
    return this.save();
};

userSchema.methods.getEffectivePermissions = async function() {
    // Carrega els rols i els seus permisos associats
    await this.populate({
        path: 'roles',
        populate: {
            path: 'permissions'
        }
    });

    const permissions = new Set();
    
    if (this.roles) {
        this.roles.forEach(role => {
            if (role.permissions) {
                role.permissions.forEach(permission => {
                    permissions.add(permission.name);
                });
            }
        });
    }

    return Array.from(permissions);
};

userSchema.methods.hasPermission = async function(permissionName) {
    const permissions = await this.getEffectivePermissions();
    return permissions.includes(permissionName);
};


module.exports = mongoose.model('User', userSchema); // Exportar el model
