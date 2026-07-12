import React, { useState, useEffect } from 'react';
import { Form, message, Tag } from 'antd';
import Tabla from "../components/Tabla";
import BotonAgregar from "../components/Boton_agregar";
import Modal from "../components/Modal";
import InputFormularios from "../components/InpurtFormularios";
import SelectFormularios from "../components/SelectFormularios";

function Lista_insumos() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAbonoModalOpen, setIsAbonoModalOpen] = useState(false);
  const [insumoSeleccionado, setInsumoSeleccionado] = useState<any>(null);
  const [datosInsumos, setDatosInsumos] = useState<any[]>([]);
  const [opcionesVendedores, setOpcionesVendedores] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [formAbono] = Form.useForm();

  const cargarDatos = async () => {
    try {
      const res = await fetch('http://localhost:5002/obtenerInsumos');
      const data = await res.json();
      setDatosInsumos(Array.isArray(data) ? data : []);

      const resVend = await fetch('http://localhost:5002/obtenerVendedores');
      const dataVend = await resVend.json();
      setOpcionesVendedores(dataVend.map((v: any) => ({ value: v.value, label: v.label })));
    } catch (err) {
      console.error("Error al cargar datos:", err);
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  const handleGuardar = () => {
    form.validateFields().then(async (valores) => {
      await fetch('http://localhost:5002/insertarInsumo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(valores)
      });
      message.success("¡Registro exitoso!");
      setIsModalOpen(false);
      form.resetFields();
      cargarDatos();
    });
  };

  const handleAbonar = () => {
    formAbono.validateFields().then(async (valores) => {
      const res = await fetch('http://localhost:5002/abonarInsumo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pk: insumoSeleccionado.key, monto: valores.monto_abono })
      });
      
      if (res.ok) {
        message.success("¡Abono registrado!");
        setIsAbonoModalOpen(false);
        formAbono.resetFields();
        cargarDatos();
      } else {
        message.error("Error al registrar el abono");
      }
    });
  };

  const columnasInsumos = [
    { title: 'Vendedor', dataIndex: 'vendedor', key: 'vendedor', className: 'font-bold text-[#01042B]' },
    { title: 'Insumo', dataIndex: 'nombre_insumo', key: 'nombre_insumo' },
    { title: 'Total', dataIndex: 'monto_gasto', key: 'monto_gasto', render: (m: number) => `$${Number(m).toFixed(2)}` },
    { title: 'Pendiente', dataIndex: 'saldo_pendiente', key: 'saldo_pendiente', render: (s: number) => (
      <span className={s > 0 ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}>
        ${Number(s).toFixed(2)}
      </span>
    )},
    { title: 'Estatus', dataIndex: 'estatus_descuento', key: 'estatus_descuento', render: (e: string) => (
      <Tag color={e === 'Liquidado' ? 'green' : 'orange'} className="font-semibold">{e}</Tag>
    )},
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_: any, registro: any) => registro.saldo_pendiente > 0 && (
        <span className="text-blue-600 font-bold cursor-pointer hover:underline" onClick={() => { 
          setInsumoSeleccionado(registro); 
          setIsAbonoModalOpen(true); 
        }}>
          Abonar
        </span>
      )
    }
  ];

  return (
    <>
      <h1 className="text-4xl font-bold mb-4">Control de Insumos y Gastos</h1>
      <Tabla columnas={columnasInsumos} datos={datosInsumos} />
      
      <BotonAgregar onClick={() => setIsModalOpen(true)}>Registrar Insumo / Gasto</BotonAgregar>

      <Modal titulo="Registrar Nuevo Gasto" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onGuardar={handleGuardar}>
        <Form form={form} layout="vertical">
          <SelectFormularios label="Vendedor" name="fk_vendedor" options={opcionesVendedores} required />
          <InputFormularios label="Descripción" name="nombre_insumo" required />
          <InputFormularios label="Monto" name="monto_gasto" type="number" required />
          <InputFormularios label="Saldo Inicial" name="saldo_pendiente" type="number" required />
        </Form>
      </Modal>

      <Modal titulo={`Abonar a ${insumoSeleccionado?.nombre_insumo || ''}`} isOpen={isAbonoModalOpen} onClose={() => setIsAbonoModalOpen(false)} onGuardar={handleAbonar}>
        <Form form={formAbono} layout="vertical">
          <InputFormularios label="Monto a abonar" name="monto_abono" type="number" required />
        </Form>
      </Modal>
    </>
  );
}

export default Lista_insumos;