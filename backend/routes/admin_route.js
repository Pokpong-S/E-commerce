import express from 'express';
import { authenticate, authorize } from '../middleware/authMid.js';
import { ApproveMerchant, getUsers, RejectMerchant } from '../controllers/admin_controller.js';
const router = express.Router();

router.get('/users',authenticate,authorize(['admin']),getUsers);
router.post('/approve/:id',authenticate,authorize(['admin']),ApproveMerchant);
router.post('/reject/:id',authenticate,authorize(['admin']),RejectMerchant);

export default router;