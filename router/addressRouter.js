import express from "express";
import {
    getAddressById,
    createAddress,
    deleteAddress,
    getAllAddresses,
    updateAddress
    
} from "../controller/addressController.js";
const router = express.Router();

router.get('/address', getAllAddresses);
router.get('/address/:id', getAddressById);
router.post('/address', createAddress);
router.put('/address/:id', updateAddress);
router.delete('/address/:id', deleteAddress);

export default router;
