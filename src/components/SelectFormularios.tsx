import React from 'react';
import { Form, Select } from 'antd';

interface OptionType {
  value: string | number;
  label: string;
}

interface SelectProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options: OptionType[];
  mode?: 'multiple' | 'tags'; // <-- Añadimos soporte para selección múltiple
}

export default function SelectFormularios({ name, label, placeholder, required = false, options, mode }: SelectProps) {
  return (
    <Form.Item
      name={name}
      label={<span className="font-semibold text-[#01042B]">{label}</span>}
      rules={[{ required: required, message: `Por favor selecciona: ${label.toLowerCase()}` }]}
    >
      <Select
        mode={mode} // <-- Si se pasa "multiple", permitirá elegir varios roles
        placeholder={placeholder}
        className="rounded-md"
        allowClear
        options={options}
      />
    </Form.Item>
  );
}