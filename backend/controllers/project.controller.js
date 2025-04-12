import projectModel from "../models/project.model.js";
import * as projectService from "../services/project.service.js";
import userModel from "../models/user.model.js";
import { validationResult } from 'express-validator';


export const createProject = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { name } = req.body;

        const loggedInUser = await userModel.findOne({ email: req.user.email });
        console.log(loggedInUser)
        if (!loggedInUser) {
            return res.status(401).json({ message: 'Please, Login first! ' });
        }

        const isProjectNameAlreadyExist = await projectModel.findOne({ name });
        if (isProjectNameAlreadyExist) {
            return res.status(400).json({ message: 'Project name already exists' });
        }

        const userId = loggedInUser._id;

        const newProject = await projectService.createProject({ name, userId });

        res.status(201).json(newProject);

    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);

    }

}

export const getAllProjects = async (req, res) => {
    try {

        const loggedInUser = await userModel.findOne({ email: req.user.email });
        if (!loggedInUser) {
            return res.status(401).json({ message: 'Please, Login first! ' });
        }

        const allUserProjects = await projectService.getAllProjectByUserId( { userId: loggedInUser._id})

        return res.status(200).json({ projects: allUserProjects });

    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
}


export const addUserToProject = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { projectId, users } = req.body;

        const loggedInUser = await userModel.findOne({ email: req.user.email });
        if (!loggedInUser) {
            return res.status(401).json({ message: 'Please, Login first! ' });
        }

        const project = await projectService.addUserToProject({
            projectId,
            users,
            userId: loggedInUser._id
        })

        return res.status(200).json({ project, message: "Collaborators added successfully!" });
        
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error.message });
    }
}

export const getProjectById = async ( req, res ) => {
    
    const { projectId } = req.params;

    try {

        const project = await projectService.getProjectById({ projectId });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        return res.status(200).json({ project });
        
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
}