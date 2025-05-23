import userModel from '../models/user.model.js';

export const createUser = async (email, password) => {
    if( !email || !password ){
        throw new Error('All fields are required');
    }

    const hashedPassword = await userModel.hashedPassword(password);

    const user = await userModel.create({
        email,
        password : hashedPassword
    });

    return user;

}

export const getAllUser = async ({ userId }) => {
    const users = await userModel.find({
        _id : { $ne : userId }
    });
    return users;
}