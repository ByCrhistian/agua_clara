import React, { useState, useEffect } from 'react';
import { Form, message, Tag, Input } from 'antd';
import Tabla from "../components/Tabla";
import Boton_agregar from "../components/Boton_agregar";
import Modal from "../components/Modal";
import InputFormularios from "../components/InpurtFormularios";
import SelectFormularios from "../components/SelectFormularios";

function Lista_adeudos() {
  const [isAdeudoModalOpen, setIsAdeudoModalOpen] = useState(false);
  const [isAbonoModalOpen, setIsAbonoModalOpen] = useState(false);
  const [isMasDeudaModalOpen, setIsMasDeudaModalOpen] = useState(false);
  
  const [datosAdeudos, setDatosAdeudos] = useState<any[]>([]);
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [selectedCliente, setSelectedCliente] = useState<any>(null);

  const [formAdeudo] = Form.useForm();
  const [formAbono] = Form.useForm();
  const [formMasDeuda] = Form.useForm();

  const obtenerAdeudos = async () => {
    try {
      const res = await fetch('http://localhost:5002/obtenerAdeudosActivos');
      if (!res.ok) throw new Error("Error en el servidor");
      const data = await res.json();
      setDatosAdeudos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar adeudos:", err);
      setDatosAdeudos([]);
    }
  };

  useEffect(() => {
    obtenerAdeudos();
  }, []);

  // Lógica de filtrado
  const datosFiltrados = datosAdeudos.filter((item) =>
    item.nombre_cliente?.toLowerCase().includes(textoBusqueda.toLowerCase()) ||
    item.localidad?.toLowerCase().includes(textoBusqueda.toLowerCase())
  );

  const handleGuardarAdeudo = () => {
    formAdeudo.validateFields().then((valores) => {
      fetch('http://localhost:5002/insertarAdeudoCliente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(valores)
      }).then(() => {
        message.success("Adeudo registrado");
        setIsAdeudoModalOpen(false);
        formAdeudo.resetFields();
        obtenerAdeudos();
      });
    });
  };

  const handleGuardarAbono = () => {
    formAbono.validateFields().then((valores) => {
      fetch('http://localhost:5002/actualizarAbonoAdeudo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pk_adeudos: selectedCliente?.key, ...valores })
      }).then(() => {
        message.success("Abono registrado");
        setIsAbonoModalOpen(false);
        formAbono.resetFields();
        obtenerAdeudos();
      });
    });
  };

  const handleGuardarMasDeuda = () => {
    formMasDeuda.validateFields().then((valores) => {
      fetch('http://localhost:5002/actualizarAdeudo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pk_adeudos: selectedCliente?.key, ...valores })
      }).then(() => {
        message.success("Deuda actualizada");
        setIsMasDeudaModalOpen(false);
        formMasDeuda.resetFields();
        obtenerAdeudos();
      });
    });
  };

  const columnasAdeudos = [
    { title: 'Nombre Cliente', dataIndex: 'nombre_cliente', key: 'nombre_cliente', className: 'font-bold text-[#01042B]' },
    { title: 'Localidad', dataIndex: 'localidad', key: 'localidad', className: 'text-gray-600' },
    { title: 'Garrafones', dataIndex: 'garrafones_deben', key: 'garrafones_deben', render: (c: number) => <Tag color="volcano">{c || 0} pzas</Tag> },
    { title: 'Saldo Pendiente', key: 'saldo', render: (_: any, r: any) => <span className="font-extrabold text-red-600">${((Number(r.total_deuda) || 0) - (Number(r.total_abonado) || 0)).toFixed(2)}</span> },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_: any, registro: any) => (
        <div className="flex gap-2">
          <button onClick={() => { setSelectedCliente(registro); setIsMasDeudaModalOpen(true); }} className="bg-green-600 text-white text-xs px-2 py-1 rounded font-bold hover:bg-green-700">+ Deuda</button>
          <button onClick={() => { setSelectedCliente(registro); setIsAbonoModalOpen(true); }} className="bg-[#01042B] text-white text-xs px-2 py-1 rounded font-bold hover:bg-opacity-90">Abonar</button>
        </div>
      ),
    },
  ];

  return (
    <>  
      <h1 className="text-4xl font-bold mb-4">Cuentas por Cobrar</h1>
      
      <div className="mb-4">
        <Input 
          placeholder="Buscar por cliente o localidad..." 
          value={textoBusqueda}
          onChange={(e) => setTextoBusqueda(e.target.value)}
          className="w-full md:w-1/3"
        />
      </div>

      <Tabla columnas={columnasAdeudos} datos={datosFiltrados} />
      
      <Boton_agregar onClick={() => setIsAdeudoModalOpen(true)}>Registrar Nuevo Adeudo</Boton_agregar>

      <Modal titulo="Registrar Cargo Inicial" isOpen={isAdeudoModalOpen} onClose={() => setIsAdeudoModalOpen(false)} onGuardar={handleGuardarAdeudo}>
        <Form form={formAdeudo} layout="vertical">
          <SelectFormularios label="Localidad" name="fk_localidad" options={[{value: 1, label: 'Centro'}]} required />
          <InputFormularios label="Nombres" name="nombres" required />
          <InputFormularios label="Apellido Paterno" name="a_paterno" required />
          <InputFormularios label="Monto Total ($)" name="monto_adeudo" type="number" required />
          <InputFormularios label="Garrafones" name="garrafones_deben" type="number" required />
        </Form>
      </Modal>

      <Modal titulo="Agregar Deuda" isOpen={isMasDeudaModalOpen} onClose={() => setIsMasDeudaModalOpen(false)} onGuardar={handleGuardarMasDeuda}>
        <Form form={formMasDeuda} layout="vertical">
          <InputFormularios label="Monto adicional ($)" name="monto_extra" type="number" required />
          <InputFormularios label="Garrafones extra" name="garrafones_extra" type="number" required />
        </Form>
      </Modal>

      <Modal titulo="Registrar Abono" isOpen={isAbonoModalOpen} onClose={() => setIsAbonoModalOpen(false)} onGuardar={handleGuardarAbono}>
        <Form form={formAbono} layout="vertical">
          <InputFormularios label="Monto a abonar ($)" name="monto_abono" type="number" required />
        </Form>
      </Modal>
    </>
  );
}

export default Lista_adeudos;