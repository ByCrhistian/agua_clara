import React from 'react';
import { Card } from 'antd';

interface ContenedorFormularioProps {
  titulo: string;            
  children: React.ReactNode; 
}

function ContenedorFormulario({ titulo, children }: ContenedorFormularioProps) {
  return (
    <div className="w-full max-w-lg mx-auto p-4">
      <Card
        title={<span className="text-xl font-bold text-[#01042B]">{titulo}</span>}
        className="shadow-lg rounded-xl border border-slate-200 overflow-hidden"
        
        styles={{ header: { backgroundColor: '#f1f5f9' } }} 
      >
        {children}
      </Card>
    </div>
  );
}

export default ContenedorFormulario;