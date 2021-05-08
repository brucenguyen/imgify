import { Request, Response, Router } from 'express';
import { getToken, authenticateToken } from '../controllers/auth';

export const authRouter = Router();

authRouter.get('/', authenticateToken, (req: Request, res: Response) => { res.json({ message: 'Success' }) });
authRouter.post('/signin', getToken);
