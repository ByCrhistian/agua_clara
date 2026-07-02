const express = require("express");
const cors = require("cors");
require("dotenv").config();
const query = require("./query");

const app = express();
const PORT = 5002;

app.use(cors());
app.use(express.json());



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
        const { fk_vendedor, fk_localidad, garrafones_salida } = req.body;
        await query.insertViajeRuta(fk_vendedor, fk_localidad, garrafones_salida);
        res.json({ mensaje: 'Viaje de ruta registrado y abierto correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar viaje de ruta' });
    }
});

app.post('/liquidarViajeRuta', async (req, res) => {
    try {
        const { pk_viajes, garrafones_regreso_llenos } = req.body;
        await query.liquidarViajeRuta(pk_viajes, garrafones_regreso_llenos);
        res.json({ mensaje: 'Viaje liquidado y conteo de garrafones guardado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al liquidar el viaje de ruta' });
    }
});



app.get('/obtenerVendedores', async (req, res) => {
    try {
        const vendedores = await query.getVendedoresOpciones();
        res.json(vendedores);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener opciones de vendedores' });
    }
});

app.get('/obtenerLocalidades', async (req, res) => {
    try {
        const localidades = await query.getLocalidadesOpciones();
        res.json(localidades);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener opciones de localidades' });
    }
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});