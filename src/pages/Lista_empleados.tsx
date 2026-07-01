import React, { useState } from 'react';
import { Form, message } from 'antd';
import Tabla from "../components/Tabla";
import BotonAgregar from "../components/Boton_agregar";
import Modal from "../components/Modal";
import InputFormularios from "../components/InpurtFormularios";

function Lista_empleados() {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();


  const handleGuardar = () => {
    form.validateFields()
      .then((valores) => {
        console.log("Empleado listo para MySQL:", valores);
        message.success("¡Empleado agregado con éxito!");
        form.resetFields();
        setIsModalOpen(false);
      })
      .catch((error) => console.log("Validación fallida:", error));
  };

  const columnasEmpleados = [
    {
      title: 'Nombre empleado',
      dataIndex: 'nombre',
      key: 'nombre',
      className: 'font-bold text-[#01042B]',
    },
 
    {
      title: 'Puesto',
      dataIndex: 'puesto',
      key: 'puesto',
      className: 'font-bold text-[#01042B]',
    },
  ];

  const datosEmpleados = Array.from({ length: 5 }, (_, index) => ({
    key: index.toString(),
    nombre: 'Empleado 1',
    puesto: 'Operador',
  }));

  return (
    <>
      <h1 className="text-4xl font-bold mb-4">Lista de Empleados</h1>
      <p className="mb-4 text-gray-600">Esta es la lista de empleados.</p>

      <Tabla columnas={columnasEmpleados} datos={datosEmpleados} />
      
      
      <BotonAgregar onClick={() => setIsModalOpen(true)}>
        Agregar empleado
      </BotonAgregar>

    
      <Modal
        titulo="Registrar Nuevo Empleado"
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); form.resetFields(); }}
        onGuardar={handleGuardar}
      >
        <Form form={form} layout="vertical">
          
          
          <InputFormularios
            label="Nombre Completo"
            name="nombre"
            placeholder="Ingresa el nombre del empleado"
            required
          />

          <InputFormularios
            label="Puesto"
            name="puesto"
            placeholder="Ej. Administrador, Chofer"
            required
          />

        </Form>
      </Modal>
    </>
  );
}

export default Lista_empleados;