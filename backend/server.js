require("dotenv").config();

const fs = require("node:fs");
const path = require("node:path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const db = require("./config/database");
const authRoutes = require("./routes/auth");
const clientesRoutes = require("./routes/clientes");
const relatoriosRoutes = require("./routes/relatorios");
const seed = require("./scripts/seed");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/relatorios", relatoriosRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Erro interno do servidor." });
});

async function bootstrap() {
  try {
    const sqlPath = path.join(__dirname, "scripts", "init.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");
    await db.pool.query(sql);
    await seed();
    app.listen(PORT, () => {
      console.log(`Backend executando na porta ${PORT}`);
    });
  } catch (error) {
    console.error("Falha ao iniciar backend:", error.message, error.stack);
    process.exit(1);
  }
}

bootstrap();
