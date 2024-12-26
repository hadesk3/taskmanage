import Role from '../model/RoleModel.js'; 

export const getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        res.status(200).json(roles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getRoleById = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (role == null) {
            return res.status(404).json({ message: 'Role not found' });
        }
        res.status(200).json(role);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createRole = async (req, res) => {
    const role = new Role({
        name: req.body.name,
        permissions: req.body.permissions
    });

    try {
        const newRole = await role.save();
        res.status(201).json(newRole);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const updateRole = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (role == null) {
            return res.status(404).json({ message: 'Role not found' });
        }

        if (req.body.name != null) {
            role.name = req.body.name;
        }
        if (req.body.permissions != null) {
            role.permissions = req.body.permissions;
        }

        const updatedRole = await role.save();
        res.status(200).json(updatedRole);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteRole = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (role == null) {
            return res.status(404).json({ message: 'Role not found' });
        }

        await role.remove();
        res.status(200).json({ message: 'Deleted Role' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
