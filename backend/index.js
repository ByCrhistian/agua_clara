const express = require("express");
const cors = require("cors");
require("dotenv").config();
const query = require("./query");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const db = require("./db");
const app = express();
const PORT = process.env.PORT || 5173;

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

// --- PANEL DE VIAJES ---
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

// --- PANEL DE ADEUDOS (COMPLETO) ---
app.get('/obtenerAdeudosActivos', async (req, res) => {
    try {
        const adeudos = await query.getAdeudosActivos();
        res.json(adeudos);
    } catch (error) {
        console.error("Error en obtenerAdeudosActivos:", error);
        res.status(500).json({ error: 'Error al obtener adeudos' });
    }
});

app.post('/actualizarAdeudo', async (req, res) => {
    try {
        const { pk_adeudos, monto_extra, garrafones_extra } = req.body;
        await query.updateAdeudo(pk_adeudos, monto_extra, garrafones_extra);
        res.json({ mensaje: 'Adeudo actualizado' });
    } catch (error) {
        console.error("Error en actualizarAdeudo:", error);
        res.status(500).json({ error: 'Error al actualizar adeudo' });
    }
});

app.post('/insertarAdeudoCliente', async (req, res) => {
    try {
        // Implementar lógica de inserción aquí si es necesaria
        res.json({ mensaje: 'Adeudo registrado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar adeudo' });
    }
});

// Reemplaza tu ruta /actualizarAbonoAdeudo existente por esta:
app.post('/actualizarAbonoAdeudo', async (req, res) => {
    try {
        const { pk_adeudos, monto_abono } = req.body;
        await query.updateAbono(pk_adeudos, monto_abono);
        res.json({ mensaje: 'Abono registrado correctamente' });
    } catch (error) {
        console.error("Error al registrar abono:", error);
        res.status(500).json({ error: 'Error al procesar el abono' });
    }
});

app.get('/obtenerPagados', async (req, res) => {
    try {
        const pagados = await query.getPagados();
        res.json(pagados);
    } catch (error) {
        console.error("Error al obtener pagados:", error);
        res.status(500).json({ error: 'Error al obtener el historial' });
    }
});



app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});