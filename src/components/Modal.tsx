import React from 'react';
import { Modal } from 'antd';

import LogoAguaClara from '../assets/Logo.png'; 

interface ModalProps {
  titulo: string;
  isOpen: boolean;
  onClose: () => void;
  onGuardar: () => void;
  children: React.ReactNode;
}

export default function ModalGenerico({ titulo, isOpen, onClose, onGuardar, children }: ModalProps) {
  return (
    <Modal
      title={<span className="text-xl font-bold text-[#01042B]">{titulo}</span>}
      open={isOpen}
      onOk={onGuardar}
      onCancel={onClose}
      okText="Guardar"
      cancelText="Cancelar"
      destroyOnClose
    >
      <div className="pt-4 relative min-h-[250px] flex flex-col justify-between overflow-hidden">
        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 select-none">
         
          <img 
            src={LogoAguaClara} 
            alt="Logo Fondo" 
            className="w-48 h-48 object-contain opacity-90 blur-[1px]" 
          />
        </div>

        <div className="relative z-10 w-full">
          {children}
        </div>

      </div>
    </Modal>
  );
}