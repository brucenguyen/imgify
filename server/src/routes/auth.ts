import { Request, Response, Router } from 'express';
import { getToken, authenticateToken } from '../controllers/auth';

export const authRouter = Router();

authRouter.post('/signin', getToken);
authRouter.get('/', authenticateToken, (req: Request, res: Response) => {
    if (res.locals.user) {
        res.json({ 
            message: 'Success',
            username: res.locals.user.username
        })
    } else {
        res.status(403).json({
            message: 'Session expired'
        })
    }
});
