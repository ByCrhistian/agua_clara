import React from 'react';
import { Button } from 'antd';
import {PlusOutlined} from '@ant-design/icons';


interface BotonAgregarProps {
  children: React.ReactNode;
}

function BotonAgregar({ children}: BotonAgregarProps) {
  return (
    <div className="flex justify-end mb-4">
      
      <Button style={{backgroundColor: '#09355f', padding: '20px 30px', color: 'white'}} >
        <PlusOutlined style={{ color: 'white', fontSize: '20px', marginRight: '10px' }} />
        {children}
      </Button>
    </div>
  );
}

export default BotonAgregar;