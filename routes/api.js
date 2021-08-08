const router = require("express").Router();
const apiController = require("../controller/api_controller");
const { upload } = require("../middleware/multer");
const auth = require("../middleware/auth");

router.get("/landing-page", apiController.landingPage);
router.get("/details-page/:id", apiController.detailsPage);
router.post("/booking-page", upload, apiController.bookingPage);

module.exports = router;
