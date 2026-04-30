const bcrypt = require("bcryptjs");
const db = require("../config/database");

async function seed() {
  const email = process.env.SEED_USER_EMAIL || "admin@crm.local";
  const password = process.env.SEED_USER_PASSWORD || "123456";
  const name = process.env.SEED_USER_NAME || "Admin CRM";

  const existing = await db.query("SELECT id FROM users WHERE email = $1", [email]);
  if (existing.rows.length) return;

  const hash = await bcrypt.hash(password, 10);
  await db.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3)", [name, email, hash]);
  console.log(`Usuario de teste criado: ${email} / ${password}`);
}

module.exports = seed;
