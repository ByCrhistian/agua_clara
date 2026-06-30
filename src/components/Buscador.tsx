import React from 'react';
import { Input } from 'antd';

// 1. Definimos qué propiedades (props) puede recibir nuestro buscador
interface BuscadorProps {
  placeholder?: string;   // El texto de fondo (opcional)
  onBuscar: (value: string) => void; // La función que se ejecuta al escribir
  className?: string;     // Para poder darle estilos extra desde fuera si hace falta
}

export default function Buscador({ placeholder = "Buscar...", onBuscar, className }: BuscadorProps) {
  return (
    <Input
      placeholder={placeholder}
      className={`w-44 rounded-md font-medium text-slate-700 border-none bg-white placeholder:text-slate-400 ${className}`}
      // onChange captura lo que el usuario escribe en tiempo real
      onChange={(e) => onBuscar(e.target.value)} 
      allowClear // Esto añade una "X" automática para limpiar el texto cuando escribes
    />
  );
}