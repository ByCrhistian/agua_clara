import React, { useState } from 'react';
import { Form, message, Tag } from 'antd';
import Tabla from "../components/Tabla";
import BotonAgregar from "../components/Boton_agregar";
import Modal from "../components/Modal";
import InputFormularios from "../components/InpurtFormularios";
import SelectFormularios from "../components/SelectFormularios";

function Lista_insumos() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInsumo, setEditingInsumo] = useState<any>(null);
  const [form] = Form.useForm();

  // El administrador aún necesita el select para saber a qué vendedor le asigna el gasto
  const opcionesVendedores = [
    { value: 1, label: 'Juan Pérez López' },
    { value: 2, label: 'Carlos Gómez Ruiz' },
  ];

  const handleGuardar = () => {
    form.validateFields()
      .then((valores) => {
        if (editingInsumo) {
          console.log("Actualizando gasto/insumo:", valores);
          message.success("¡Registro actualizado!");
        } else {
          // En MySQL, si el insumo no existe en la tabla 'insumos', tu backend primero lo creará 
          // y luego guardará la relación en 'insumos_vendedor'.
          console.log("Insertando insumo libre en MySQL:", valores);
          message.success("¡Insumo registrado con éxito!");
        }
        form.resetFields();
        setEditingInsumo(null);
        setIsModalOpen(false);
      })
      .catch((error) => console.log("Validación fallida:", error));
  };

  const handleEditar = (registro: any) => {
    setEditingInsumo(registro);
    form.setFieldsValue({
      fk_vendedor: registro.fk_vendedor,
      nombre_insumo: registro.nombre_insumo, // Ahora cargamos el texto directamente
      monto_gasto: registro.monto_gasto,
      saldo_pendiente: registro.saldo_pendiente,
    });
    setIsModalOpen(true);
  };

  const columnasInsumos = [
    { title: 'Vendedor', dataIndex: 'vendedor', key: 'vendedor', className: 'font-bold text-[#01042B]' },
    { title: 'Insumo / Concepto', dataIndex: 'nombre_insumo', key: 'nombre_insumo', className: 'font-semibold' },
    { 
      title: 'Costo Total', 
      dataIndex: 'monto_gasto', 
      key: 'monto_gasto', 
      render: (monto: number) => <span className="text-gray-700">${monto.toFixed(2)}</span> 
    },
    { 
      title: 'Saldo Pendiente', 
      dataIndex: 'saldo_pendiente', 
      key: 'saldo_pendiente', 
      render: (saldo: number) => (
        <span className={`font-bold ${saldo > 0 ? 'text-red-600' : 'text-green-600'}`}>
          ${saldo.toFixed(2)}
        </span>
      ) 
    },
    { 
      title: 'Estatus Cobro', 
      dataIndex: 'estatus_descuento', 
      key: 'estatus_descuento', 
      render: (estatus: string) => (
        <Tag color={estatus === 'Liquidado' ? 'green' : 'orange'} className="font-semibold rounded">
          {estatus}
        </Tag>
      ) 
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_: any, registro: any) => (
        <div className="flex gap-4">
          <span onClick={() => handleEditar(registro)} className="text-blue-600 font-bold cursor-pointer hover:underline">
            Editar
          </span>
        </div>
      ),
    },
  ];

  const datosInsumos = [
    { key: '1', fk_vendedor: 1, vendedor: 'Juan Pérez López', nombre_insumo: 'Refrescos y Hielo Ruta 2', monto_gasto: 85.00, saldo_pendiente: 85.00, estatus_descuento: 'Pendiente' },
    { key: '2', fk_vendedor: 2, vendedor: 'Carlos Gómez Ruiz', nombre_insumo: 'Gasolina de emergencia', monto_gasto: 200.00, saldo_pendiente: 0.00, estatus_descuento: 'Liquidado' }
  ];

  return (
    <>
      <h1 className="text-4xl font-bold mb-4">Control de Insumos y Gastos</h1>
      <p className="mb-4 text-gray-600">Lista general de insumos y gastos reportados por los choferes o asignados por el administrador.</p>

      <Tabla columnas={columnasInsumos} datos={datosInsumos} />

      <BotonAgregar onClick={() => { setEditingInsumo(null); setIsModalOpen(true); }}>
        Registrar Insumo / Gasto
      </BotonAgregar>

      <Modal
        titulo={editingInsumo ? "Modificar Cuenta de Gasto" : "Registrar Nuevo Gasto en Ruta"}
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); form.resetFields(); setEditingInsumo(null); }}
        onGuardar={handleGuardar}
      >
        <Form form={form} layout="vertical">
          
          <SelectFormularios
            label="Asignar al Vendedor"
            name="fk_vendedor"
            placeholder="Selecciona el chofer que generó el gasto"
            options={opcionesVendedores}
            required
          />

          {/* ¡Listo! Cambiado a Input de texto libre para refrescos, comidas, etc. */}
          <InputFormularios
            label="Descripción del Insumo / Gasto"
            name="nombre_insumo"
            placeholder="Ej. Coca-Cola y Sabritas, Gasolina, Tapas"
            required
          />

          <InputFormularios
            label="Monto del Gasto ($)"
            name="monto_gasto"
            placeholder="Ej. 85.00"
            type="number"
            required
          />

          <InputFormularios
            label="Saldo Pendiente por Pagar ($)"
            name="saldo_pendiente"
            placeholder="Ej. 0 si la planta lo cubre, o el mismo monto si lo debe el chofer"
            type="number"
            required
          />

        </Form>
      </Modal>
    </>
  );
}

export default Lista_insumos;