import React from 'react';
import Tabla from "../components/Tabla";
import Boton_agregar from "../components/Boton_agregar";

function Viajes() {
  
  // Aqui es donde definimos las columnas que va a haber en la tabla de adeudos
  const columnasViajes = [
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
      className: 'font-bold text-[#01042B]',
    },
    {
      title: 'Acción',
      dataIndex: 'accion',
      key: 'accion',
      render: () => <span className="font-bold text-[#01042B] cursor-pointer hover:underline">Ver Más</span>,
    },
    {
      title: 'Monto',
      dataIndex: 'monto',
      key: 'monto',
      className: 'font-bold text-[#01042B]',
    },
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      key: 'fecha',
      className: 'font-bold text-[#01042B] text-right',
    },
  ];

  // 2. Definimos los datos de prueba (7 registros como tenías originalmente)
  const datosViajes = Array.from({ length: 5 }, (_, index) => ({
    key: index.toString(),
    nombre: 'Viaje 1',
    monto: '$32',
    fecha: '01/Jun/2026',
  }));

  return (
    <>  
      <h1 className="text-4xl font-bold mb-4">Viajes</h1>
     
      
      {/* 3. Inyectamos las columnas y los datos a tu componente Tabla */}
      <Tabla columnas={columnasViajes} datos={datosViajes} />
      
      <Boton_agregar>Agregar viaje</Boton_agregar>
    </>
  );
}

export default Viajes;