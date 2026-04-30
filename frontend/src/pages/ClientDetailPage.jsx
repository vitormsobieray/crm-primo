import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/client";
import ClienteForm from "../components/ClienteForm";
import LoadingSpinner from "../components/LoadingSpinner";
import { formatDate } from "../utils/date";

function ClientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [nota, setNota] = useState("");

  const fetchCliente = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/clientes/${id}`);
      setCliente(data.cliente);
      setNota(data.cliente.notas || "");
    } catch {
      toast.error("Cliente nao encontrado.");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCliente();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const saveEdits = async (payload) => {
    await api.put(`/clientes/${id}`, payload);
    toast.success("Cliente atualizado.");
    setEditing(false);
    fetchCliente();
  };

  const saveNota = async () => {
    try {
      await api.put(`/clientes/${id}`, { ...cliente, notas: nota });
      toast.success("Notas atualizadas.");
      fetchCliente();
    } catch {
      toast.error("Falha ao atualizar notas.");
    }
  };

  const deleteCliente = async () => {
    if (!window.confirm("Deseja deletar este cliente?")) return;
    await api.delete(`/clientes/${id}`);
    toast.success("Cliente removido.");
    navigate("/");
  };

  if (loading) return <LoadingSpinner />;
  if (!cliente) return null;

  return (
    <section className="card">
      <h2>{cliente.nome}</h2>
      <p>Email: {cliente.email}</p>
      <p>Telefone: {cliente.telefone}</p>
      <p>Empresa: {cliente.empresa || "-"}</p>
      <p>Cargo: {cliente.cargo || "-"}</p>
      <p>Status: {cliente.status}</p>
      <p>Cadastro: {formatDate(cliente.created_at)}</p>
      <p>Ultimo contato: {formatDate(cliente.ultimo_contato)}</p>

      <label>
        Historico/Notas
        <textarea rows="4" value={nota} onChange={(e) => setNota(e.target.value)} />
      </label>

      <div className="actions">
        <button type="button" onClick={() => setEditing((v) => !v)}>
          {editing ? "Cancelar edicao" : "Editar"}
        </button>
        <button type="button" onClick={saveNota}>Salvar notas</button>
        <button type="button" className="danger" onClick={deleteCliente}>
          Deletar
        </button>
        <button type="button" onClick={() => navigate(-1)}>
          Voltar
        </button>
      </div>

      {editing && <ClienteForm initialData={cliente} onSubmit={saveEdits} onCancel={() => setEditing(false)} />}
    </section>
  );
}

export default ClientDetailPage;
