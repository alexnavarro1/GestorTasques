const mongoose = require('mongoose');

// Definició de l'esquema de dades amb Mongoose
const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'El títol és obligatori'],
        trim: true // Elimina espais sobrants
    },
    description: {
        type: String,
        default: ''  // Valor per defecte buit
    },
    cost: {
        type: Number,
        required: [true, 'El cost és obligatori'],
        min: [0, 'El cost no pot ser negatiu'] // Validació mínim 0
    },
    hours_estimated: {
        type: Number,
        required: [true, 'La previsió d\'hores és obligatòria'],
        min: [0, 'Les hores estimades no poden ser negatives']
    },
    hours_real: {
        type: Number,
        default: 0, // Valor per defecte 0
        min: [0, 'Les hores reals no poden ser negatives']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User', // Referència al model d'Usuari
        required: true, // Cada registre ha de tenir un usuari propietari
        index: true // Indexació per millorar el rendiment de les consultes per usuari
    },
    image: {
        type: String,
        default: '' // URL o ruta de la imatge
    },
    completed: {
        type: Boolean,
        default: false // Valor per defecte: fals
    },
    finished_at: {
        type: Date,
        default: null // Data de finalització (null si no completada)
    }
}, {
    timestamps: {
        createdAt: 'createdAt',  // Data de creació automàtica
        updatedAt: 'updatedAt'  // Data d'actualització automàtica
    }
});

// Actualitza la data de finalització automàticament quan es completa
TaskSchema.pre('save', function(next) {
    if (this.completed && !this.finished_at) {
        this.finished_at = new Date(); // Data actual si es completa
    } else if (!this.completed && this.finished_at) {
        this.finished_at = null; // Elimina data si es descompleta
    }
    next();
});

// Exportar model per usar-lo als controladors
module.exports = mongoose.model('Task', TaskSchema);