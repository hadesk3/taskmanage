import Alert from "../model/AlertModel.js";
import Task from '../model/TaskModel.js';
// Lấy tất cả cảnh báo
export const getAllAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find();
    res.status(200).json(alerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy cảnh báo theo ID
export const getAlertById = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }
    res.status(200).json(alert);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tạo mới cảnh báo
export const createAlert = async (req, res) => {
  // Kiểm tra dữ liệu từ client
  const { task_id, alert_type, sent_to } = req.body;

  if (!task_id || !sent_to) {
    return res.status(400).json({ message: "Missing required fields: task_id or sent_to" });
  }

  // Tạo mới alert theo schema
  const alert = new Alert({
    task_id,  // ID của công việc liên quan đến alert
    alert_type: alert_type || 'Deadline',  // Loại thông báo, mặc định là 'Deadline'
    sent_to,  // ID của người nhận thông báo
    timestamp: new Date(),  // Thời gian thông báo
    isRead: false  // Mặc định là chưa đọc
  });

  try {
    // Lưu alert vào cơ sở dữ liệu
    const newAlert = await alert.save();
    res.status(201).json(newAlert);  // Trả về thông báo mới được tạo
  } catch (err) {
    res.status(400).json({ message: err.message });  // Xử lý lỗi khi tạo alert
  }
};
// Cập nhật cảnh báo
export const updateAlert = async (req, res) => {
  try {
    const updatedAlert = await Alert.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedAlert) {
      return res.status(404).json({ message: "Alert not found" });
    }
    res.status(200).json(updatedAlert);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Xóa cảnh báo
export const deleteAlert = async (req, res) => {
  try {
    const deletedAlert = await Alert.findByIdAndDelete(req.params.id);
    if (!deletedAlert) {
      return res.status(404).json({ message: "Alert not found" });
    }
    res.status(200).json({ message: "Alert deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAlertsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const alerts = await Alert.find({ sent_to: userId })
    .sort({ timestamp: -1 }) 
    .limit(3)
      .populate("task_id")
      .populate("sent_to");
      const unreadCount = await Alert.countDocuments({ sent_to: userId, isRead: false });

      res.status(200).json({ alerts, unreadCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const createExtendTime = async (req, res) => {
  try {
      const { task_id, alert_type, reason, date_extend, sent_to,user } = req.body;

      const alert = new Alert({
          task_id,
          alert_type,
          reason,
          date_extend,
          sent_to,
          user 
      });

      await alert.save();
      res.status(200).json({ message: 'Extend request sent!' });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to create alert' });
  }
};



