const db = require('./db');

// --- PANEL DE VIAJES ---
async function getViajesRuta() {
    const [rows] = await db.query(
        'SELECT v.pk_viajes AS "key", DATE_FORMAT(v.fecha_viaje, "%d/%b/%Y") AS fecha, ' +
        'CONCAT(IFNULL(p.nombres, "Vendedor"), " ", IFNULL(p.a_paterno, "")) AS nombre_vendedor, ' +
        'IFNULL(l.nom_localidad, "Sin Localidad") AS localidad, v.garrafones_salida, ' +
        'v.garrafones_regreso_llenos, v.garrafones_vendidos, v.estatus_liquidacion ' +
        'FROM viajes v ' +
        'LEFT JOIN vendedor ven ON v.fk_vendedor = ven.pk_vendedor ' +
        'LEFT JOIN persona p ON ven.fk_persona = p.pk_persona ' +
        'LEFT JOIN localidad l ON v.fk_localidad = l.pk_localidad ' +
        'ORDER BY v.fecha_viaje DESC'
    );
    return rows;
}

async function insertViajeRuta(fk_vendedor, fk_localidad, garrafones_salida, garrafones_regreso_llenos) {
    const [rows] = await db.query(
        'INSERT INTO viajes (fecha_viaje, garrafones_salida, garrafones_regreso_llenos, garrafones_vendidos, estatus_liquidacion, fk_vendedor, fk_localidad) ' +
        'VALUES (NOW(), ?, ?, 0, "Pendiente", ?, ?)', [garrafones_salida, garrafones_regreso_llenos, fk_vendedor, fk_localidad]
    );
    return rows;
}

async function liquidarViajeRuta(pk_viajes, garrafones_regreso_llenos) {
    const [viaje] = await db.query('SELECT garrafones_salida FROM viajes WHERE pk_viajes = ?', [pk_viajes]);
    const salida = viaje[0].garrafones_salida;
    const vendidos = salida - garrafones_regreso_llenos;
    const [rows] = await db.query(
        'UPDATE viajes SET garrafones_regreso_llenos = ?, garrafones_vendidos = ?, estatus_liquidacion = "Liquidado" ' +
        'WHERE pk_viajes = ?', [garrafones_regreso_llenos, vendidos, pk_viajes]
    );
    return rows;
}

// --- AUXILIARES ---
async function getVendedoresOpciones() {
    const [rows] = await db.query(
        'SELECT v.pk_vendedor AS "value", CONCAT(IFNULL(p.nombres, "Vendedor"), " ", IFNULL(p.a_paterno, "")) AS "label" ' +
        'FROM vendedor v LEFT JOIN persona p ON v.fk_persona = p.pk_persona'
    );
    return rows;
}

async function getLocalidadesOpciones() {
    const [rows] = await db.query('SELECT pk_localidad AS "value", nom_localidad AS "label" FROM localidad');
    return rows;
}

// --- ADEUDOS ---
async function getAdeudosActivos() {
    const [rows] = await db.query(`
        SELECT 
            ap.pk_adeudos_pendientes AS "key", 
            CONCAT(p.nombres, ' ', p.a_paterno, ' ', p.a_materno) AS nombre_cliente, 
            l.nom_localidad AS localidad, 
            ap.cantidad_debida AS garrafones_deben, 
            ap.monto_deuda_original AS total_deuda, 
            ap.saldo_pendiente AS saldo_actual
        FROM persona p 
        INNER JOIN localidad l ON p.fk_localidad = l.pk_localidad 
        INNER JOIN adeudos_pendientes ap ON ap.fk_cliente = p.pk_persona
        WHERE ap.estatus_deuda = 'Pendiente' 
        AND ap.saldo_pendiente > 0
    `);
    return rows;
}

async function updateAdeudo(pk, monto_extra, garrafones_extra) {
    await db.query(`
        UPDATE adeudos_pendientes 
        SET monto_deuda_original = monto_deuda_original + ?, 
            cantidad_debida = cantidad_debida + ?,
            fecha_deuda = NOW() 
        WHERE pk_adeudos_pendientes = ?
    `, [monto_extra, garrafones_extra, pk]);
}
const updateAbono = async (pk, monto) => {
    await db.query(
        'UPDATE adeudos_pendientes SET saldo_pendiente = saldo_pendiente - ? WHERE pk_adeudos_pendientes = ?', 
        [monto, pk]
    );
    await db.query(
        'UPDATE adeudos_pendientes SET estatus_deuda = "Pagado" WHERE pk_adeudos_pendientes = ? AND saldo_pendiente <= 0', 
        [pk]
    );
};

async function getPagados() {
    const [rows] = await db.query(`
        SELECT 
            ap.pk_adeudos_pendientes AS "key", 
            CONCAT(p.nombres, ' ', p.a_paterno, ' ', p.a_materno) AS nombre_cliente, 
            ap.cantidad_debida AS garrafones_deben, 
            ap.monto_deuda_original AS monto_pagado, 
            DATE_FORMAT(ap.fecha_deuda, "%d/%b/%Y") AS fecha, 
            ap.estatus_deuda AS estatus_adeudo 
        FROM adeudos_pendientes ap 
        INNER JOIN persona p ON ap.fk_cliente = p.pk_persona 
        WHERE ap.estatus_deuda = 'Pagado'
    `);
    return rows;
}

// --- INSUMOS ---
async function getInsumos() {
    const [rows] = await db.query(`
        SELECT 
            iv.pk_insumos_vendedor AS "key", 
            CONCAT(p.nombres, ' ', p.a_paterno, ' ', p.a_materno) AS vendedor, 
            ins.nom_insumo AS nombre_insumo, 
            iv.monto_gasto, 
            iv.saldo_pendiente, 
            iv.estatus_descuento 
        FROM persona p 
        INNER JOIN vendedor v ON p.pk_persona = v.fk_persona 
        INNER JOIN viajes vi ON v.pk_vendedor = vi.fk_vendedor 
        INNER JOIN insumos_vendedor iv ON iv.fk_viajes = vi.pk_viajes 
        INNER JOIN insumos ins ON ins.pk_insumos = iv.fk_insumos
        WHERE iv.estatus_descuento = 'Pendiente'
    `);
    return rows;
}

async function insertInsumo(fk_vendedor, nombre, monto, saldo) {
    await db.query(
        'INSERT INTO insumos_vendedor (fk_vendedor, nombre_insumo, monto_gasto, saldo_pendiente) VALUES (?, ?, ?, ?)',
        [fk_vendedor, nombre, monto, saldo]
    );
}


async function updateAbonoInsumo(pk, monto) {
   
    await db.query(
        'UPDATE insumos_vendedor SET saldo_pendiente = saldo_pendiente - ? WHERE pk_insumos_vendedor = ?', 
        [monto, pk]
    );
    
  
    
    await db.query(
        'UPDATE insumos_vendedor SET estatus_descuento = "Liquidado" WHERE pk_insumos_vendedor = ? AND saldo_pendiente <= 0', 
        [pk]
    );
}

async function getSaldosVendedores() {
    const [rows] = await db.query(`
        SELECT 
            CONCAT(p.nombres, ' ', p.a_paterno) AS vendedor, 
            SUM(iv.saldo_pendiente) AS total_deuda
        FROM persona p 
        INNER JOIN vendedor v ON p.pk_persona = v.fk_persona
        INNER JOIN viajes vi ON v.pk_vendedor = vi.fk_vendedor
        INNER JOIN insumos_vendedor iv ON iv.fk_viajes = vi.pk_viajes
        WHERE iv.saldo_pendiente > 0
        GROUP BY p.pk_persona
    `);
    return rows;
}

// Asegúrate de adaptar los nombres de las columnas a tu BD real
async function obtenerCorteCajaDB(fecha) {
  const query = `
    SELECT a.fecha_abono as fecha, CONCAT(p.nombres, ' ', p.a_paterno) as nombre_cliente, 'Abono Cliente' as concepto, a.monto_abonado as monto
    FROM abonos_clientes a
    JOIN adeudos_pendientes ad ON a.fk_adeudos_pendientes = ad.pk_adeudos_pendientes
    JOIN cliente c ON ad.fk_cliente = c.pk_cliente
    JOIN persona p ON c.fk_persona = p.pk_persona
    WHERE a.fecha_abono = ?
    UNION ALL
    SELECT ai.fecha_abono as fecha, 'Vendedor' as nombre_cliente, CONCAT('Gasto Insumo: ', i.nom_insumo) as concepto, -ai.monto_abonado as monto
    FROM abonos_insumos ai
    JOIN insumos_vendedor iv ON ai.fk_insumos_vendedor = iv.pk_insumos_vendedor
    JOIN insumos i ON iv.fk_insumos = i.pk_insumos
    WHERE ai.fecha_abono = ?
  `;
  
  // pool.query debe estar correctamente definido arriba en tu archivo
  const [rows] = await db.query(query, [fecha, fecha]);
  return rows;
};

async function obtenerResumenCorte(fecha) {
  const query = `
    SELECT 
      (SELECT IFNULL(SUM(garrafones_vendidos), 0) FROM viajes WHERE DATE(fecha_viaje) = ?) as total_garrafones_vendidos,
      (SELECT IFNULL(SUM(monto_deuda_original), 0) FROM adeudos_pendientes WHERE DATE(fecha_deuda) = ?) as total_fiado_dinero,
      (SELECT IFNULL(SUM(cantidad_debida), 0) FROM adeudos_pendientes WHERE DATE(fecha_deuda) = ?) as total_garrafones_fiados,
      (SELECT IFNULL(SUM(iv.monto_gasto), 0) 
       FROM insumos_vendedor iv 
       INNER JOIN viajes v ON iv.fk_viajes = v.pk_viajes 
       WHERE DATE(v.fecha_viaje) = ?) as total_gasto_insumos
  `;
  
  const [rows] = await db.query(query, [fecha, fecha, fecha, fecha]);
  return rows[0]; 
}
module.exports = {
    getViajesRuta,
    insertViajeRuta,
    liquidarViajeRuta,
    getVendedoresOpciones,
    getLocalidadesOpciones,
    getAdeudosActivos,
    updateAdeudo,
    updateAbono,
    getPagados,
    getInsumos,
    insertInsumo,
    updateAbonoInsumo,
    getSaldosVendedores,
    obtenerCorteCajaDB,
    obtenerResumenCorte
};