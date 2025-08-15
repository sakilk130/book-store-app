import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import User from '../models/user';

dotenv.config();

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'All fields are required', data: null });
    }

    const user = await User.findOne({
      email,
    });
    if (!user) {
      return res
        .status(404)
        .json({ message: 'Invalid credentials', data: null });
    }
    const isMatchPassword = await (user as any).comparePassword(password);
    if (!isMatchPassword) {
      return res
        .status(401)
        .json({ message: 'Invalid credentials', data: null });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: '1d',
    });

    return res.status(200).json({
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profile_image: user.profile_image,
        },
        token,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Internal server error', data: null });
  }
};

const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: 'All fields are required', data: null });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters long',
        data: null,
      });
    }

    if (username.length < 3) {
      return res.status(400).json({
        message: 'Username must be at least 3 characters long',
        data: null,
      });
    }

    const user = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (user) {
      return res
        .status(400)
        .json({ message: 'User already exists', data: null });
    }

    const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

    const newUser = new User({
      username,
      email,
      password,
      profile_image: profileImage,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '1d',
      }
    );

    return res.status(201).json({
      message: 'User registered successfully',
      data: {
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          profile_image: newUser.profile_image,
        },
        token,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Internal server error', data: null });
  }
};

export { login, register };
