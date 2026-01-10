const Task = require('../models/Task');
const fs = require('fs');
const path = require('path');
const cloudinary = require('../config/cloudinary');

// Helper per eliminar imatges (igual que abans)
const deleteImage = (imageUrl) => {
    return new Promise((resolve) => {
        if (!imageUrl) return resolve();

        if (imageUrl.includes('res.cloudinary.com')) {
            const parts = imageUrl.split('/upload/');
            if (parts.length < 2) return resolve();
            const publicId = parts[1].split('/').slice(1).join('/').split('.')[0];
            
            cloudinary.uploader.destroy(publicId)
                .then(() => resolve())
                .catch(() => resolve());
        } else {
            const filename = imageUrl.split('/').pop();
            const localPath = path.join(__dirname, '../uploads', filename);
            fs.unlink(localPath, () => resolve());
        }
    });
};

// Crear tasca
exports.createTask = async (req, res) => {
    try {
        const { title, description, cost, hours_estimated, hours_real, image, completed } = req.body;

        // Validació simple
        if (!title || cost === undefined || hours_estimated === undefined) {
            return res.status(400).json({
                success: false,
                error: 'Falten camps obligatoris (title, cost, hours_estimated)'
            });
        }

        const task = await Task.create({
            title,
            description,
            cost,
            hours_estimated,
            hours_real,
            image,
            completed,
            user: req.user.id // Assignem l'usuari autenticat
        });

        res.status(201).json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// Obtenir tasques de l'usuari
exports.getAllTasks = async (req, res) => {
    try {
        // Filtrem per l'usuari autenticat
        const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// Obtenir una tasca
exports.getTaskById = async (req, res) => {
    try {
        // Busquem per ID i que pertanyi a l'usuari
        const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

        if (!task) {
            return res.status(404).json({ success: false, error: 'Tasca no trobada' });
        }
        res.status(200).json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// Actualitzar tasca
exports.updateTask = async (req, res) => {
    try {
        let task = await Task.findOne({ _id: req.params.id, user: req.user.id });

        if (!task) {
            return res.status(404).json({ success: false, error: 'Tasca no trobada' });
        }

        const updates = req.body;
        // Gestió de data de finalització
        if (updates.completed === true) updates.finished_at = new Date();
        else if (updates.completed === false) updates.finished_at = null;

        task = await Task.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true
        });

        res.status(200).json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// Eliminar tasca
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

        if (!task) {
            return res.status(404).json({ success: false, error: 'Tasca no trobada' });
        }

        await deleteImage(task.image);
        await task.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Tasca eliminada'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// Obtenir estadístiques
exports.getTaskStats = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id });

        // Càlculs bàsics
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.completed).length;
        const pendingTasks = totalTasks - completedTasks;
        const completionRate = totalTasks > 0 ? (completedTasks / totalTasks * 100).toFixed(2) : 0;
        
        // Sumatoris
        const totalCost = tasks.reduce((acc, t) => acc + t.cost, 0);
        const totalHoursEstimated = tasks.reduce((acc, t) => acc + t.hours_estimated, 0);
        const totalHoursReal = tasks.reduce((acc, t) => acc + (t.hours_real || 0), 0);
        
        res.status(200).json({
            success: true,
            data: {
                overview: { totalTasks, completedTasks, pendingTasks, completionRate: Number(completionRate) },
                financial: { totalCost },
                time: { totalHoursEstimated, totalHoursReal }
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// Actualitzar imatge
exports.updateTaskImage = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

        if (!task) {
            return res.status(404).json({ success: false, error: 'Tasca no trobada' });
        }

        if (!req.body.image) {
            return res.status(400).json({ success: false, error: 'Falta la Imatge' });
        }

        task.image = req.body.image;
        await task.save();

        res.status(200).json({ success: true, task });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Reset imatge
exports.resetTaskImage = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

        if (!task) {
            return res.status(404).json({ success: false, error: 'Tasca no trobada' });
        }

        task.image = '';
        await task.save();

        res.status(200).json({ success: true, task });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
