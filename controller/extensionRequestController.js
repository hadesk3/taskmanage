import ExtensionRequest from '../model/ExtensionRequestModel.js'; 

export const getAllExtensionRequests = async (req, res) => {
    try {
        const extensionRequests = await ExtensionRequest.find();
        res.status(200).json(extensionRequests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getExtensionRequestById = async (req, res) => {
    try {
        const extensionRequest = await ExtensionRequest.findById(req.params.id);
        if (extensionRequest == null) {
            return res.status(404).json({ message: 'Extension Request not found' });
        }
        res.status(200).json(extensionRequest);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createExtensionRequest = async (req, res) => {
    const extensionRequest = new ExtensionRequest({
        task_id: req.body.task_id,
        user_id: req.body.user_id,
        new_deadline: req.body.new_deadline,
        status: req.body.status,
        request_timestamp: req.body.request_timestamp
    });

    try {
        const newExtensionRequest = await extensionRequest.save();
        res.status(201).json(newExtensionRequest);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const updateExtensionRequest = async (req, res) => {
    try {
        const extensionRequest = await ExtensionRequest.findById(req.params.id);
        if (extensionRequest == null) {
            return res.status(404).json({ message: 'Extension Request not found' });
        }

        if (req.body.task_id != null) {
            extensionRequest.task_id = req.body.task_id;
        }
        if (req.body.user_id != null) {
            extensionRequest.user_id = req.body.user_id;
        }
        if (req.body.new_deadline != null) {
            extensionRequest.new_deadline = req.body.new_deadline;
        }
        if (req.body.status != null) {
            extensionRequest.status = req.body.status;
        }
        if (req.body.request_timestamp != null) {
            extensionRequest.request_timestamp = req.body.request_timestamp;
        }

        const updatedExtensionRequest = await extensionRequest.save();
        res.status(200).json(updatedExtensionRequest);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteExtensionRequest = async (req, res) => {
    try {
        const extensionRequest = await ExtensionRequest.findById(req.params.id);
        if (extensionRequest == null) {
            return res.status(404).json({ message: 'Extension Request not found' });
        }

        await extensionRequest.remove();
        res.status(200).json({ message: 'Deleted Extension Request' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
