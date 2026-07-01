import React, { useState } from 'react';
import { Form, message } from 'antd';
import Tabla from "../components/Tabla";
import Boton_agregar from "../components/Boton_agregar";
import Modal from "../components/Modal";
import InputFormularios from "../components/InpurtFormularios"; 

function Viajes() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleGuardar = () => {
    form.validateFields()
      .then((valores) => {
        console.log("Datos listos para enviar a MySQL:", valores);
        message.success("¡Viaje agregado con éxito!");
        form.resetFields();
        setIsModalOpen(false);
      })
      .catch((error) => console.log("Validación fallida:", error));
  };

  const columnasViajes = [
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre', className: 'font-bold text-[#01042B]' },
    { title: 'Acción', dataIndex: 'accion', key: 'accion', render: () => <span className="font-bold text-[#01042B] cursor-pointer hover:underline">Ver Más</span> },
    { title: 'Monto', dataIndex: 'monto', key: 'monto', className: 'font-bold text-[#01042B]' },
    { title: 'Fecha', dataIndex: 'fecha', key: 'fecha', align: 'left' as const, className: 'font-bold text-[#01042B]' },
  ];

  const datosViajes = Array.from({ length: 5 }, (_, index) => ({
    key: index.toString(),
    nombre: 'Viaje 1',
    monto: '$32',
    fecha: '01/Jun/2026',
  }));

  return (
    <>  
      <h1 className="text-4xl font-bold mb-4">Viajes</h1>
      
      <Tabla columnas={columnasViajes} datos={datosViajes} />
      
      <Boton_agregar onClick={() => setIsModalOpen(true)}>
        Agregar viaje
      </Boton_agregar>

      
      <Modal
        titulo="Agregar Nuevo Viaje"
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); form.resetFields(); }}
        onGuardar={handleGuardar}
      >
        
        <Form form={form} layout="vertical">

          <InputFormularios
            label="Nombre del viaje"
            name="nombre"
            placeholder="Ingresa el nombre del viaje"
            required
          />
           
        </Form>
      </Modal>
    </>
  );
}

export default Viajes;