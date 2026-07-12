import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, DatePicker, Table, message, Button, ConfigProvider } from 'antd';
import { FilePdfOutlined, DashboardOutlined, ArrowUpOutlined, ArrowDownOutlined, InboxOutlined, CarryOutOutlined } from '@ant-design/icons';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function Corte_de_Caja() {
  const [datos, setDatos] = useState<any[]>([]);
  const [resumen, setResumen] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [fecha, setFecha] = useState(dayjs().format('YYYY-MM-DD'));

  const cargarDatos = async (f: string) => {
    setLoading(true);
    try {
      
      const [resMovs, resRes] = await Promise.all([
        fetch(`http://localhost:5002/obtenerCorteCaja?fecha=${f}`),
        fetch(`http://localhost:5002/obtenerResumenCorte?fecha=${f}`)
      ]);
      
      const dataMovs = await resMovs.json();
      const dataRes = await resRes.json();
      
      setDatos(Array.isArray(dataMovs) ? dataMovs : []);
      setResumen(dataRes || {});
    } catch { 
      message.error("Error al cargar la información del corte"); 
    } finally { setLoading(false); }
  };

  useEffect(() => { cargarDatos(fecha); }, [fecha]);

  const totalNeto = datos.reduce((sum, item) => sum + Number(item.monto || 0), 0);

  const generarPDF = () => {
    const doc = new jsPDF();
    doc.text(`Reporte Ejecutivo: Agua Clara - ${fecha}`, 14, 15);
    autoTable(doc, {
      head: [['Nombre', 'Concepto', 'Monto']],
      body: datos.map(item => [item.nombre_cliente, item.concepto, `$${Number(item.monto).toFixed(2)}`]),
      startY: 25,
      headStyles: { fillColor: [1, 4, 43] },
    });
    doc.save(`Corte_Ejecutivo_${fecha}.pdf`);
  };

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#01042B', borderRadius: 16 } }}>
      <div className="p-4 lg:p-8 max-w-7xl mx-auto bg-slate-50 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between mb-8 gap-4 border-b pb-6">
          <div>
            <h1 className="text-3xl font-black text-[#01042B]">Corte de Caja Ejecutivo</h1>
            <p className="text-slate-500 font-medium">Gestión integral de operaciones: Agua Clara</p>
          </div>
          <div className="flex gap-2">
            <DatePicker size="large" value={dayjs(fecha)} onChange={(d) => setFecha(d ? d.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'))} />
            <Button size="large" type="primary" icon={<FilePdfOutlined />} onClick={generarPDF} className="bg-red-600">Exportar PDF</Button>
          </div>
        </div>

        {/* MÉTRICAS PRINCIPALES */}
        <Row gutter={[24, 24]} className="mb-8">
          <Col span={12} md={6}>
            <Card className="rounded-3xl border-none shadow-sm">
              <Statistic title="Saldo Neto" value={totalNeto} prefix="$" valueStyle={{ color: '#059669', fontWeight: 900 }} />
            </Card>
          </Col>
          <Col span={12} md={6}>
            <Card className="rounded-3xl border-none shadow-sm">
              <Statistic title="Garrafones Vendidos" value={resumen.total_garrafones_vendidos || 0} prefix={<DashboardOutlined />} />
            </Card>
          </Col>
          <Col span={12} md={6}>
            <Card className="rounded-3xl border-none shadow-sm">
              <Statistic title="Fiados hoy ($)" value={resumen.total_fiado_dinero || 0} prefix="$" valueStyle={{ color: '#DC2626' }} />
            </Card>
          </Col>
          <Col span={12} md={6}>
            <Card className="rounded-3xl border-none shadow-sm">
              <Statistic title="Gastos Insumos" value={resumen.total_gasto_insumos || 0} prefix={<InboxOutlined />} />
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col span={24} lg={14}>
            <Card title="Tendencia de Flujo" className="rounded-3xl border-none shadow-sm h-full">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={datos}>
                    <Tooltip />
                    <Area type="monotone" dataKey="monto" stroke="#01042B" fill="#01042B" fillOpacity={0.1} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>
          <Col span={24} lg={10}>
            <Card title="Detalle de Movimientos" className="rounded-3xl border-none shadow-sm h-full">
              <Table 
                dataSource={datos} 
                loading={loading}
                rowKey={(record, index) => index?.toString() || '0'}
                pagination={{ pageSize: 4 }}
                columns={[
                  { title: 'Concepto', dataIndex: 'concepto' },
                  { title: 'Monto', dataIndex: 'monto', render: (m) => (
                    <span className={Number(m) < 0 ? "text-red-600 font-bold" : "text-green-600 font-bold"}>
                      {Number(m) < 0 ? <ArrowDownOutlined /> : <ArrowUpOutlined />} ${Math.abs(Number(m)).toFixed(2)}
                    </span>
                  )}
                ]}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </ConfigProvider>
  );
}

export default Corte_de_Caja;