const express = require("express");
const controller = require("../controllers/controller");
const validation = require("../middleware/validation");
const validationRules = require("../middleware/validationRules");

const router = express.Router();

router.get("/", controller.slide);
router.post("/changeSlide", controller.changeSlide);
router.post("/deleteItem", controller.deleteItem);
router.post("/closeProject", controller.closeProject);
router.post("/", validationRules, validation, controller.addInput);

module.exports = router;
