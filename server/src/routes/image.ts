import { Router } from 'express';
import multer from 'multer';

import { authenticateToken } from '../controllers/auth';
import { receiveImages, getPost, removePost, getPostPage } from '../controllers/image';

export const imageRouter = Router();

const storage = multer.diskStorage({ 
    destination: function(req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname.replace(/ /g, '_'))
    }
});
const upload = multer({ storage: storage });

imageRouter.post('/submission', getPost);
imageRouter.post('/submission/all', getPostPage);
imageRouter.post('/submission/delete', authenticateToken, removePost);
imageRouter.post('/upload', authenticateToken, upload.array('images'), receiveImages);
