// Controlador per pujar imatges localment
exports.uploadLocal = (req, res) => {
    // Verifiquem si ha arribat un fitxer. Si no, retornem error 400.
    if (!req.file) {
        return res.status(400).send({
            success: false,
            message: 'No s\'ha enviat cap arxiu'
        });
    }

    // Construir la URL completa d'accés a la imatge local
    const protocol = req.protocol;
    const host = req.get('host');
    const url = `${protocol}://${host}/images/${req.file.filename}`;
    const path = `/uploads/${req.file.filename}`;

    // Retornem la resposta amb les dades de la imatge pujada
    res.status(200).send({
        success: true,
        message: 'Imatge pujada localment',
        image: {
            filename: req.file.filename,
            path: path,
            url: url,
            size: req.file.size,
            mimetype: req.file.mimetype
        }
    });
};

// Controlador per pujar imatges al núvol (Cloudinary)
exports.uploadCloud = (req, res) => {
    if (!req.file) {
        return res.status(400).send({
            success: false,
            message: 'No s\'ha enviat cap arxiu'
        });
    }

    // Retornem la informació que ens dona Cloudinary
    res.status(200).send({
        success: true,
        message: 'Imatge pujada a Cloudinary',
        image: {
            url: req.file.path,
            public_id: req.file.filename,
            format: req.file.format,
            size: req.file.size
        }
    });
};
