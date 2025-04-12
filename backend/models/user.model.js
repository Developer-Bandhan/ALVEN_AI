import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minLength: [3, 'Username must be at least 3 characters'],
        maxLength: [20, 'Username must be at most 20 characters']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: [6, 'Email must be at least 6 characters'],
        maxLength: [50, 'Email must be at most 50 characters']
    },
    password: {
        type: String,
        required: true,
        select: false,
        minLength: [4, 'Password must be at least 4 characters'],
    },
    
    

})


userSchema.statics.hashedPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateJWT = async function () {
    const token = jwt.sign({ email: this.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return token;
}


const User = mongoose.model('user', userSchema);

export default User;