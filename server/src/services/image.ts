import Sequelize from "sequelize";
import { Post } from "../models/post";
import { User } from "../models/user";
import { Image, Keyword } from "../models/image";
import { getUser } from "./user";

export async function createPost(title: string, userID: number): Promise<Sequelize.Model> {
    return Post.create({
        title: title,
        userId: userID
    });
}

export async function deletePost(postID: number) {
    return Post.destroy({
        where: {
            id: postID
        }
    });
}

export async function getPostCount() {
    return await Post.count();
}

export async function getPostCountByUser(username: string) {
    const user = await getUser(username);
    if (!user) {
        throw new Error("User doesn't exist")
    }

    return await Post.count({
        where: {
            userId: user.getDataValue('id')
        }
    })
}

export async function getPostByPage(page: number, pageLength: number) {
    return await Post.findAll({
        order: [ ['createdAt', 'DESC'] ],
        limit: pageLength,
        offset: pageLength * (page - 1)
    });
}

export async function getPostById(postID: number) {
    return await Post.findOne({
        where: {
            id: postID
        }
    });
}

export async function getPostByUser(userID: number, page: number, pageLength: number) {
    return await Post.findAll({
        where: {
            userId: userID
        },
        limit: pageLength,
        offset: pageLength * (page - 1)
    });
}

export async function insertImages(postID: number, files: Express.Multer.File[]) {
    var values: any[] = [];
    files.forEach(file => {
        values.push({
            filename: file.filename,
            postId: postID
        })
    });

    return Image.bulkCreate(values, { include: Post, validate: true });
}

export async function getImages(postID: number) {
    return await Image.findAll({
        where: {
            postId: postID
        }
    });
}

export async function insertKeywords(postID: number, keywords: string[]) {
    var values: any[] = [];
    keywords.forEach(keyword => {
        values.push({
            keyword: keyword,
            postId: postID
        })
    });

    return Keyword.bulkCreate(values, { include: Post, validate: true });
}

export async function getKeywords(postID: number) {
    return await Keyword.findAll({
        where: {
            postId: postID
        }
    });
}
