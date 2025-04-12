import userModel from "../models/user.model.js";
import otpModel from "../models/otp.model.js";
import blacklistTokenModel from "../models/blacklistToken.model.js";
import { validationResult } from "express-validator";
import crypto from 'crypto';
import sendMail from '../services/email.service.js';
import jwt from 'jsonwebtoken'
// import redisClient from "../services/redis.service.js";
import nodemailer from 'nodemailer';
import * as userService from "../services/user.service.js";







export const registerUser = async (req, res) => {
  // Validation check
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, email, password } = req.body;

    const isUserAlreadyExist = await userModel.findOne({ email });
    if (isUserAlreadyExist) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await userModel.hashedPassword(password);

    const otp = crypto.randomInt(111111, 999999).toString();
    const otpExpiry = Date.now() + 1 * 60 * 1000;

    await otpModel.findOneAndUpdate(
      { email },
      { username, email, password: hashedPassword, otp, otpExpiry },
      { upsert: true, new: true }
    );

    await sendMail(
      email,
      'Alven AI - OTP for Your Account Verification',
      `
      Dear,

      Welcome to Alven AI – your advanced development tool for seamless project collaboration with AI assistance!

      To complete your registration and verify your email address, please use the following One-Time Password (OTP):

      OTP: ${otp}

      This OTP is valid for 10 minutes. Please use it to complete your verification process.

      If you did not request this, please ignore this email or contact our support team immediately.

      Thank you for choosing Alven AI. We’re excited to support you in building innovative solutions!

      Best regards,  
      The Alven AI Team
    `
    );

    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Error in registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;

    const otpRecord = await otpModel.findOne({ otp });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    if (otpRecord.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired." });
    }

    const { username, email, password } = otpRecord;


    const newUser = new userModel({ username, email, password });
    await newUser.save();

    await otpModel.deleteOne({ email });

    const token = await newUser.generateJWT();
    console.log(token);

    res.cookie('token', token);

    delete newUser._doc.password;

    res.status(201).json({ token, newUser });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};





export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const existingRecord = await otpModel.findOne({ email });
    if (!existingRecord) {
      return res.status(400).json({ message: 'No registration found. Please register first.' });
    }

    const otp = crypto.randomInt(111111, 999999).toString();
    const otpExpiry = Date.now() + 1 * 60 * 1000;

    await otpModel.findOneAndUpdate(
      { email },
      { otp, otpExpiry },
      { new: true }
    );

    await sendMail(
      email,
      'Alven AI - OTP Resend for Your Account Verification',
      `
      Dear,

      You recently requested a new OTP for your Alven AI account verification.

      Your new OTP is: ${otp}

      This OTP is valid for 10 minutes. Please use it to complete your verification.

      If you did not request this, please ignore this email or contact our support team.

      Thank you,
      The Alven AI Team
    `
    );

    res.status(200).json({ message: 'New OTP sent to your email.' });

  } catch (error) {
    console.error('Error in resending OTP:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};





export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "15m" });

    // Reset password link
    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

    await sendMail(email, "Password Reset Request", `Click here to reset your password: ${resetLink}`);

    res.status(200).json({ message: "Password reset link sent successfully." });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};






export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.email) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const user = await userModel.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = await userModel.hashedPassword(newPassword);
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};





export const loginUser = async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select('+password');
    if (!user) {
      return res.status(404).json({ message: "invalid email or password" });
    }

    const isMatch = await user.isValidPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "invalid email or password" });
    }

    const token = await user.generateJWT();
    res.cookie('token', token);

    delete user._doc.password;

    res.status(200).json({ user, token });

  } catch (error) {
    res.status(400).json({ errors: error.message })
  }
}

export const profileController = async (req, res) => {
  console.log(req.user);

  res.status(200).json({ user: req.user });
}


export const getAllUser = async (req, res) => {
  try {

    const loggedInUser = await userModel.findOne( { email: req.user.email })

    const allUsers = await userService.getAllUser({ userId: loggedInUser._id});

    res.status(200).json({ users: allUsers });
    
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Internal Server Error" });
  }
}

export const logoutUser = async (req, res) => {
  try {

    const token = req.cookies.token || req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized user' });
    }

    await blacklistTokenModel.create({ token });

    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out Successfully.' });



  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
