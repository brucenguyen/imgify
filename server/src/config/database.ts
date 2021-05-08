import { Sequelize } from 'sequelize';

export const db = new Sequelize({
    dialect: 'sqlite',
    storage: './imgify.db'
});