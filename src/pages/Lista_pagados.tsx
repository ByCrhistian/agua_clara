import React from 'react';
import { Tag } from 'antd';
import Tabla from "../components/Tabla";

function Lista_pagados() {

  // Columnas limpias para mostrar el historial de cuentas cobradas con éxito
  const columnasPagados = [
    {
      title: 'Nombre Cliente',
      dataIndex: 'nombre_cliente',
      key: 'nombre_cliente',
      className: 'font-bold text-[#01042B]',
    },
    {
      title: 'Garrafones Pendientes',
      dataIndex: 'garrafones_deben',
      key: 'garrafones_deben',
      render: (cant: number) => <Tag color="green" className="font-bold">{cant} pzas</Tag>
    },
    {
      title: 'Monto Liquidado',
      dataIndex: 'monto_pagado',
      key: 'monto_pagado',
      className: 'font-bold text-green-600',
      render: (monto: number) => <span>${monto.toFixed(2)}</span>
    },
    {
      title: 'Fecha de Liquidación',
      dataIndex: 'fecha',
      key: 'fecha',
      className: 'text-gray-600 font-medium',
    },
    {
      title: 'Estatus',
      dataIndex: 'estatus_adeudo',
      key: 'estatus_adeudo',
      render: (estatus: string) => (
        <Tag color="green" className="font-semibold rounded px-2 py-0.5">
          {estatus}
        </Tag>
      )
    },
  ];

  // Mock de datos que simula lo que traerá MySQL (solo cuentas en $0 y Liquidadas)
  const datosPagados = [
    {
      key: '1',
      nombre_cliente: 'Tiendita El Esquinazo',
      garrafones_deben: 0,
      monto_pagado: 320.00,
      fecha: '01/Jul/2026',
      estatus_adeudo: 'Liquidado',
    },
    {
      key: '2',
      nombre_cliente: 'Purificadora Cliente Frecuente',
      garrafones_deben: 0,
      monto_pagado: 150.00,
      fecha: '30/Jun/2026',
      estatus_adeudo: 'Liquidado',
    },
  ];

  return (
    <>  
      <h1 className="text-4xl font-bold mb-4">Historial de Cuentas Liquidadas</h1>
      <p className="mb-4 text-gray-600">Registro de clientes que han saldado totalmente sus cuentas y devolvieron sus envases.</p>
     
      <Tabla columnas={columnasPagados} datos={datosPagados} />
    
    </>
  );
}

export default Lista_pagados;