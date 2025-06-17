const tourManagementServices = require("../../services/admin/tourManagementServices");

const approveTourById = async (req, res) => {
  try {
    const tourId = req.params.id;
    await tourManagementServices.approveTourById(tourId);
    res.status(200).json({ message: "Duyệt tour thành công" });
  } catch (error) {
    console.error("Lỗi khi duyệt tour:", error);
    res.status(500).json({ error: error.message });
  }
};

const rejectTourById = async (req, res) => {
  try {
    const tourId = req.params.id;
    await tourManagementServices.rejectTourById(tourId);
    res.status(200).json({ message: "Từ chối tour thành công" });
  } catch (error) {
    console.error("Lỗi khi từ chối tour:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateTourStatus = async (req, res) => {
  try {
    await tourManagementServices.updateTourStatus();
    res.status(200).json({ message: "Cập nhật trạng thái tour thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getToursByStatusAndPage = async (req, res) => {
  const { page, pageSize } = req.query;
  const tours = await tourManagementServices.getToursByStatusAndPage(page, pageSize);
  res.status(200).json(tours);
};

module.exports = { approveTourById, rejectTourById, updateTourStatus, getToursByStatusAndPage };