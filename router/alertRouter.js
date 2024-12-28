import express from "express";
import {
    getAllAlerts,
    getAlertById,
    createAlert,
    deleteAlert,
    updateAlert,
    getAlertsByUserId,
    createExtendTime
    
} from "../controller/alertController.js";
const router = express.Router();

router.get('/alerts', getAllAlerts);
router.get('/alerts/:id', getAlertById);
router.post('/alerts', createAlert);
router.put('/alerts/:id', deleteAlert);
router.delete('/alerts/:id', updateAlert);
router.get('/alerts/user/:userId', getAlertsByUserId);
router.post('/alerts/createExtend', createExtendTime);

export default router;
