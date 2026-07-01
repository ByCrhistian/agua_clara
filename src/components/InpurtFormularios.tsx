
import { Form, Input } from 'antd';

interface InputProps {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  type?: 'text' | 'password' | 'number';
}

function InputFormularios({ name, label, required = false, placeholder, type = 'text' }: InputProps) {
  return (
    <Form.Item
      name={name}
      label={<span className="font-semibold text-[#01042B]">{label}</span>}
      rules={[{ required: required, message: `Por favor ingresa: ${label.toLowerCase()}` }]}
    >
      {type === 'password' ? (
        <Input.Password placeholder={placeholder} className="rounded-md" />
      ) : (
        <Input placeholder={placeholder} type={type} className="rounded-md" />
      )}
    </Form.Item>
  );
}

export default InputFormularios;