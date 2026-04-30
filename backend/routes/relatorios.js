const express = require("express");
const auth = require("../middleware/auth");
const { relatorio } = require("../controllers/clientesController");

const router = express.Router();

router.use(auth);
router.get("/resumo", relatorio);

module.exports = router;
