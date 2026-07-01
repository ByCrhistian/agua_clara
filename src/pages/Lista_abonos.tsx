import React, { useState } from 'react';
import { Form, message } from 'antd';
import Tabla from "../components/Tabla";
import BotonAgregar from "../components/Boton_agregar";
import Modal from "../components/Modal";
import InputFormularios from "../components/InpurtFormularios";

function Abonos() {
 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();


  const handleGuardar = () => {
    form.validateFields()
      .then((valores) => {
        
        console.log("Abono listo para MySQL:", valores);
        
        message.success("¡Abono registrado con éxito!");
        form.resetFields(); 
        setIsModalOpen(false); 
      })
      .catch((error) => console.log("Validación fallida:", error));
  };

 
  const columnasAbonos = [
    {
      title: 'Cliente / Concepto',
      dataIndex: 'cliente',
      key: 'cliente',
      className: 'font-bold text-[#01042B]',
    },
    {
      title: 'Monto Abonado',
      dataIndex: 'monto',
      key: 'monto',
      className: 'font-bold text-[#01042B]',
    },
    {
      title: 'Método de Pago',
      dataIndex: 'metodo',
      key: 'metodo',
      className: 'font-bold text-[#01042B]',
    },
  ];

  // Estos son datos temporale no son de la base de datos todavia
  const datosAbonos = Array.from({ length: 5 }, (_, index) => ({
    key: index.toString(),
    cliente: 'Distribuidora San José',
    monto: '$150',
    metodo: 'Efectivo',
  }));

  return (
    <>
      <h1 className="text-4xl font-bold mb-4">Abonos</h1>
      <p className="mb-4 text-gray-600">Aquí puedes administrar el historial y registro de abonos.</p>

    
      <Tabla columnas={columnasAbonos} datos={datosAbonos} />

      
      <BotonAgregar onClick={() => setIsModalOpen(true)}>
        Registrar Abono
      </BotonAgregar>

      
      <Modal
        titulo="Registrar Nuevo Abono"
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); form.resetFields(); }}
        onGuardar={handleGuardar}
      >
        <Form form={form} layout="vertical">
          
          <InputFormularios
            label="Cliente o Ruta"
            name="cliente"
            placeholder="Ej. Tiendita La Esquina o Ruta 1"
            required
          />

          <InputFormularios
            label="Monto del Abono"
            name="monto"
            placeholder="Ej. 150"
            type="number"
            required
          />

          <InputFormularios
            label="Método de Pago / Referencia"
            name="metodo"
            placeholder="Ej. Efectivo, Transferencia"
            required
          />

        </Form>
      </Modal>
    </>
  );
}

export default Abonos;