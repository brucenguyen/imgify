import { Request, Response, NextFunction } from 'express';
import { Model } from 'sequelize/types';
import { createPost, deletePost, getImages, getKeywords, getPostById, getPostByPage, getPostCount, insertImages, insertKeywords } from '../services/image';
import { getUserById } from '../services/user';

export async function receiveImages(req: Request, res: Response, next: NextFunction) {
    if (!req.files || !req.body.title) {
        return res.status(401).json({
            message: 'Missing photos or title'
        })
    }

    const userID: number = res.locals.user.userID;
    const title: string = req.body.title;
    const keywords: string[] = (req.body.keywords instanceof Array || !req.body.keywords) ? req.body.keywords : [ req.body.keywords ];
    var files: Express.Multer.File[] = [];

    // For some reason req.files could be a dictionary
    if (req.files instanceof Array) {
        files = req.files;
    } else {
        for (var key in req.files) {
            Array.prototype.push.apply(files, req.files[key]);
        }
    }

    try {
        const post = await createPost(title, userID);
        await insertImages(post.getDataValue('id'), files)

        if (keywords) {
            await insertKeywords(post.getDataValue('id'), keywords)
        }

        return res.json({
            message: 'Internal server error, check server logs.',
            submissionID: post.getDataValue('id')
        })
    } catch(err) {
        console.error(err);
        return res.status(400).json({
            message: 'Internal server error, check server logs.'
        })
    }
}

export async function removePost(req: Request, res: Response, next: NextFunction) {
    const postID = req.body.postID;
    if (!req.body.postID) {
        return res.status(401).json({
            message: "Post doesn't exist"
        })
    }

    try {
        const post = await deletePost(postID);

        res.json({
            message: 'Success'
        });

        next();
    } catch(err) {
        return res.status(400).json({
            message: err
        })
    }
}

export async function getPost(req: Request, res: Response, next: NextFunction) {
    const postID = req.body.postID;
    if (!req.body.postID) {
        return res.status(401).json({
            message: "Post doesn't exist"
        })
    }

    try {
        const post = await getPostById(postID);

        if (!post) {
            return res.status(401).json({
                message: "Post doesn't exist"
            })
        }

        res.json({
            message: 'Success',
            post: await getPostMetadata(post)
        });

        next();
    } catch(err) {
        return res.status(400).json({
            message: err
        })
    }
}

export async function getPostPage(req: Request, res: Response, next: NextFunction) {
    const page = req.body.page;
    if (!req.body.page || req.body.page < 1) {
        return res.status(401).json({
            message: "Can't find what you're looking for"
        })
    }

    try {
        // Hard-coding page numbers 'cause this is a coding challenge :P
        const postQuery = await getPostByPage(page, 100);
        const numPosts = await getPostCount();
        const post = await Promise.all(postQuery.map(async query => await getPostMetadata(query)));

        res.json({
            message: 'Success',
            numPosts: numPosts,
            posts: post
        });

        next();
    } catch(err) {
        console.error(err);
        return res.status(400).json({
            message: err
        })
    } 
}

export async function getPostMetadata(post: Model) {
    const imageQuery = await getImages(post.getDataValue('id'));
    if (!imageQuery) {
        throw new Error("No images for this post");
    }
    const keywordQuery = await getKeywords(post.getDataValue('id'));
    const userQuery = await getUserById(post.getDataValue('userId'));

    const keywords = keywordQuery.map(keyword => keyword.getDataValue('keyword'));
    const images = imageQuery.map(image => image.getDataValue('filename'));

    return {
        postID: post.getDataValue('id'),
        title: post.getDataValue('title'),
        username: (userQuery) ? userQuery.getDataValue('username') : undefined,
        dateCreated: post.getDataValue('createdAt'),
        images: images,
        keywords: keywords
    }
}
