// src/controllers/auth.signup.ts
import type { NextFunction, Request, Response } from 'express';
import { RegisterUser } from '../services/auth.register.js';

export default async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    // 1. Extract req.body
    const { username, email, password } = req.body;

    // 2. Basic input validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    if(password.length() <= 7){
      return res.status(400).json({error: 'Password must be at least 8 characters long'});
    }

    // 3. Delegate business logic & DB creation to the service layer
    const newUser = await RegisterUser({ username, email, password });

    // 4. Return success
    return res.status(201).json({
      message: 'User created successfully',
      user: newUser
    });

  } catch (error: any) {
    // Handle expected business errors thrown by the service
    if (error.message === 'USERNAME_TAKEN') {
      return res.status(409).json({ error: 'Username is already taken.' });
    }
    if (error.message === 'EMAIL_TAKEN') {
      return res.status(409).json({ error: 'Email is already registered.' });
    }

    // Handle unexpected failures
    return next(error);
  }
}