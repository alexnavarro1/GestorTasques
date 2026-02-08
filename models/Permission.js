const mongoose = require('mongoose'); // Llibreria Mongoose per a MongoDB

// Esquema de Permís a la base de dades
const permissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nom del permís és obligatori'],
    unique: true
  },
  description: {
    type: String,
    required: [true, 'La descripció és obligatòria']
  },
  category: {
    type: String,
    required: [true, 'La categoria és obligatòria']
  },
  isSystemPermission: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Permission', permissionSchema); // Exportar el model
