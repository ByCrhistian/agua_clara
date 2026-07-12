import { useState } from "react";
import {
  MdDateRange,
  MdLocalGroceryStore,
  MdAccountBalanceWallet,
  MdCleanHands,
  MdShoppingBasket,
  MdPerson,
} from "react-icons/md";
import { FaBars, FaSignOutAlt, FaTimes } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";


export default function Menu() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [abierto, setAbierto] = useState(false);
  const location = useLocation();

  const cerrarSesion = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const opciones = [
    {
      nombre: "Viajes",
      ruta: "/Viajes",
      icono: <MdDateRange size={20} />,
      roles: ["Administrador", "Vendedor"],
    },
     {
      nombre: "Corte de Caja",
      ruta: "/Corte_de_caja",
      icono: <MdLocalGroceryStore size={20} />,
      roles: ["Administrador"],
    },
    {
      nombre: "Lista de Adeudos",
      ruta: "/Lista_adeudos",
      icono: <MdLocalGroceryStore size={20} />,
      roles: ["Administrador", "Vendedor"],
    },
    {
      nombre: "Abonos",
      ruta: "/Lista_abonos",
      icono: <MdAccountBalanceWallet size={20} />,
      roles: ["Administrador", "Vendedor"],
    },
    {
      nombre: "Pagados",
      ruta: "/Lista_pagados",
      icono: <MdCleanHands size={20} />,
      roles: ["Administrador", "Vendedor"],
    },
    {
      nombre: "Insumos",
      ruta: "/Lista_insumos",
      icono: <MdShoppingBasket size={20} />,
      roles: ["Administrador", "Vendedor"],
    },
    {
      nombre: "Empleados",
      ruta: "/Lista_empleados",
      icono: <MdPerson size={20} />,
      roles: ["Administrador"],
    },
  ];

  const opcionesFiltradas = opciones.filter((opcion) =>
    opcion.roles.includes(user?.rol ?? "")
  );

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 text-white bg-sky-500 p-2.5 rounded-xl shadow-lg hover:bg-sky-600 transition-all"
        onClick={() => setAbierto(!abierto)}
      >
        {abierto ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {abierto && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setAbierto(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-[#01042B] text-white p-5 z-40 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          abierto ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="mb-6 flex-shrink-0">
            <div className="bg-[#181A36] rounded-xl p-4 flex items-center justify-center shadow-inner">
              <img
                src="/src/assets/Logo.png"
                alt="Logo Agua Clara"
                className="w-24 h-24 object-contain target-logo"
              />
            </div>
          </div>

          <nav className="space-y-1.5 flex-1">
            {opcionesFiltradas.map((opcion) => {
              const activo = location.pathname === opcion.ruta;

              return (
                <Link
                  key={opcion.ruta}
                  to={opcion.ruta}
                  onClick={() => setAbierto(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    activo
                      ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
                      : "text-slate-300 hover:bg-[#149CFE] hover:text-white"
                  }`}
                >
                  <span className={activo ? "text-white" : "text-slate-400"}>
                    {opcion.icono}
                  </span>
                  <span className="text-sm">{opcion.nombre}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-800 flex-shrink-0">
          <button
            onClick={cerrarSesion}
            className="w-full bg-[#181A36] text-rose-400 hover:bg-rose-500 hover:text-white px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-md"
          >
            <FaSignOutAlt size={16} />
            <span>Salir</span>
          </button>
        </div>
      </aside>
    </>
  );
}