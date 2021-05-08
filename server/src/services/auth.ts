import { getUser } from '../services/user';
import bcrypt from 'bcrypt';
import { Model } from 'sequelize';

export async function validateUser(username: string, password: string): Promise<Model | null> {
    const user = await getUser(username);

    if (!user) {
        return null;
    }

    if (!(await bcrypt.compare(password, user.getDataValue('password')))) {
        return null;
    }

    return user;
}