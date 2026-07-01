import React, { useState } from 'react';
import { Form, message } from 'antd';
import Tabla from "../components/Tabla";
import BotonAgregar from "../components/Boton_agregar";
import Modal from "../components/Modal";
import InputFormularios from "../components/InpurtFormularios";

function Lista_insumos() {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();


  const handleGuardar = () => {
    form.validateFields()
      .then((valores) => {
        // Listo para armar las consultas aqui INSERT INTO insumos en el futuro
        console.log("Insumo listo para MySQL:", valores);
        
        message.success("¡Insumo registrado con éxito!");
        form.resetFields(); 
        setIsModalOpen(false); 
      })
      .catch((error) => console.log("Validación fallida:", error));
  };

  
  const columnasInsumos = [
    {
      title: 'Insumo',
      dataIndex: 'nombre',
      key: 'nombre',
      className: 'font-bold text-[#01042B]',
    },
    {
      title: 'Cantidad',
      dataIndex: 'cantidad',
      key: 'cantidad',
      className: 'font-bold text-[#01042B]',
    },
    {
      title: 'Proveedor',
      dataIndex: 'proveedor',
      key: 'proveedor',
      className: 'font-bold text-[#01042B]',
    },
  ];

  const datosInsumos = Array.from({ length: 5 }, (_, index) => ({
    key: index.toString(),
    nombre: 'Tapas Azules',
    cantidad: '500 pzas',
    proveedor: 'Proveedor Local',
  }));

  return (
    <>
      <h1 className="text-4xl font-bold mb-4">Lista de Insumos</h1>
      <p className="mb-4 text-gray-600">Esta es la lista de insumos.</p>

    
      <Tabla columnas={columnasInsumos} datos={datosInsumos} />

     
      <BotonAgregar onClick={() => setIsModalOpen(true)}>
        Agregar insumo
      </BotonAgregar>

      
      <Modal
        titulo="Registrar Nuevo Insumo"
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); form.resetFields(); }}
        onGuardar={handleGuardar}
      >
        <Form form={form} layout="vertical">
          
          <InputFormularios
            label="Nombre del Insumo"
            name="nombre"
            placeholder="Ej. Tapas, Sellos, Botellones"
            required
          />

          <InputFormularios
            label="Cantidad"
            name="cantidad"
            placeholder="Ej. 100"
            type="number"
            required
          />

          <InputFormularios
            label="Proveedor"
            name="proveedor"
            placeholder="Ingresa el nombre del proveedor"
          />

        </Form>
      </Modal>
    </>
  );
}

export default Lista_insumos;