import React from 'react';
import { Table, Select } from 'antd';
import { FaSlidersH } from "react-icons/fa";
import { AnyObject } from 'antd/es/_util/type';
import { ColumnsType } from 'antd/es/table';

interface TablaGenericaProps {
  columnas: ColumnsType<AnyObject>;
  datos: AnyObject[];
}

export default function TablaGenerica({ columnas, datos }: TablaGenericaProps) {
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      
      {/* Aqui esta donde va el filtro wey */}
      <div className="bg-[#0A0D2C] rounded-t-xl p-3 flex justify-between items-center shadow-md">
        <Select
          defaultValue="dia"
          className="w-28"
          suffixIcon={<FaSlidersH className="text-[#01042B]" />}
          options={[
            { value: 'dia', label: <span className="font-bold text-[#01042B]">Día</span> },
            { value: 'mes', label: 'Mes' },
            { value: 'ano', label: 'Año' }
          ]}
        />
      </div>

      
      <div className="shadow-lg rounded-b-xl overflow-hidden border border-slate-200 bg-white p-2">
        <Table
          columns={columnas}
          dataSource={datos}
          showHeader={true}
          pagination={{
            pageSize: 5,                // Máximo 5 filas
            position: ['bottomCenter'], // Centra los números abajo
            showSizeChanger: false      // Mantiene limpio el diseño
          }}
          // Colores intercalados alternando filas de forma directa
          rowClassName={(_, index) => index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}
        />
      </div>

    </div>
  );
}