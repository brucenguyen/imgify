import Sequelize from 'sequelize';
import { db } from '../config/database';
import { Post } from './post';

export const Image = db.define('image', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    postId : {
        type: Sequelize.INTEGER,
        references: {
            model: Post,
            key: 'id'
        }
    },
    filename: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

export const Keyword = db.define('imageKeyword', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    postId : {
        type: Sequelize.INTEGER,
        references: {
            model: Post,
            key: 'id'
        }
    },
    keyword: {
        type: Sequelize.STRING,
        allowNull: false,
    }
})

Image.belongsTo(Post, { onDelete: 'cascade' });
Keyword.belongsTo(Post, { onDelete: 'cascade' });
