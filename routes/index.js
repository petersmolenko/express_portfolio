var express = require("express");
var router = express.Router();
const controllers = require("../controllers");

router.get("/", controllers.index);
router.post("/", controllers.contact);
router.get("/index", controllers.index);
router.get("/login", controllers.login);
router.post("/login", controllers.auth);
router.get("/admin", controllers.admin);
router.post("/admin/skills", controllers.skills);
router.post("/admin/upload", controllers.products);
module.exports = router;
