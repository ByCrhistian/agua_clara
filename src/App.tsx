import React from "react";
import { ConfigProvider } from "antd";
import esEs from 'antd/locale/es_ES'; 
import { createBrowserRouter, RouterProvider } from "react-router-dom"; 
import Menu from "./components/Menu";
import Viajes from "./pages/Viajes";
import Lista_adeudos from "./pages/Lista_adeudos";


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
      path: "/Viajes",
      
      element: <PanelContenedor pagina={<Viajes />} />
    },
    {
      path: "/",
      element: <PanelContenedor pagina={<Viajes />} />
    },
    {
      path: "/Lista_adeudos",
      element: <PanelContenedor pagina={<Lista_adeudos />} />
    }
  ]);

  return (
    <ConfigProvider locale={esEs}>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;