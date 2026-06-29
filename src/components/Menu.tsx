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
import { Link, useLocation } from "react-router-dom";
import Logo from "../assets/Logo.png";

export default function Menu() {
  const opciones = [
    { nombre: "Viajes", ruta: "/viajes", icono: <MdDateRange /> },
    {
      nombre: "Lista de Adeudos",
      ruta: "/lista_de_adeudos",
      icono: <MdLocalGroceryStore />,
    },
    {
      nombre: "Abonos",
      ruta: "/abonos",
      icono: <MdAccountBalanceWallet />,
    },
    {
      nombre: "Pagados",
      ruta: "/pagados",
      icono: <MdCleanHands />,
    },
    {
      nombre: "Insumos",
      ruta: "/insumos",
      icono: <MdShoppingBasket />,
    },
    {
      nombre: "Empleados",
      ruta: "/empleados",
      icono: <MdPerson />,
    },
  ];

  const [abierto, setAbierto] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Botón para celular */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 text-white bg-blue-600 p-2 rounded"
        onClick={() => setAbierto(!abierto)}
      >
        {abierto ? <FaTimes size={22} /> : <FaBars size={22} />}
      </button>

      {/* Fondo oscuro */}
      {abierto && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setAbierto(false)}
        />
      )}

      {/* Menú */}
      <aside
        className={`fixed top-0 left-0 h-screen w-100 bg-[#01042B] text-white p-5 z-40 transition-transform duration-300 ${
          abierto ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="mb-5">
          <div className="bg-[#181A36] rounded-xl p-5">
            <img
              src={Logo}
              alt="Logo"
              className="mx-auto w-60 h-60 object-contain"
            />
          </div>
        </div>

        {/* Opciones */}
        <nav className="space-y-2">
          {opciones.map((opcion) => (
            <Link
              key={opcion.ruta}
              to={opcion.ruta}
              onClick={() => setAbierto(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                location.pathname === opcion.ruta
                  ? "bg-sky-500 text-white"
                  : "text-white hover:bg-[#149CFE]"
              }`}
            >
              <span>{opcion.icono}</span>
              {opcion.nombre}
            </Link>
          ))}
        </nav>

        {/* Salir */}
        <button
          className="absolute bottom-8 left-5 bg-white text-black px-5 py-2 rounded font-semibold flex items-center gap-2"
        >
          <FaSignOutAlt />
          Salir
        </button>
      </aside>
    </>
  );
}