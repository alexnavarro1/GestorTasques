const mongoose = require('mongoose');

const connectDB = () => {
    // Connexió a la base de dades MongoDB amb les opcions de configuració
    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,      // Evita advertències del parser d'URL
        useUnifiedTopology: true    // Habilita el nou motor de connexions
    })
    .then(() => {
        // Confirmació de connexió exitosa
        console.log('Connexió a MongoDB establerta');
    })
    .catch(err => {
        // Maneig d'errors en la connexió
        console.error('Error connectant a MongoDB:', err);
        process.exit(1);  // Atura l'aplicació si hi ha error
    });
};

// Exportar la funció de connexió
module.exports = connectDB;