import express from "express";
import {
   getAllExtensionRequests,
   getExtensionRequestById,
   createExtensionRequest,
   updateExtensionRequest,
   deleteExtensionRequest
} from "../controller/extensionRequestController.js";
const router = express.Router();

router.get('/extensionRequests', getAllExtensionRequests);
router.get('/extensionRequests/:id', getExtensionRequestById);
router.post('/extensionRequests', createExtensionRequest);
router.put('/extensionRequests/:id', updateExtensionRequest);
router.delete('/extensionRequests/:id', deleteExtensionRequest);

export default router;
