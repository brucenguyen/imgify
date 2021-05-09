import Sequelize from 'sequelize';
import { db } from '../config/database';
import { User } from './user';

export const Post = db.define('post', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    userId : {
        type: Sequelize.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

Post.belongsTo(User);
