import express from 'express';
import * as tourController from '../controllers/tourController';
import { protect, restrictTo } from '../middleware/auth';

const router = express.Router();

router.get('/', tourController.getAllTours);
router.get('/:id', tourController.getTour);

router.use(protect);

router.post('/', restrictTo('user'), tourController.createTour);
router.patch('/:id', restrictTo('user'), tourController.updateTour);
router.delete('/:id', restrictTo('user'), tourController.deleteTour);

export default router;
