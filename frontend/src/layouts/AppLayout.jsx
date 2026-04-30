import { NavLink, Outlet, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

function AppLayout() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Sessao encerrada.");
    navigate("/login");
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>CRM Primo</h2>
        <nav>
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/relatorios">Relatorios</NavLink>
        </nav>
      </aside>

      <main className="content">
        <header className="header">
          <div>Ola, {user?.name || "Usuario"}</div>
          <button type="button" className="danger" onClick={handleLogout}>
            Logout
          </button>
        </header>
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
