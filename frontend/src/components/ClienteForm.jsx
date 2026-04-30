import { useEffect, useState } from "react";

const defaults = {
  nome: "",
  email: "",
  telefone: "",
  empresa: "",
  cargo: "",
  notas: "",
  status: "Ativo",
};

function ClienteForm({ initialData, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(defaults);

  useEffect(() => {
    if (initialData) {
      setForm({
        nome: initialData.nome || "",
        email: initialData.email || "",
        telefone: initialData.telefone || "",
        empresa: initialData.empresa || "",
        cargo: initialData.cargo || "",
        notas: initialData.notas || "",
        status: initialData.status || "Ativo",
      });
    } else {
      setForm(defaults);
    }
  }, [initialData]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={submit} className="card formGrid">
      {["nome", "email", "telefone", "empresa", "cargo"].map((field) => (
        <label key={field}>
          {field[0].toUpperCase() + field.slice(1)}
          <input
            name={field}
            value={form[field]}
            onChange={handleChange}
            required={["nome", "email", "telefone"].includes(field)}
            type={field === "email" ? "email" : "text"}
          />
        </label>
      ))}
      <label>
        Status
        <select name="status" value={form.status} onChange={handleChange}>
          <option>Ativo</option>
          <option>Inativo</option>
          <option>Em negociação</option>
        </select>
      </label>
      <label className="full">
        Notas/Observacoes
        <textarea name="notas" rows="4" value={form.notas} onChange={handleChange} />
      </label>
      <div className="actions full">
        <button type="button" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}

export default ClienteForm;
