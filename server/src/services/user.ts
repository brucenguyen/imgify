import { User } from '../models/user'
import bcrypt from 'bcrypt';
import Sequelize from 'sequelize';

export async function getUser(username: string): Promise<Sequelize.Model | null> {
    return await User.findOne({
        where: 
            Sequelize.where(
                Sequelize.fn('lower', Sequelize.col('username')),
                username.toLowerCase()
            )
    });
}

export async function getUserById(userID: number): Promise<Sequelize.Model | null> {
    return await User.findOne({
        where: {
            id: userID
        }
    });
}

export async function createUser(username: string, password: string): Promise<any> {
    const hash = await bcrypt.hash(password, 10)

    return User.create({
        username: username,
        password: hash
    });
}

export async function updatePassword(username: string, password: string): Promise<any> {
    const user = await getUser(username)

    if (!user) {
        throw new Error("No user found.");
    }

    const hash = await bcrypt.hash(password, 10)

    user.update({
        password: hash
    });
}
