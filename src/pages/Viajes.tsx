import React, { useState, useEffect } from 'react';
import { Form, message } from 'antd';
import Tabla from "../components/Tabla";
import Boton_agregar from "../components/Boton_agregar";
import Modal from "../components/Modal";
import InputFormularios from "../components/InpurtFormularios"; 
import SelectFormularios from "../components/SelectFormularios";

function Viajes() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [datosViajes, setDatosViajes] = useState<any[]>([]);
  const [opcionesVendedores, setOpcionesVendedores] = useState<any[]>([]);
  const [opcionesLocalidades, setOpcionesLocalidades] = useState<any[]>([]);
  
  const [form] = Form.useForm();

 

  const obtenerViajesDesdeBD = () => {
    fetch('http://localhost:5002/obtenerViajesRuta')
      .then((respuesta) => respuesta.json())
      .then((data) => {
        setDatosViajes(data);
      })
      .catch((error) => {
        console.error("Error al traer viajes:", error);
        message.error("No se pudieron cargar los viajes");
      });
  };

  const obtenerVendedoresDesdeBD = () => {
    fetch('http://localhost:5002/obtenerVendedores')
      .then((respuesta) => respuesta.json())
      .then((data) => {
        const formateados = data.map((item: any) => ({
          value: item.value ?? item.VALUE ?? Object.values(item)[0],
          label: item.label ?? item.LABEL ?? Object.values(item)[1]
        }));
        setOpcionesVendedores(formateados);
      })
      .catch((error) => console.error("Error al traer vendedores:", error));
  };

  const obtenerLocalidadesDesdeBD = () => {
    fetch('http://localhost:5002/obtenerLocalidades')
      .then((respuesta) => respuesta.json())
      .then((data) => {
        const formateados = data.map((item: any) => ({
          value: item.value ?? item.VALUE ?? Object.values(item)[0],
          label: item.label ?? item.LABEL ?? Object.values(item)[1]
        }));
        setOpcionesLocalidades(formateados);
      })
      .catch((error) => console.error("Error al traer localidades:", error));
  };

  useEffect(() => {
    obtenerViajesDesdeBD();
    obtenerVendedoresDesdeBD();
    obtenerLocalidadesDesdeBD();
  }, []);

 
  const handleGuardar = () => {
    form.validateFields()
      .then((valores) => {
        fetch('http://localhost:5002/insertarViajeRuta', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(valores) 
        })
        .then((respuesta) => respuesta.json())
        .then(() => {
          message.success("¡Viaje guardado en la base de datos!");
          form.resetFields();
          setIsModalOpen(false);
          obtenerViajesDesdeBD();
        })
        .catch((error) => {
          console.error("Error al guardar viaje:", error);
          message.error("No se pudo registrar el viaje en el servidor");
        });
      })
      .catch((error) => console.log("Validación fallida:", error));
  };

  const columnasViajes = [
    { 
      title: 'Vendedor', 
      dataIndex: 'nombre_vendedor', 
      key: 'nombre_vendedor', 
      className: 'font-bold text-[#01042B]' 
    },
    { 
      title: 'Ruta / Localidad', 
      dataIndex: 'localidad', 
      key: 'localidad', 
      className: 'font-semibold' 
    },
    { 
      title: 'Fecha', 
      dataIndex: 'fecha', 
      key: 'fecha', 
      className: 'text-gray-600' 
    },
    { 
      title: 'Salida / Vendidos', 
      key: 'balance_garrafones',
      render: (_: any, registro: any) => (
        <span>
          {registro.garrafones_salida} cargados / <strong>{registro.garrafones_vendidos} vendidos</strong>
        </span>
      )
    },
    { 
      title: 'Estado Liquidación', 
      dataIndex: 'estatus_liquidacion', 
      key: 'estatus_liquidacion',
      render: (estatus: string) => (
        <span className={`px-2 py-1 rounded text-xs font-bold ${
          estatus === 'Liquidado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
        }`}>{estatus}</span>
      )
    }
  ];

  return (
    <>  
      <h1 className="text-4xl font-bold mb-4">Control de Viajes de Ruta</h1>
      <p className="mb-4 text-gray-600">Registro diario de salida de garrafones para reparto.</p>
      
      <Tabla columnas={columnasViajes} datos={datosViajes} />
      
      <Boton_agregar onClick={() => setIsModalOpen(true)}>
        Registrar Salida de Viaje
      </Boton_agregar>

      <Modal
        titulo="Abrir Nuevo Viaje de Ruta"
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); form.resetFields(); }}
        onGuardar={handleGuardar}
      >
        <Form form={form} layout="vertical">

          <SelectFormularios
            label="Asignar Vendedor / Chofer"
            name="fk_vendedor"
            placeholder="Selecciona el chofer de la ruta"
            options={opcionesVendedores}
            required
          />

          <SelectFormularios
            label="Ruta / Localidad de Destino"
            name="fk_localidad"
            placeholder="¿A qué zona va a vender?"
            options={opcionesLocalidades}
            required
          />

          <InputFormularios
            label="Cantidad de Garrafones Cargados (Salida)"
            name="garrafones_salida"
            placeholder="Ej. 120"
            type="number"
            required
          />
            
        </Form>
      </Modal>
    </>
  );
}

export default Viajes;