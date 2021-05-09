import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

import { validateUser } from '../services/auth';
import { getUser } from '../services/user';

export async function getToken(req: Request, res: Response, next: NextFunction) {
    if (!process.env.ACCESS_TOKEN_SECRET) {
        throw new Error("No secret specified!");
    }

    const username = req.body.username;
    const password = req.body.password;

    try {
        const user = await validateUser(username, password);

        if (!user) {
            return res.status(401).json({
                message: 'Invalid username or password.'
            });
        }
    
        const payload = {
            userID: user.getDataValue('id'),
            username: user.getDataValue('username'),
            dateCreated: user.getDataValue('createdAt')
        }
        
        const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
    
        res.json({
            message: 'Success',
            token: token,
            username: user.getDataValue('username')
        })
    
        next();
    } catch(err) {
        console.error(err);
        return res.status(400).json({
            message: (err instanceof Error) ? err.message : err
        })
    }
}

export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token || !process.env.ACCESS_TOKEN_SECRET) {
        res.status(401).json({
            message: 'Session expired.'
        });
    } else {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                res.status(401).json({
                    message: 'Session expired.'
                });
            } else {
                if (!user || !getUser((user as any).username)) {
                    res.status(401).json({
                        message: 'Session expired.'
                    });
                } else {
                    res.locals.user = user;
                    next();
                }
            }
        });
    }
}
