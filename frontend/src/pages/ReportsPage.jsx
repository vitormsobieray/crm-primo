import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import toast from "react-hot-toast";
import api from "../api/client";
import LoadingSpinner from "../components/LoadingSpinner";

function ReportsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/relatorios/resumo");
        setData(res.data);
      } catch {
        toast.error("Erro ao carregar relatorios.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!data) return null;

  return (
    <section className="card">
      <h2>Relatorios</h2>
      <p>Total de clientes: {data.totalClientes}</p>
      <p>Clientes cadastrados este mes: {data.cadastrosMes}</p>
      <p>
        Cliente principal: {data.clientePrincipal?.nome || "-"} ({data.clientePrincipal?.interacoes || 0} interacoes)
      </p>

      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <BarChart data={data.porStatus}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default ReportsPage;
