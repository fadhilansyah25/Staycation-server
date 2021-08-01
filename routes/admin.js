const router = require("express").Router();
const { route } = require(".");
const adminController = require("../controller/admin_controller");
const {upload} = require('../middleware/multer')

router.get("/dashboard", adminController.viewDashboard);
// end point Category
router.get("/category", adminController.viewCategory);
router.post("/category", adminController.addCategory);
router.put("/category", adminController.editCategory);
router.delete("/category/:id", adminController.deleteCategory);
// end point Bank
router.get("/bank", adminController.viewBank);
router.post("/bank", upload, adminController.addBank);
router.put("/bank", upload, adminController.editBank);
router.delete("/bank/:id", upload, adminController.deleteBank);

router.get("/item", adminController.viewitem);

router.get("/booking", adminController.viewBooking);

module.exports = router;
