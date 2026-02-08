const Role = require('../models/Role'); // Model de Rol
const User = require('../models/User'); // Model d'Usuari

exports.createRole = async (req, res, next) => {
  try {
    const { name, description, permissions } = req.body;

    const existing = await Role.findOne({ name });
    if (existing) {
        return res.status(400).json({ success: false, error: 'Ja existeix un rol amb aquest nom' });
    }


    // Validar unicitat i crear el rol (els permisos s'associen per ID)
    const role = await Role.create({ name, description, permissions });
    
    // Poblar els permisos per retornar l'objecte complet amb detalls
    await role.populate('permissions');

    res.status(201).json({
      success: true,
      message: 'Rol creat correctament',
      data: role
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ success: false, error: messages.join(', ') });
    }
    next(error);
  }
};

exports.getAllRoles = async (req, res, next) => {
  try {
    const roles = await Role.find().populate('permissions');
    res.status(200).json({
      success: true,
      count: roles.length,
      data: roles
    });
  } catch (error) {
    next(error);
  }
};

exports.getRoleById = async (req, res, next) => {
  try {
    const role = await Role.findById(req.params.id).populate('permissions');
    if (!role) {
      return res.status(404).json({ success: false, error: 'Rol no trobat' });
    }
    res.status(200).json({
      success: true,
      data: role
    });
  } catch (error) {
    next(error);
  }
};

exports.updateRole = async (req, res, next) => {
  try {
    const { name, description, permissions } = req.body;
    
    let role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ success: false, error: 'Rol no trobat' });
    }

    if (role.isSystemRole && name !== role.name) {
         return res.status(403).json({ success: false, error: 'No pots renombrar un rol del sistema' });
    }

    role = await Role.findByIdAndUpdate(req.params.id, { name, description, permissions }, {
        new: true,
        runValidators: true
    }).populate('permissions');

    res.status(200).json({
      success: true,
      data: role
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteRole = async (req, res, next) => {
  try {
    const role = await Role.findById(req.params.id);
     if (!role) {
      return res.status(404).json({ success: false, error: 'Rol no trobat' });
    }

    if (role.isSystemRole) {
         return res.status(403).json({ success: false, error: 'No pots eliminar un rol del sistema' });
    }

    // Reassignar usuaris al rol per defecte 'user' abans d'eliminar el rol actual
    // Buscar rol 'user' per defecte
    const userRole = await Role.findOne({ name: 'user' });
    if (userRole) {
        // 1. Assignar el nou rol 'user' als usuaris afectats
        await User.updateMany(
            { roles: role._id },
            { $addToSet: { roles: userRole._id } }
        );
        
        // 2. Eliminar el rol antic dels usuaris
        await User.updateMany(
             { roles: role._id },
             { $pull: { roles: role._id } }
        );
    }

    await role.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Rol eliminat correctament'
    });
  } catch (error) {
    next(error);
  }
};

exports.addPermissionToRole = async (req, res, next) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) return res.status(404).json({success: false, error: 'Rol no trobat'});

        const { permissionId } = req.body;
        await role.addPermission(permissionId);
        
        await role.populate('permissions');
        res.status(200).json({ success: true, data: role });
    } catch (error) {
        next(error);
    }
};

exports.removePermissionFromRole = async (req, res, next) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) return res.status(404).json({success: false, error: 'Rol no trobat'});

        const { permissionId } = req.params;
        await role.removePermission(permissionId);

        await role.populate('permissions');
        res.status(200).json({ success: true, data: role });
    } catch (error) {
        next(error);
    }
};
