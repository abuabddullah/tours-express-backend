import express from 'express';
import * as locationController from '../controllers/locationController';
import { protect, restrictTo } from '../middleware/auth';

const router = express.Router();

router.get('/', locationController.getAllLocations);
router.get('/:id', locationController.getLocation);

router.use(protect, restrictTo('user'));

router.post('/', locationController.createLocation);
router.patch('/:id', locationController.updateLocation);
router.delete('/:id', locationController.deleteLocation);

export default router;
