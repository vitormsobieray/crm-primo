import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/client";
import { useAuthStore } from "../store/authStore";

function LoginPage() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      setAuth({ token: data.token, user: { id: data.userId, name: data.name } });
      toast.success("Login efetuado com sucesso.");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Falha no login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="authWrap">
      <form className="card authCard" onSubmit={onSubmit}>
        <h1>Entrar no CRM</h1>
        <label>
          Email
          <input name="email" type="email" required value={form.email} onChange={onChange} />
        </label>
        <label>
          Senha
          <input name="password" type="password" required value={form.password} onChange={onChange} />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
        <p>
          Nao possui conta? <Link to="/register">Registrar</Link>
        </p>
      </form>
    </section>
  );
}

export default LoginPage;
