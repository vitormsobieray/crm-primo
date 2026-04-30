const { validationResult } = require("express-validator");
const Cliente = require("../models/Cliente");

exports.listar = async (req, res) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const data = await Cliente.listByUser({ userId: req.user.id, page, limit });
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao listar clientes.", error: error.message });
  }
};

exports.detalhe = async (req, res) => {
  try {
    const cliente = await Cliente.findById({ id: req.params.id, userId: req.user.id });
    if (!cliente) return res.status(404).json({ message: "Cliente nao encontrado." });
    return res.json({ cliente });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao obter cliente.", error: error.message });
  }
};

exports.criar = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const created = await Cliente.create({ userId: req.user.id, ...req.body });
    return res.status(201).json({ message: "Cliente criado com sucesso.", clienteId: created.id });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao criar cliente.", error: error.message });
  }
};

exports.atualizar = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const cliente = await Cliente.update({ id: req.params.id, userId: req.user.id, ...req.body });
    if (!cliente) return res.status(404).json({ message: "Cliente nao encontrado." });
    return res.json({ message: "Cliente atualizado com sucesso.", cliente });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao atualizar cliente.", error: error.message });
  }
};

exports.deletar = async (req, res) => {
  try {
    const deleted = await Cliente.remove({ id: req.params.id, userId: req.user.id });
    if (!deleted) return res.status(404).json({ message: "Cliente nao encontrado." });
    return res.json({ message: "Cliente deletado com sucesso." });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao deletar cliente.", error: error.message });
  }
};

exports.buscar = async (req, res) => {
  try {
    const q = req.query.q || "";
    const clientes = await Cliente.search({ userId: req.user.id, q });
    return res.json({ clientes });
  } catch (error) {
    return res.status(500).json({ message: "Erro na busca de clientes.", error: error.message });
  }
};

exports.relatorio = async (req, res) => {
  try {
    const resumo = await Cliente.resumo(req.user.id);
    return res.json(resumo);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao gerar relatorio.", error: error.message });
  }
};
