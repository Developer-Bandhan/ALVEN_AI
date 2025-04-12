import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
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
    },
    otp: {
        type: String,
        required: true
    },
    password: {
        type: String,
        minLength: [4, 'Password must be at least 4 characters'],
    },
    otpExpiry: {
        type: Date,
        required: true
    }
});

// Automatically delete expired OTPs after 10 minutes
otpSchema.index({ otpExpiry: 1 }, { expireAfterSeconds: 30 });

const otpModel = mongoose.model('OTP', otpSchema);

export default otpModel;
