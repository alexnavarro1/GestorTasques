const mongoose = require('mongoose'); // Llibreria Mongoose per a MongoDB

// Esquema de Rol a la base de dades
const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nom del rol és obligatori'],
    unique: true
  },
  description: {
    type: String
  },
  permissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Permission'
  }],
  isSystemRole: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Mètodes d'instància per gestionar permisos del rol
roleSchema.methods.addPermission = function(permissionId) {
  if (!this.permissions.includes(permissionId)) {
    this.permissions.push(permissionId);
  }
  return this.save();
};

roleSchema.methods.removePermission = function(permissionId) {
  this.permissions = this.permissions.filter(p => p.toString() !== permissionId.toString());
  return this.save();
};

// Comprova si el rol té un permís específic (requereix 'populate')
roleSchema.methods.hasPermission = function(permissionName) {
  return this.permissions.some(p => p.name === permissionName);
};

module.exports = mongoose.model('Role', roleSchema); // Exportar el model
