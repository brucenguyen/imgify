import { Request, Response, NextFunction } from 'express';
import { Model } from 'sequelize/types';
import { createPost, deletePost, getImages, getKeywords, getPostById, getKeyword, getPostByPage, getPostByTitle, getPostCount, insertImages, insertKeywords } from '../services/image';
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

export async function searchPost(req: Request, res: Response, next: NextFunction) {
    const query = req.body.query;
    if (!query) {
        return res.status(401).json({
            message: "Can't search with an empty query"
        })
    }

    try {
        const titlePosts = await getPostByTitle(query);
        const keywordPosts = await getKeyword(query);

        var postIds = new Set();
        var postQuery: Model[] = [];
        await Promise.all(titlePosts.map(post => {
            if (!postIds.has(post.getDataValue('id'))) {
                postIds.add(post.getDataValue('id'));
                postQuery.push(post)
            }
        }));
        await Promise.all(keywordPosts.map(async keyword => {
            if (!postIds.has(keyword.getDataValue('postId'))) {
                postIds.add(keyword.getDataValue('postId'));
                const tempPost = await getPostById(keyword.getDataValue('postId'));
                if (tempPost) {
                    postQuery.push(tempPost as Model);
                }
            }
        }));

        const post = await Promise.all(postQuery.map(async query => await getPostMetadata(query as Model)));

        res.json({
            message: 'Success',
            posts: post
        });

        next();
    } catch(err) {
        console.error(err);
        return res.status(400).json({
            message: (err instanceof Error) ? err.message : err
        })
    }
}

export async function removePost(req: Request, res: Response, next: NextFunction) {
    const postIDs: number[] = req.body.postID;
    if (!postIDs || !postIDs.length) {
        return res.status(401).json({
            message: "Post doesn't exist"
        })
    }

    const userID: number = res.locals.user.userID;

    try {
        const verifyPosts = await Promise.all(postIDs.map(async postID => {
            const postQuery = await getPostById(postID);
            if (postQuery && postQuery.getDataValue('userId') !== userID) {
                throw new Error("Tried to delete another user's post.");
            } else {
                return postID;
            }
        })).catch((err) => {
            return err;
        });

        if (verifyPosts instanceof Error) {
            throw verifyPosts;
        }

        const post = await deletePost(postIDs);

        res.json({
            message: 'Success'
        });

        next();
    } catch(err) {
        console.error(err);
        return res.status(400).json({
            message: (err instanceof Error) ? err.message : err
        })
    }
}

export async function getPost(req: Request, res: Response, next: NextFunction) {
    const postID = req.body.postID;
    if (!postID) {
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
        console.error(err);
        return res.status(400).json({
            message: (err instanceof Error) ? err.message : err
        })
    }
}

export async function getPostPage(req: Request, res: Response, next: NextFunction) {
    const page = req.body.page;
    if (!page || page < 1) {
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
            message: (err instanceof Error) ? err.message : err
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
