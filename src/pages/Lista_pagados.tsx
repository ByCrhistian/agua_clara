import React, { useState, useEffect } from 'react';
import { Tag } from 'antd';
import Tabla from "../components/Tabla";

function Lista_pagados() {
  const [datosPagados, setDatosPagados] = useState<any[]>([]);

  const obtenerPagados = async () => {
    try {
      const res = await fetch('http://localhost:5002/obtenerPagados');
      const data = await res.json();
      setDatosPagados(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar pagados:", err);
      setDatosPagados([]);
    }
  };

  useEffect(() => {
    obtenerPagados();
  }, []);

  const columnasPagados = [
    { title: 'Nombre Cliente', dataIndex: 'nombre_cliente', key: 'nombre_cliente', className: 'font-bold text-[#01042B]' },
    { title: 'Garrafones Pendientes', dataIndex: 'garrafones_deben', key: 'garrafones_deben', render: (cant: number) => <Tag color="green">{cant} pzas</Tag> },
    { title: 'Monto Liquidado', dataIndex: 'monto_pagado', key: 'monto_pagado', render: (monto: number) => <span>${Number(monto || 0).toFixed(2)}</span> },
    { title: 'Fecha de Liquidación', dataIndex: 'fecha', key: 'fecha' },
    { title: 'Estatus', dataIndex: 'estatus_adeudo', key: 'estatus_adeudo', render: (e: string) => <Tag color="green">{e}</Tag> },
  ];

  return (
    <>  
      <h1 className="text-4xl font-bold mb-4">Historial de Cuentas Liquidadas</h1>
      <p className="mb-4 text-gray-600">Registro de clientes que han saldado totalmente sus cuentas.</p>
      <Tabla columnas={columnasPagados} datos={datosPagados} />
    </>
  );
}

export default Lista_pagados;