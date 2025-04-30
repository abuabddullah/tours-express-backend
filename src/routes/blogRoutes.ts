import express from 'express';
import * as blogController from '../controllers/blogController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlog);

router.use(protect);

router.post('/', blogController.createBlog);
router.patch('/:id', blogController.updateBlog);
router.delete('/:id', blogController.deleteBlog);

export default router;
