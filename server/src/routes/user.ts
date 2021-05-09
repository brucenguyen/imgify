import { Router } from 'express';
import { getToken } from '../controllers/auth';
import { getUserMetadata, registerUser } from '../controllers/user';

export const userRouter = Router();

userRouter.post('/', getUserMetadata);
userRouter.post('/register', registerUser, getToken);
