import React, { useState, useEffect } from 'react';
import { Form, message, Tag, Input, Row, Col } from 'antd';
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
  const [localidades, setLocalidades] = useState<any[]>([]);
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [selectedCliente, setSelectedCliente] = useState<any>(null);

  const [formAdeudo] = Form.useForm();
  const [formAbono] = Form.useForm();
  const [formMasDeuda] = Form.useForm();

  const obtenerAdeudos = async () => {
    try {
      const res = await fetch('http://localhost:5002/obtenerAdeudosActivos');
      const data = await res.json();
      setDatosAdeudos(Array.isArray(data) ? data : []);
    } catch { 
      setDatosAdeudos([]); 
    }
  };

  const obtenerLocalidades = async () => {
    try {
      const res = await fetch('http://localhost:5002/obtenerLocalidades');
      const data = await res.json();
      setLocalidades(data); 
    } catch (err) {
      console.error("Error al cargar localidades:", err);
    }
  };

  useEffect(() => {
    obtenerAdeudos();
    obtenerLocalidades();
  }, []);

  // --- NUEVA FUNCIÓN PARA REGISTRAR ADEUDO ---
  const onFinishAdeudo = async (valores: any) => {
    try {
      const res = await fetch('http://localhost:5002/registrarAdeudoCompleto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombres: valores.nombres,
          a_paterno: valores.a_paterno,
          a_materno: valores.a_materno || '',
          fk_localidad: valores.fk_localidad,
          monto: Number(valores.monto_adeudo),
          garrafones: Number(valores.garrafones_deben)
        })
      });
      if (res.ok) {
        message.success("Registro de adeudo exitoso");
        setIsAdeudoModalOpen(false);
        formAdeudo.resetFields();
        obtenerAdeudos();
      }
    } catch (err) {
      message.error("Error al registrar nuevo adeudo");
    }
  };

  const onFinishAbono = async (valores: any) => {
    if (!selectedCliente?.key) return;
    try {
      const res = await fetch("http://localhost:5002/actualizarAbonoAdeudo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pk_adeudos: selectedCliente.key, monto_abono: Number(valores.monto_abono) }),
      });
      if (res.ok) {
        message.success("Abono registrado correctamente.");
        setIsAbonoModalOpen(false);
        formAbono.resetFields();
        obtenerAdeudos();
      }
    } catch (err) { message.error("Error de conexión."); }
  };

  const onFinishMasDeuda = async (valores: any) => {
    if (!selectedCliente?.key) return;
    try {
      const res = await fetch("http://localhost:5002/actualizarAdeudo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          pk_adeudos: selectedCliente.key, 
          monto_extra: Number(valores.monto_extra),
          garrafones_extra: Number(valores.garrafones_extra) 
        }),
      });
      if (res.ok) {
        message.success("Deuda actualizada correctamente.");
        setIsMasDeudaModalOpen(false);
        formMasDeuda.resetFields();
        obtenerAdeudos();
      }
    } catch (err) { message.error("Error de conexión."); }
  };

  const columnasAdeudos = [
    { title: 'Nombre Cliente', dataIndex: 'nombre_cliente', className: 'font-bold text-[#01042B]' },
    { title: 'Localidad', dataIndex: 'localidad' },
    { title: 'Garrafones', dataIndex: 'garrafones_deben', render: (c: number) => <Tag color="volcano">{c || 0} pzas</Tag> },
    { title: 'Saldo Pendiente', render: (_: any, r: any) => <span className="font-extrabold text-red-600">${Number(r.saldo_actual || 0).toFixed(2)}</span> },
    {
      title: 'Acciones',
      render: (_: any, r: any) => (
        <div className="flex gap-2">
          <button onClick={() => { setSelectedCliente(r); setIsMasDeudaModalOpen(true); }} className="bg-green-600 text-white text-xs px-2 py-1 rounded font-bold">+ Deuda</button>
          <button onClick={() => { setSelectedCliente(r); setIsAbonoModalOpen(true); }} className="bg-[#01042B] text-white text-xs px-2 py-1 rounded font-bold">Abonar</button>
        </div>
      ),
    },
  ];

  return (
    <>
      <h1 className="text-4xl font-bold mb-6 text-[#01042B]">Cuentas por Cobrar</h1>
      <div className="mb-6"><Input.Search placeholder="Buscar cliente..." onSearch={setTextoBusqueda} className="w-full md:w-1/3" /></div>
      <Tabla columnas={columnasAdeudos} datos={datosAdeudos.filter(i => i.nombre_cliente?.toLowerCase().includes(textoBusqueda.toLowerCase()))} />
      <Boton_agregar onClick={() => setIsAdeudoModalOpen(true)}>Registrar Nuevo Adeudo</Boton_agregar>

      {/* MODAL NUEVO ADEUDO */}
      <Modal titulo="Nuevo Cargo" isOpen={isAdeudoModalOpen} onClose={() => { formAdeudo.resetFields(); setIsAdeudoModalOpen(false); }} onGuardar={() => formAdeudo.submit()}>
        <Form form={formAdeudo} layout="vertical" onFinish={onFinishAdeudo}>
          <Row gutter={16}>
            <Col span={12}><InputFormularios label="Nombres" name="nombres" required /></Col>
            <Col span={12}><SelectFormularios label="Localidad" name="fk_localidad" options={localidades} required /></Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}><InputFormularios label="Ap. Paterno" name="a_paterno" required /></Col>
            <Col span={12}><InputFormularios label="Ap. Materno" name="a_materno" /></Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}><InputFormularios label="Monto Total ($)" name="monto_adeudo" type="number" required /></Col>
            <Col span={12}><InputFormularios label="Garrafones" name="garrafones_deben" type="number" required /></Col>
          </Row>
        </Form>
      </Modal>

      <Modal titulo="Agregar Deuda" isOpen={isMasDeudaModalOpen} onClose={() => { formMasDeuda.resetFields(); setIsMasDeudaModalOpen(false); }} onGuardar={() => formMasDeuda.submit()}>
        <Form form={formMasDeuda} layout="vertical" onFinish={onFinishMasDeuda}>
          <InputFormularios label="Monto adicional ($)" name="monto_extra" type="number" required />
          <InputFormularios label="Garrafones extra" name="garrafones_extra" type="number" required />
        </Form>
      </Modal>

      <Modal titulo="Registrar Abono" isOpen={isAbonoModalOpen} onClose={() => { formAbono.resetFields(); setIsAbonoModalOpen(false); }} onGuardar={() => formAbono.submit()}>
        <Form form={formAbono} layout="vertical" onFinish={onFinishAbono}>
          <InputFormularios label="Monto a abonar ($)" name="monto_abono" type="number" required />
        </Form>
      </Modal>
    </>
  );
}

export default Lista_adeudos;