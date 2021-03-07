const router = require("express").Router();
const { route } = require(".");
const adminController = require("../controller/admin_controller");

router.get("/dashboard", adminController.viewDashboard);

router.get("/category", adminController.viewCategory);
router.post("/category", adminController.addCategory);
router.put("/category", adminController.editCategory);
router.delete("/category/:id", adminController.deleteCategory);

router.get("/bank", adminController.viewBank);

router.get("/item", adminController.viewitem);

router.get("/booking", adminController.viewBooking);

module.exports = router;
