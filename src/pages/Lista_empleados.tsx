import React, { useState } from 'react';
import { Form, message, Tag } from 'antd';
import Tabla from "../components/Tabla";
import BotonAgregar from "../components/Boton_agregar";
import Modal from "../components/Modal";
import InputFormularios from "../components/InpurtFormularios";
import SelectFormularios from "../components/SelectFormularios";

function Lista_empleados() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmpleado, setEditingEmpleado] = useState<any>(null);
  const [form] = Form.useForm();

  const opcionesRoles = [
    { value: 1, label: 'Administrador' },
    { value: 2, label: 'Vendedor' },
    { value: 3, label: 'Operador' },
  ];

  const handleGuardar = () => {
    form.validateFields()
      .then((valores) => {
        if (editingEmpleado) {
          // Si valores.contrasena viene vacío, en tu backend NO la actualizas en MySQL
          console.log("Actualizando empleado. Datos:", valores);
          message.success("¡Empleado actualizado con éxito!");
        } else {
          // Al crear, valores.contrasena irá lleno para aplicarle un hash (ej. bcrypt) antes de MySQL
          console.log("Insertando nuevo empleado con contraseña:", valores.contrasena);
          message.success("¡Empleado agregado con éxito!");
        }
        form.resetFields();
        setEditingEmpleado(null);
        setIsModalOpen(false);
      })
      .catch((error) => console.log("Validación fallida:", error));
  };

  const handleEditar = (registro: any) => {
    setEditingEmpleado(registro);
    form.setFieldsValue({
      nombre: registro.nombre,
      usuario: registro.usuario,
      roles: registro.rolesIds,
      contrasena: '', // Siempre iniciamos el input vacío al editar por seguridad
    });
    setIsModalOpen(true);
  };

  const handleEliminar = (key: string) => {
    console.log("Eliminando registro con llave:", key);
    message.warning("Empleado eliminado del sistema");
  };

  const columnasEmpleados = [
    { title: 'Nombre empleado', dataIndex: 'nombre', key: 'nombre', className: 'font-bold text-[#01042B]' },
    { title: 'Usuario', dataIndex: 'usuario', key: 'usuario', className: 'text-gray-600' },
    {
      title: 'Roles Asignados',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: string[]) => (
        <>
          {roles.map((rol) => (
            <Tag color={rol === 'Administrador' ? 'red' : 'blue'} key={rol} className="font-semibold rounded">
              {rol}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_: any, registro: any) => (
        <div className="flex gap-4">
          <span onClick={() => handleEditar(registro)} className="text-blue-600 font-bold cursor-pointer hover:underline">
            Editar
          </span>
          <span onClick={() => handleEliminar(registro.key)} className="text-red-500 font-bold cursor-pointer hover:underline">
            Eliminar
          </span>
        </div>
      ),
    },
  ];

  const datosEmpleados = [
    { key: '1', nombre: 'Carlos Mendoza', usuario: 'carlos_admin', roles: ['Administrador', 'Vendedor'], rolesIds: [1, 2] },
    { key: '2', nombre: 'Juan López', usuario: 'juan_vende', roles: ['Vendedor'], rolesIds: [2] },
  ];

  return (
    <>
      <h1 className="text-4xl font-bold mb-4">Lista de Empleados</h1>
      <p className="mb-4 text-gray-600">Panel exclusivo de administración para la gestión de usuarios y accesos.</p>

      <Tabla columnas={columnasEmpleados} datos={datosEmpleados} />
      
      <BotonAgregar onClick={() => { setEditingEmpleado(null); setIsModalOpen(true); }}>
        Agregar empleado
      </BotonAgregar>

      <Modal
        titulo={editingEmpleado ? "Editar Empleado" : "Registrar Nuevo Empleado"}
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); form.resetFields(); setEditingEmpleado(null); }}
        onGuardar={handleGuardar}
      >
        <Form form={form} layout="vertical">
          
          <InputFormularios label="Nombre Completo" name="nombre" placeholder="Ingresa el nombre del empleado" required />

          <InputFormularios label="Nombre de Usuario" name="usuario" placeholder="Ej. juan_perez" required />

          {/* Campo de Contraseña Dinámico: usa tu type="password" */}
          <InputFormularios
            label={editingEmpleado ? "Nueva Contraseña (Opcional)" : "Contraseña"}
            name="contrasena"
            placeholder={editingEmpleado ? "Dejar en blanco para mantener actual" : "Crea una contraseña segura"}
            type="password"
            required={!editingEmpleado} // <-- Si NO estamos editando, se vuelve obligatorio automáticamente
          />

          <SelectFormularios label="Asignar Roles del Sistema" name="roles" placeholder="Selecciona uno o varios roles" options={opcionesRoles} mode="multiple" required />

        </Form>
      </Modal>
    </>
  );
}

export default Lista_empleados;