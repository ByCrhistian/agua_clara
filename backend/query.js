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
            ap.saldo_pendiente AS total_abonado 
        FROM persona p 
        INNER JOIN localidad l ON p.fk_localidad = l.pk_localidad 
        INNER JOIN adeudos_pendientes ap ON ap.fk_cliente = p.pk_persona
        WHERE ap.estatus_deuda = 'Pendiente'
    `);
    return rows;
}

async function updateAdeudo(pk, monto_extra, garrafones_extra) {
    // IMPORTANTE: Asegúrate de que apunte a 'adeudos_pendientes' si esa es la tabla real
    await db.query(`
        UPDATE adeudos_pendientes 
        SET monto_deuda_original = monto_deuda_original + ?, 
            cantidad_debida = cantidad_debida + ? 
        WHERE pk_adeudos_pendientes = ?
    `, [monto_extra, garrafones_extra, pk]);
}

const updateAbono = async (pk, monto) => {
    // 1. Restamos el abono al saldo actual
    await db.query(`
        UPDATE adeudos_pendientes 
        SET saldo_pendiente = saldo_pendiente - ? 
        WHERE pk_adeudos_pendientes = ?
    `, [monto, pk]);

    // 2. Automáticamente cambiamos a "Pagado" si el saldo ya no es positivo
    await db.query(`
        UPDATE adeudos_pendientes 
        SET estatus_deuda = 'Pagado' 
        WHERE pk_adeudos_pendientes = ? AND saldo_pendiente <= 0
    `, [pk]);
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
        ORDER BY ap.fecha_deuda DESC
    `);
    return rows;
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
    getPagados
};