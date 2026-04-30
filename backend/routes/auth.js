const express = require("express");
const { body } = require("express-validator");
const controller = require("../controllers/authController");

const router = express.Router();

router.post(
  "/register",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Nome obrigatorio."),
    body("email").isEmail().withMessage("Email invalido."),
    body("password").isLength({ min: 6 }).withMessage("Senha deve ter ao menos 6 caracteres."),
  ],
  controller.register
);

router.post(
  "/login",
  [body("email").isEmail().withMessage("Email invalido."), body("password").notEmpty().withMessage("Senha obrigatoria.")],
  controller.login
);

router.post("/logout", controller.logout);

module.exports = router;
