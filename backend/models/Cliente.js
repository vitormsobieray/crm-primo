const db = require("../config/database");

const Cliente = {
  async listByUser({ userId, page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    const countResult = await db.query("SELECT COUNT(*)::int AS total FROM clientes WHERE user_id = $1", [userId]);
    const total = countResult.rows[0]?.total || 0;

    const result = await db.query(
      `SELECT id, nome, email, telefone, empresa, cargo, status, notas, created_at, updated_at, ultimo_contato
       FROM clientes
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    return { clientes: result.rows, total, pages: Math.ceil(total / limit) || 1 };
  },

  async findById({ id, userId }) {
    const result = await db.query(
      `SELECT id, user_id, nome, email, telefone, empresa, cargo, status, notas, created_at, updated_at, ultimo_contato
       FROM clientes WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
    return result.rows[0];
  },

  async create({ userId, nome, email, telefone, empresa, cargo, notas, status }) {
    const result = await db.query(
      `INSERT INTO clientes (user_id, nome, email, telefone, empresa, cargo, notas, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING id`,
      [userId, nome, email, telefone, empresa || null, cargo || null, notas || null, status]
    );
    return result.rows[0];
  },

  async update({ id, userId, nome, email, telefone, empresa, cargo, notas, status }) {
    const result = await db.query(
      `UPDATE clientes
       SET nome = $1, email = $2, telefone = $3, empresa = $4, cargo = $5, notas = $6, status = $7, updated_at = NOW()
       WHERE id = $8 AND user_id = $9
       RETURNING id, user_id, nome, email, telefone, empresa, cargo, status, notas, created_at, updated_at, ultimo_contato`,
      [nome, email, telefone, empresa || null, cargo || null, notas || null, status, id, userId]
    );
    return result.rows[0];
  },

  async remove({ id, userId }) {
    const result = await db.query("DELETE FROM clientes WHERE id = $1 AND user_id = $2 RETURNING id", [id, userId]);
    return result.rows[0];
  },

  async search({ userId, q }) {
    const result = await db.query(
      `SELECT id, nome, email, telefone, empresa, cargo, status, notas, created_at, updated_at, ultimo_contato
       FROM clientes
       WHERE user_id = $1 AND nome ILIKE $2
       ORDER BY nome ASC`,
      [userId, `%${q}%`]
    );
    return result.rows;
  },

  async resumo(userId) {
    const [totalClientes, porStatus, cadastrosMes, clientePrincipal] = await Promise.all([
      db.query("SELECT COUNT(*)::int AS total FROM clientes WHERE user_id = $1", [userId]),
      db.query(
        `SELECT status, COUNT(*)::int AS total
         FROM clientes
         WHERE user_id = $1
         GROUP BY status`,
        [userId]
      ),
      db.query(
        `SELECT COUNT(*)::int AS total
         FROM clientes
         WHERE user_id = $1
           AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NOW())`,
        [userId]
      ),
      db.query(
        `SELECT id, nome, LENGTH(COALESCE(notas, '')) AS interacoes
         FROM clientes
         WHERE user_id = $1
         ORDER BY interacoes DESC, updated_at DESC
         LIMIT 1`,
        [userId]
      ),
    ]);

    return {
      totalClientes: totalClientes.rows[0]?.total || 0,
      porStatus: porStatus.rows,
      cadastrosMes: cadastrosMes.rows[0]?.total || 0,
      clientePrincipal: clientePrincipal.rows[0] || null,
    };
  },
};

module.exports = Cliente;
