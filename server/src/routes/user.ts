import { Router } from 'express';
import { getToken } from '../controllers/auth';
import { registerUser } from '../controllers/user';

export const userRouter = Router();

userRouter.post('/register', registerUser, getToken);
