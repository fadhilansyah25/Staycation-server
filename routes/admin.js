const router = require("express").Router();
const adminController = require("../controller/admin_controller");
const { upload, uploadMultiple} = require('../middleware/multer');
const auth = require('../middleware/auth');

router.get("/signin", adminController.viewSignin);
router.post("/signin", adminController.actionSignin);
router.use(auth);
router.get("/logout", adminController.actionLogout);
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
router.delete("/bank/:id", adminController.deleteBank);

// end point Item
router.get("/item", adminController.viewItem);
router.post("/item", uploadMultiple, adminController.addItem);
router.get("/item/show-image/:id", adminController.showImageItem);
router.get("/item/edit-item/:id", adminController.showEditItem);
router.put("/item/:id", uploadMultiple, adminController.editItem);
router.delete("/item/:id/delete", adminController.deleteItem);

// end point show detail item
router.get("/item/show-detail-item/:itemId", adminController.viewDetailItem);
// end point detail item
router.post("/item/feature/add", upload, adminController.addFeatureItem);
router.put("/item/feature/edit", upload, adminController.editFeatureItem);
router.delete("/item/feature/delete/:id", adminController.deleteFeatureItem);

// end point activiy item
router.post("/item/activity/add", upload, adminController.addActivityItem);
router.put("/item/activity/edit", upload, adminController.editActivityItem);
router.delete("/item/activity/delete/:id", adminController.deleteActivityItem);


router.get("/booking", adminController.viewBooking);

module.exports = router;
