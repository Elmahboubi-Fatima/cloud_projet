const express=require('express');
const Project=require('../models/project');
const knockknock = require('../Middlewares/knockknock');
const whosthere = require('../Middlewares/whosthere');
const router=express.Router();

// Créer un projet - accessible uniquement pour les admins
router.post('/projects', knockknock, whosthere(['admin']), async (req, res) => {
    const project = new Project(req.body);
    try {
        await project.save();
        res.status(201).send(project); 
    } catch (error) {
        res.status(400).send({ message: 'Erreur lors de la création du projet', error });
    }
});

// Lire tous les projets - accessible à tous les utilisateurs authentifiés
router.get('/projects', knockknock, async (req, res) => {
    try {
        const projects = await Project.find();
        res.send(projects);
    } catch (error) {
        res.status(500).send({ message: 'Erreur lors de la récupération des projets', error });
    }
});
//lire un projet spécifique 
router.get('/projects/:id', knockknock, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).send({ message: 'Project not found' });
        }
        res.send(project);
    } catch (error) {
        res.status(500).send({ message: 'Erreur lors de la récupération du projet', error });
    }
});

// Mettre à jour un projet - accessible uniquement pour les admins
router.put('/projects/:id', knockknock, whosthere(['admin']), async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!project) {
            return res.status(404).send({ message: 'Project not found' });
        }
        res.send(project);
    } catch (error) {
        res.status(400).send({ message: 'Erreur lors de la mise à jour du projet', error });
    }
});

// Supprimer un projet - accessible uniquement pour les admins
router.delete('/projects/:id', knockknock, whosthere(['admin']), async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).send({ message: 'Project not found' });
        }
        res.send({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Erreur lors de la suppression du projet', error });
    }
});
 

module.exports = router;