import { Request, Response, NextFunction } from 'express';
import { createUser, getUser, updatePassword } from '../services/user';

export async function registerUser(req: Request, res: Response, next: NextFunction) {
    const username = req.body.username;
    const password = req.body.password;

    if (username.length < 3) {
        return res.status(401).json({
            message: 'Username must be 3 characters or longer.'
        });
    }

    if (password.length < 8) {
        return res.status(401).json({
            message: 'Password must be 8 characters or longer.'
        });
    }

    try {
        const user = await getUser(username);

        if (user) {
            return res.status(401).json({
                message: 'Username already exists.'
            });
        }

        createUser(username, password).then(() => { next(); });
    } catch(err) {
        console.log(err);
        return res.status(400);
    }
}

export async function changePassword(req: Request, res: Response, next: NextFunction) {
    const username = req.body.username;
    const password = req.body.password;

    try {
        await updatePassword(username, password);
        next();
    } catch (err) {
        next(err);
    }
}
