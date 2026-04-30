const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");

const signToken = (user) =>
  jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET, {
    expiresIn: "8h",
  });

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { name, email, password } = req.body;
    const existing = await User.findByEmail(email);
    if (existing) return res.status(409).json({ message: "Email ja cadastrado." });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });
    return res.status(201).json({ message: "Conta criada com sucesso.", userId: user.id });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao registrar usuario.", error: error.message });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user) return res.status(401).json({ message: "Credenciais invalidas." });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: "Credenciais invalidas." });

    const token = signToken(user);
    return res.json({ token, userId: user.id, name: user.name });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao efetuar login.", error: error.message });
  }
};

exports.logout = async (_req, res) => res.json({ message: "Logout realizado no cliente." });
