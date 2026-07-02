import React, { useState } from 'react';
import { Form, message, Tag } from 'antd';
import Tabla from "../components/Tabla";
import Boton_agregar from "../components/Boton_agregar";
import Modal from "../components/Modal";
import InputFormularios from "../components/InpurtFormularios";
import SelectFormularios from "../components/SelectFormularios";

function Lista_adeudos() {
  const [isAdeudoModalOpen, setIsAdeudoModalOpen] = useState(false);
  const [isAbonoModalOpen, setIsAbonoModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<any>(null);
  const [formAdeudo] = Form.useForm();
  const [formAbono] = Form.useForm();

  // Opciones de localidades registradas en tu sistema
  const opcionesLocalidades = [
    { value: 1, label: 'Centro' },
    { value: 2, label: 'Colonia Juárez' },
    { value: 3, label: 'Pueblo Nuevo' },
  ];

  // 1. Guardar o Crear Cliente y registrar su Adeudo
  const handleGuardarAdeudo = () => {
    formAdeudo.validateFields()
      .then((valores) => {
        /* 
          En tu Backend (Node.js), la lógica será:
          1. SELECT pk_persona FROM persona WHERE nombres = valores.nombres AND a_paterno = valores.a_paterno;
          2. Si NO existe:
             - INSERT INTO persona (nombres, a_paterno, a_materno) VALUES (...)
             - INSERT INTO cliente (fk_persona, fk_localidad) VALUES (idPersona, valores.fk_localidad)
          3. Ya teniendo el fk_cliente (nuevo o existente), haces:
             - INSERT INTO adeudos (monto_adeudo, garrafones_deben, fk_cliente) VALUES (...)
        */
        console.log("Datos enviados al servidor para procesar/crear cliente y adeudo:", valores);
        message.success("¡Operación realizada! El cliente y su adeudo han sido procesados.");
        formAdeudo.resetFields();
        setIsAdeudoModalOpen(false);
      })
      .catch((error) => console.log("Validación fallida:", error));
  };

  // 2. Registrar un abono directo
  const handleGuardarAbono = () => {
    formAbono.validateFields()
      .then((valores) => {
        const montoAbono = Number(valores.monto_abono);
        const saldoPendienteActual = selectedCliente.total_deuda - selectedCliente.total_abonado;

        if (montoAbono > saldoPendienteActual) {
          return message.error(`El abono no puede ser mayor al saldo pendiente ($${saldoPendienteActual})`);
        }

        console.log(`Registrando abono de $${montoAbono} para el adeudo ID:`, selectedCliente.key);
        message.success(`Abono de $${montoAbono} registrado correctamente.`);

        formAbono.resetFields();
        setIsAbonoModalOpen(false);
        setSelectedCliente(null);
      })
      .catch((error) => console.log("Validación fallida:", error));
  };

  const columnasAdeudos = [
    {
      title: 'Nombre Cliente',
      dataIndex: 'nombre_cliente',
      key: 'nombre_cliente',
      className: 'font-bold text-[#01042B]',
    },
    {
      title: 'Localidad',
      dataIndex: 'localidad',
      key: 'localidad',
      className: 'text-gray-600',
    },
    {
      title: 'Garrafones Debidos',
      dataIndex: 'garrafones_deben',
      key: 'garrafones_deben',
      render: (cant: number) => <Tag color="volcano" className="font-bold">{cant} pzas</Tag>
    },
    {
      title: 'Total Acumulado',
      dataIndex: 'total_deuda',
      key: 'total_deuda',
      render: (monto: number) => <span className="text-gray-500 font-medium">${monto.toFixed(2)}</span>
    },
    {
      title: 'Total Abonado',
      dataIndex: 'total_abonado',
      key: 'total_abonado',
      render: (monto: number) => <span className="text-green-600 font-medium">${monto.toFixed(2)}</span>
    },
    {
      title: 'Saldo Pendiente',
      key: 'saldo_pendiente',
      className: 'bg-slate-50',
      render: (_, registro) => {
        const pendiente = registro.total_deuda - registro.total_abonado;
        return <span className="font-extrabold text-red-600">${pendiente.toFixed(2)}</span>;
      }
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, registro) => (
        <button
          onClick={() => { setSelectedCliente(registro); setIsAbonoModalOpen(true); }}
          className="bg-[#01042B] text-white text-xs px-3 py-1.5 rounded font-bold hover:bg-opacity-90 transition-all"
        >
          Cobrar Abono
        </button>
      ),
    },
  ];

  const datosAdeudos = [
    {
      key: '1',
      fk_cliente: 101,
      nombre_cliente: 'Juan Pérez López',
      localidad: 'Centro',
      garrafones_deben: 15,
      total_deuda: 600.00,
      total_abonado: 200.00,
    },
    {
      key: '2',
      fk_cliente: 102,
      nombre_cliente: 'Abarrotes La Pasadita',
      localidad: 'Colonia Juárez',
      garrafones_deben: 5,
      total_deuda: 150.00,
      total_abonado: 50.00,
    },
  ];

  return (
    <>  
      <h1 className="text-4xl font-bold mb-4">Cuentas por Cobrar (Adeudos)</h1>
      <p className="mb-4 text-gray-600">Monitoreo de saldos financieros y envases pendientes de devolución.</p>
     
      <Tabla columnas={columnasAdeudos} datos={datosAdeudos} />
      
      <Boton_agregar onClick={() => setIsAdeudoModalOpen(true)}>
        Registrar Nuevo Adeudo
      </Boton_agregar>

      {/* MODAL A: CREAR O BUSCAR CLIENTE Y ASIGNAR ADEUDO */}
      <Modal
        titulo="Registrar Cargo / Adeudo Inicial"
        isOpen={isAdeudoModalOpen}
        onClose={() => { setIsAdeudoModalOpen(false); formAdeudo.resetFields(); }}
        onGuardar={handleGuardarAdeudo}
      >
        <Form form={formAdeudo} layout="vertical">
          
          <SelectFormularios 
            label="Localidad" 
            name="fk_localidad" 
            placeholder="Selecciona la zona o localidad" 
            options={opcionesLocalidades} 
            required 
          />

          <InputFormularios 
            label="Nombre(s) del Cliente" 
            name="nombres" 
            placeholder="Ej. Juan" 
            required 
          />

          <InputFormularios 
            label="Apellido Paterno" 
            name="a_paterno" 
            placeholder="Ej. Pérez" 
            required 
          />

          <InputFormularios 
            label="Apellido Materno" 
            name="a_materno" 
            placeholder="Ej. López (Opcional)" 
          />

          <div className="border-t my-4 pt-4 border-dashed border-gray-200"></div>

          <InputFormularios 
            label="Monto Total a Deber ($)" 
            name="monto_adeudo" 
            placeholder="Ej. 300.00" 
            type="number" 
            required 
          />

          <InputFormularios 
            label="Cantidad de Garrafones Pendientes" 
            name="garrafones_deben" 
            placeholder="Ej. 10" 
            type="number" 
            required 
          />
        </Form>
      </Modal>

      {/* MODAL B: REGISTRAR UN ABONO */}
      <Modal
        titulo={selectedCliente ? `Registrar Abono - ${selectedCliente.nombre_cliente}` : "Registrar Abono"}
        isOpen={isAbonoModalOpen}
        onClose={() => { setIsAbonoModalOpen(false); formAbono.resetFields(); setSelectedCliente(null); }}
        onGuardar={handleGuardarAbono}
      >
        <Form form={formAbono} layout="vertical">
          <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded text-sm text-[#01042B]">
            <strong>Saldo pendiente actual: </strong> 
            ${selectedCliente ? (selectedCliente.total_deuda - selectedCliente.total_abonado).toFixed(2) : '0.00'}
          </div>
          <InputFormularios label="Monto a Abonar ($)" name="monto_abono" placeholder="Ej. 100.00" type="number" required />
        </Form>
      </Modal>
    </>
  );
}

export default Lista_adeudos;