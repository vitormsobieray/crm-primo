import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/client";
import ClienteForm from "../components/ClienteForm";
import LoadingSpinner from "../components/LoadingSpinner";
import { formatDate } from "../utils/date";

function DashboardPage() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadClientes = async (targetPage = page) => {
    setLoading(true);
    try {
      const endpoint = query ? `/clientes/search?q=${encodeURIComponent(query)}` : `/clientes?page=${targetPage}&limit=10`;
      const { data } = await api.get(endpoint);
      setClientes(data.clientes);
      if (!query) setPages(data.pages || 1);
    } catch {
      toast.error("Erro ao carregar clientes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClientes(page);
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  const saveCliente = async (payload) => {
    setSaving(true);
    try {
      if (editing?.id) await api.put(`/clientes/${editing.id}`, payload);
      else await api.post("/clientes", payload);
      toast.success("Cliente salvo com sucesso.");
      setShowForm(false);
      setEditing(null);
      loadClientes(page);
    } catch {
      toast.error("Erro ao salvar cliente.");
    } finally {
      setSaving(false);
    }
  };

  const deleteCliente = async (id) => {
    if (!window.confirm("Deseja realmente deletar este cliente?")) return;
    try {
      await api.delete(`/clientes/${id}`);
      toast.success("Cliente deletado.");
      loadClientes(page);
    } catch {
      toast.error("Erro ao deletar cliente.");
    }
  };

  return (
    <section>
      <div className="toolbar">
        <input
          placeholder="Buscar por nome"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && loadClientes(1)}
        />
        <button type="button" onClick={() => loadClientes(1)}>
          Buscar
        </button>
        <button type="button" onClick={() => { setShowForm(true); setEditing(null); }}>
          + Novo Cliente
        </button>
      </div>

      {showForm && (
        <ClienteForm
          initialData={editing}
          onSubmit={saveCliente}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
          loading={saving}
        />
      )}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Cadastro</th>
                <th>Ultimo contato</th>
                <th>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td><Link to={`/cliente/${cliente.id}`}>{cliente.nome}</Link></td>
                  <td>{cliente.email}</td>
                  <td>{cliente.telefone}</td>
                  <td>{formatDate(cliente.created_at)}</td>
                  <td>{formatDate(cliente.ultimo_contato)}</td>
                  <td>
                    <button type="button" onClick={() => { setEditing(cliente); setShowForm(true); }}>
                      Editar
                    </button>
                    <button type="button" className="danger" onClick={() => deleteCliente(cliente.id)}>
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!query && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} type="button">
            Anterior
          </button>
          <span>
            Pagina {page} de {pages}
          </span>
          <button disabled={page >= pages} onClick={() => setPage((p) => p + 1)} type="button">
            Proxima
          </button>
        </div>
      )}
    </section>
  );
}

export default DashboardPage;
