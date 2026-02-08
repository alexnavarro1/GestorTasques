const Permission = require('../models/Permission'); // Model de Permís

exports.createPermission = async (req, res, next) => {
  try {
    const { name, description, category } = req.body;

    // Verificar si el nom del permís ja està en ús
    const existing = await Permission.findOne({ name });
    if (existing) {
        return res.status(400).json({ success: false, error: 'Ja existeix un permís amb aquest nom' });
    }

    // Creació del nou permís
    const permission = await Permission.create({ name, description, category });

    res.status(201).json({
      success: true,
      message: 'Permís creat correctament',
      data: permission
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllPermissions = async (req, res, next) => {
  try {
    const permissions = await Permission.find();
    res.status(200).json({
      success: true,
      count: permissions.length,
      data: permissions
    });
  } catch (error) {
    next(error);
  }
};

exports.getPermissionsByCategory = async (req, res, next) => {
    try {
        const permissions = await Permission.aggregate([
            {
                $group: {
                    _id: "$category",
                    permissions: { $push: "$$ROOT" }
                }
            }
        ]);
        res.status(200).json({
            success: true,
            data: permissions
        });
    } catch (error) {
        next(error);
    }
};

exports.getCategories = async (req, res, next) => {
    try {
        const categories = await Permission.distinct('category');
        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        next(error);
    }
};

exports.updatePermission = async (req, res, next) => {
    try {
        const { description } = req.body;
        const permission = await Permission.findByIdAndUpdate(
            req.params.id,
            { description },
            { new: true, runValidators: true }
        );

        if (!permission) {
             return res.status(404).json({ success: false, error: 'Permís no trobat' });
        }

        res.status(200).json({
            success: true,
            data: permission
        });
    } catch (error) {
        next(error);
    }
};

exports.deletePermission = async (req, res, next) => {
    try {
        const permission = await Permission.findById(req.params.id);
        if (!permission) {
             return res.status(404).json({ success: false, error: 'Permís no trobat' });
        }

        if (permission.isSystemPermission) {
            return res.status(403).json({ success: false, error: 'No pots eliminar un permís del sistema' });
        }

        await permission.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Permís eliminat correctament'
        });
    } catch (error) {
        next(error);
    }
};
