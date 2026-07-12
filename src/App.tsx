import React from "react";
import { ConfigProvider } from "antd";
import esEs from 'antd/locale/es_ES'; 
import { createBrowserRouter, RouterProvider } from "react-router-dom"; 
import Menu from "./components/Menu";
import Viajes from "./pages/Viajes";
import Lista_adeudos from "./pages/Lista_adeudos";
import Lista_empleados from "./pages/Lista_empleados";
import Lista_insumos from "./pages/Lista_insumos";
import Lista_abonos from "./pages/Lista_abonos";
import Lista_pagados from "./pages/Lista_pagados";
import ProteccionRutas from "./auth/ProteccionRutas";
import Login from "./pages/Login";
import Corte_de_caja from "./pages/Corte_de_caja";


function PanelContenedor({ pagina }: { pagina: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      
      <Menu />
      <main className="flex-1 p-6 lg:pl-72">
        {pagina}
      </main>
    </div>
  );
}

function App() {
  const router = createBrowserRouter([
    {
      path: "/Login",
      element: <Login />
    },
    {
      path: "/Viajes",
      element: (
        <ProteccionRutas>
          <PanelContenedor pagina={<Viajes/>} />
        </ProteccionRutas>
      )
    },
    {
      path: "/",
      element: (
        <ProteccionRutas>
          <PanelContenedor pagina={<Corte_de_caja />} />
        </ProteccionRutas>
      )    
    },
    {
      path: "/Lista_adeudos",
      element: (
        <ProteccionRutas>
          <PanelContenedor pagina={<Lista_adeudos />} />
        </ProteccionRutas>
      )
    },
    {
      path: "/Lista_insumos",
      element: (
        <ProteccionRutas>
          <PanelContenedor pagina={<Lista_insumos />} />
        </ProteccionRutas>
      )
    },
    {
      path: "/Lista_abonos",
      element: (
        <ProteccionRutas>
          <PanelContenedor pagina={<Lista_abonos />} />
        </ProteccionRutas>
      )
    },
    {
      path: "/Lista_pagados",
      element: (
        <ProteccionRutas>
          <PanelContenedor pagina={<Lista_pagados />} />
        </ProteccionRutas>
      )
    },
    {
      path: "/Lista_empleados",
      element: (
        <ProteccionRutas>
          <PanelContenedor pagina={<Lista_empleados />} />
        </ProteccionRutas>
      )
    }
  ]);

  return (
    <ConfigProvider locale={esEs}>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;