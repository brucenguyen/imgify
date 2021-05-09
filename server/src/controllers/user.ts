import { Request, Response, NextFunction } from 'express';
import { getPostByUser, getPostCountByUser } from '../services/image';
import { createUser, getUser, updatePassword } from '../services/user';
import { getPostMetadata } from './image';

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
        console.error(err);
        return res.status(400).json({
            message: (err instanceof Error) ? err.message : err
        })
    }
}

export async function changePassword(req: Request, res: Response, next: NextFunction) {
    const username = req.body.username;
    const password = req.body.password;

    try {
        await updatePassword(username, password);
        next();
    } catch(err) {
        console.error(err);
        return res.status(400).json({
            message: (err instanceof Error) ? err.message : err
        })
    }
}

export async function getUserMetadata(req: Request, res: Response, next: NextFunction) {
    const username = req.body.username;
    const page = req.body.page;
    if (!req.body.username || !req.body.page || req.body.page < 1) {
        return res.status(401).json({
            message: "Can't find what you're looking for"
        })
    }

    const user = await getUser(username);
    if (!user) {
        return res.status(401).json({
            message: "User doesn't exist."
        })
    }

    try {
        // Hard-coding page numbers 'cause this is a coding challenge :P
        const postQuery = await getPostByUser(user.getDataValue('id'), page, 100);
        const numPosts = await getPostCountByUser(username);
        const post = await Promise.all(postQuery.map(async query => await getPostMetadata(query)));

        return res.json({
            message: 'Success',
            username: user.getDataValue('username'),
            dateCreated: user.getDataValue('createdAt'),
            numPosts: numPosts,
            posts: post
        })
    } catch(err) {
        console.error(err);
        return res.status(400).json({
            message: (err instanceof Error) ? err.message : err
        })
    }
}
