import mongoose from 'mongoose';
import projectModel from '../models/project.model.js'



export const createProject = async ({ name, userId }) => {
  try {
    if (!name) {
      throw new Error('Project name is required');
    }
    if (!userId) {
      throw new Error('User ID is required');
    }

    const project = await projectModel.create({
      name,
      users: [userId],
    });

    return { success: true, project };
  } catch (error) {
    console.error(error);
    throw new Error('Server error');
  }
};

export const getAllProjectByUserId = async ({ userId }) => {
  try {

    if (!userId) {
      throw new Error('User ID is required');
    }

    const allUserProjects = await projectModel.find({ users: userId }).populate('users');

    return allUserProjects

  } catch (error) {
    console.error(error);
    throw new Error('Server error');
  }
}

export const addUserToProject = async ({ projectId, users, userId }) => {

  if (!projectId) {
    throw new Error('Project ID is required');
  }
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error('Invalid project ID');
  }

  if (!users) {
    throw new Error('Users are required');
  }
  if (!Array.isArray(users) || users.some(userId => !mongoose.Types.ObjectId.isValid(userId))) {
    throw new Error('Invalid user ID');
  }

  if (!userId) {
    throw new Error('User ID is required');
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  const projects = await projectModel.findOne({
    _id: projectId,
    users: userId
  })
  if (!projects) {
    throw new Error('User is not a member of this project');
  }

  const updatedProject = await projectModel.findByIdAndUpdate({
    _id: projectId
  }, {
    $addToSet: {
      users: {
        $each: users,
      }
    }
  }
    , {
      new: true,
    })

  return updatedProject

}


export const getProjectById = async ({ projectId }) => {
  if(!projectId) {
    throw new Error('Project ID is required');
  }
  if(!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error('Invalid project ID');
  }

  const porject = await projectModel.findOne({
    _id: projectId
  }).populate('users')

  return porject
}