import { Router } from "express";
import { body } from 'express-validator'
import * as projectController from '../controllers/project.controller.js'
import * as authMilledware from '../middlewares/auth.middleware.js'




const router = Router();


router.post('/create',
    authMilledware.authUser,
    body('name').isString().withMessage('Name is required'),
    projectController.createProject
);

router.get('/all-projects', 
    authMilledware.authUser, 
    projectController.getAllProjects
);

router.put('/add-user',
    authMilledware.authUser,
    body('projectId').isString().withMessage('Project id is required'),
    body('users').isArray({ min:1 }).withMessage('Users must be an array of strings').bail()
    .custom((users) => users.every(user => typeof user === 'string')).withMessage('Each user must be a string'),
    projectController.addUserToProject
)

router.get('/get-project/:projectId', authMilledware.authUser, projectController.getProjectById)

export default router;