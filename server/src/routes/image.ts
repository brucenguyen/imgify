import { Router } from 'express';
import multer from 'multer';

import { authenticateToken } from '../controllers/auth';
import { receiveImages } from '../controllers/image';

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

imageRouter.post('/upload', authenticateToken, upload.array('images'), receiveImages);
