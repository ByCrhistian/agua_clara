
import { Card } from 'antd';

interface ContenedorFormularioProps {
  children: React.ReactNode; 
  titulo: string;         
}

export default function ContenedorFormulario({ children, titulo }: ContenedorFormularioProps) {
  return (
    
    <div className="w-full max-w-lg mx-auto p-4">
      <Card 
        title={<span className="text-xl font-bold text-[#01042B]">{titulo}</span>}
        className="shadow-lg rounded-xl border border-slate-200 overflow-hidden"
        headStyle={{ backgroundColor: '#f1f5f9' }} 
      >
        {children}
      </Card>
    </div>
  );
}