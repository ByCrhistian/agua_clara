const db = require('./db')


async function getViajesRuta() {
    const [rows] = await db.query(
        'SELECT \
            v.pk_viajes AS "key", \
            DATE_FORMAT(v.fecha_viaje, "%d/%b/%Y") AS fecha, \
            CONCAT(IFNULL(p.nombres, "Vendedor"), " ", IFNULL(p.a_paterno, "")) AS nombre_vendedor, \
            IFNULL(l.nom_localidad, "Sin Localidad") AS localidad, \
            v.garrafones_salida, \
            v.garrafones_regreso_llenos, \
            v.garrafones_vendidos, \
            v.estatus_liquidacion \
        FROM viajes v \
        LEFT JOIN vendedor ven ON v.fk_vendedor = ven.pk_vendedor \
        LEFT JOIN persona p ON ven.fk_persona = p.pk_persona \
        LEFT JOIN localidad l ON v.fk_localidad = l.pk_localidad \
        ORDER BY v.fecha_viaje DESC'
    );

    return rows;
}

async function insertViajeRuta(fk_vendedor, fk_localidad, garrafones_salida) {
    const [rows] = await db.query(
        'INSERT INTO viajes (fecha_viaje, garrafones_salida, garrafones_regreso_llenos, garrafones_vendidos, estatus_liquidacion, fk_vendedor, fk_localidad) \
        VALUES (NOW(), ?, 0, 0, "Pendiente", ?, ?)', [garrafones_salida, fk_vendedor, fk_localidad]
    );

    return rows;
}

async function liquidarViajeRuta(pk_viajes, garrafones_regreso_llenos) {
    const [viaje] = await db.query('SELECT garrafones_salida FROM viajes WHERE pk_viajes = ?', [pk_viajes]);
    
    const salida = viaje[0].garrafones_salida;
    const vendidos = salida - garrafones_regreso_llenos;

    const [rows] = await db.query(
        'UPDATE viajes \
        SET \
            garrafones_regreso_llenos = ?, \
            garrafones_vendidos = ?, \
            estatus_liquidacion = "Liquidado" \
        WHERE pk_viajes = ?', [garrafones_regreso_llenos, vendidos, pk_viajes]
    );

    return rows;
}



async function getVendedoresOpciones() {
    const [rows] = await db.query(
        'SELECT \
            v.pk_vendedor AS "value", \
            CONCAT(IFNULL(p.nombres, "Vendedor"), " ", IFNULL(p.a_paterno, "")) AS "label" \
        FROM vendedor v \
        LEFT JOIN persona p ON v.fk_persona = p.pk_persona'
    );

    return rows;
}

async function getLocalidadesOpciones() {
    const [rows] = await db.query(
        'SELECT pk_localidad AS "value", nom_localidad AS "label" FROM localidad'
    );

    return rows;
}


module.exports = {
     
    // Viajes
    getViajesRuta,
    insertViajeRuta,
    liquidarViajeRuta,

    // Auxiliares para Selectores
    getVendedoresOpciones,
    getLocalidadesOpciones
};