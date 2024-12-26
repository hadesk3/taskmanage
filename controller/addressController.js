import Address from "../model/AddressModel.js";

// Lấy tất cả địa chỉ
export const getAllAddresses = async (req, res) => {
    try {
        const addresses = await Address.find();
        res.status(200).json(addresses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Lấy địa chỉ theo ID
export const getAddressById = async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);
        if (!address) {
            return res.status(404).json({ message: "Address not found" });
        }
        res.status(200).json(address);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Tạo mới địa chỉ
export const createAddress = async (req, res) => {
    const address = new Address({
        street: req.body.street,
        city: req.body.city,
        country: req.body.country,
        zip: req.body.zip,
    });

    try {
        const newAddress = await address.save();
        res.status(201).json(newAddress);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Cập nhật địa chỉ
export const updateAddress = async (req, res) => {
    try {
        const updatedAddress = await Address.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedAddress) {
            return res.status(404).json({ message: "Address not found" });
        }
        res.status(200).json(updatedAddress);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Xóa địa chỉ
export const deleteAddress = async (req, res) => {
    try {
        const deletedAddress = await Address.findByIdAndDelete(req.params.id);
        if (!deletedAddress) {
            return res.status(404).json({ message: "Address not found" });
        }
        res.status(200).json({ message: "Address deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
