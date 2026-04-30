import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/client";

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error("As senhas nao conferem.");
    setLoading(true);
    try {
      await api.post("/auth/register", { name: form.name, email: form.email, password: form.password });
      toast.success("Conta criada com sucesso.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Falha no registro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="authWrap">
      <form className="card authCard" onSubmit={onSubmit}>
        <h1>Criar conta</h1>
        <label>
          Nome
          <input name="name" required value={form.name} onChange={onChange} />
        </label>
        <label>
          Email
          <input name="email" type="email" required value={form.email} onChange={onChange} />
        </label>
        <label>
          Senha
          <input name="password" type="password" minLength={6} required value={form.password} onChange={onChange} />
        </label>
        <label>
          Confirmar senha
          <input
            name="confirmPassword"
            type="password"
            minLength={6}
            required
            value={form.confirmPassword}
            onChange={onChange}
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Criando..." : "Registrar"}
        </button>
        <p>
          Ja possui conta? <Link to="/login">Entrar</Link>
        </p>
      </form>
    </section>
  );
}

export default RegisterPage;
