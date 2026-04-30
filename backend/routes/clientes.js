const express = require("express");
const { body } = require("express-validator");
const auth = require("../middleware/auth");
const controller = require("../controllers/clientesController");

const router = express.Router();

const clienteValidation = [
  body("nome").trim().isLength({ min: 2 }).withMessage("Nome obrigatorio."),
  body("email").isEmail().withMessage("Email invalido."),
  body("telefone").trim().isLength({ min: 8 }).withMessage("Telefone obrigatorio."),
  body("status").isIn(["Ativo", "Inativo", "Em negociação"]).withMessage("Status invalido."),
];

router.use(auth);
router.get("/", controller.listar);
router.get("/search", controller.buscar);
router.get("/relatorios/resumo", controller.relatorio);
router.get("/:id", controller.detalhe);
router.post("/", clienteValidation, controller.criar);
router.put("/:id", clienteValidation, controller.atualizar);
router.delete("/:id", controller.deletar);

module.exports = router;
