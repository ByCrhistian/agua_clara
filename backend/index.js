const express = require("express");
const cors = require("cors");
require("dotenv").config();
const query = require("./query");

const app = express();
const PORT = 5002;

app.use(cors());
app.use(express.json());

//-----EMPIEZA API LOGIN------//
app.post("/login", (req, res) => {
  const { usuario, contrasena } = req.body;

  const sql = `
    SELECT
      v.pk_vendedor,
      v.usuario,
      v.contrasena,
      v.estatus,
      r.nom_role AS rol
    FROM vendedor v
    INNER JOIN rol_usuario ru
      ON ru.fk_vendedor = v.pk_vendedor
    INNER JOIN roles r
      ON r.pk_roles = ru.fk_roles
    WHERE v.usuario = ?
    LIMIT 1
  `;

  db.query(sql, [usuario], async (error, results) => {
    if (error) {
      return res.status(500).json({ mensaje: "Error en el servidor" });
    }

    if (results.length === 0) {
      return res.status(401).json({ mensaje: "Usuario no encontrado" });
    }

    const usuarioBD = results[0];

    if (contrasena !== usuarioBD.contrasena) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      {
        id: usuarioBD.pk_vendedor,
        rol: usuarioBD.rol,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      token,
      usuario: {
        id: usuarioBD.pk_vendedor,
        usuario: usuarioBD.usuario,
        nombre: usuarioBD.usuario,
        rol: usuarioBD.rol,
        token,
      },
    });
  });
});

// -- AQUI SE ACABA LO DE LOGIN -- //

// --- PANEL DE VIAJES --- //
app.get('/obtenerViajesRuta', async (req, res) => {
    try {
        const viajes = await query.getViajesRuta();
        res.json(viajes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los viajes de ruta' });
    }
});

app.post('/insertarViajeRuta', async (req, res) => {
    try {
        const { fk_vendedor, fk_localidad, garrafones_salida, garrafones_regreso_llenos } = req.body;
        await query.insertViajeRuta(fk_vendedor, fk_localidad, garrafones_salida, garrafones_regreso_llenos);
        res.json({ mensaje: 'Viaje de ruta registrado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar viaje de ruta' });
    }
});

app.post('/liquidarViajeRuta', async (req, res) => {
    try {
        const { pk_viajes, garrafones_regreso_llenos } = req.body;
        await query.liquidarViajeRuta(pk_viajes, garrafones_regreso_llenos);
        res.json({ mensaje: 'Viaje liquidado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al liquidar viaje' });
    }
});

// --- AUXILIARES ---
app.get('/obtenerVendedores', async (req, res) => {
    try {
        const vendedores = await query.getVendedoresOpciones();
        res.json(vendedores);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener vendedores' });
    }
});

app.get('/obtenerLocalidades', async (req, res) => {
    try {
        const localidades = await query.getLocalidadesOpciones();
        res.json(localidades);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener localidades' });
    }
});

// --- PANEL DE ADEUDOS ---
app.get('/obtenerAdeudosActivos', async (req, res) => {
    try {
        const adeudos = await query.getAdeudosActivos();
        res.json(adeudos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener adeudos' });
    }
});

app.post('/actualizarAdeudo', async (req, res) => {
    try {
        const { pk_adeudos, monto_extra, garrafones_extra } = req.body;
        await query.updateAdeudo(pk_adeudos, monto_extra, garrafones_extra);
        res.json({ mensaje: 'Adeudo actualizado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar adeudo' });
    }
});

app.post('/actualizarAbonoAdeudo', async (req, res) => {
    try {
        const { pk_adeudos, monto_abono } = req.body;
        await query.updateAbono(pk_adeudos, monto_abono);
        res.json({ mensaje: 'Abono registrado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al procesar el abono' });
    }
});

app.get('/obtenerPagados', async (req, res) => {
    try {
        const pagados = await query.getPagados();
        res.json(pagados);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el historial' });
    }
});

// --- PANEL DE INSUMOS ---
app.get('/obtenerInsumos', async (req, res) => {
    try {
        const insumos = await query.getInsumos();
        res.json(insumos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener insumos' });
    }
});

app.post('/insertarInsumo', async (req, res) => {
    try {
        const { fk_vendedor, nombre_insumo, monto_gasto, saldo_pendiente } = req.body;
        await query.insertInsumo(fk_vendedor, nombre_insumo, monto_gasto, saldo_pendiente);
        res.json({ mensaje: 'Insumo registrado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar insumo' });
    }
});

app.post('/abonarInsumo', async (req, res) => {
    try {
        const { pk, monto } = req.body;
        await query.updateAbonoInsumo(pk, monto);
        res.json({ success: true, mensaje: 'Abono aplicado exitosamente' });
    } catch (error) {
        console.error("Error en servidor al abonar insumo:", error);
        res.status(500).json({ error: 'Error al aplicar el abono' });
    }
});

app.get('/obtenerCorteCaja', async (req, res) => {
  const { fecha } = req.query;
  try {
    const data = await query.obtenerCorteCajaDB(fecha);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el corte" });
  }
});

// --- NUEVA RUTA PARA EL RESUMEN ---
app.get('/obtenerResumenCorte', async (req, res) => {
  const { fecha } = req.query;
  try {
    // Asegúrate de haber agregado 'obtenerResumenCorte' en tu query.js y module.exports
    const resumen = await query.obtenerResumenCorte(fecha);
    res.json(resumen);
  } catch (err) {
    console.error("Error al obtener resumen:", err);
    res.status(500).json({ error: "Error al obtener resumen de corte" });
  }
});



app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});