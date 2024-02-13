const express = require('express');

const app = express();
const PORT = 5500;
// Middleware para CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST');  // Permitir solo solicitudes POST
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Parsear el cuerpo de la solicitud como JSON
app.use(express.json());

// Endpoint personalizado para realizar la solicitud a Cleanuri
app.post('/proxy/cleanuri', async (req, res) => {
  try {
    const cleanUriResponse = await fetch('https://cleanuri.com/api/v1/shorten', {
      method: 'POST',
      body: JSON.stringify({ url: req.body.url }), // Utilizar el cuerpo de la solicitud del frontend
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await cleanUriResponse.json();
    res.json(data);
  } catch (error) {
    console.error('Error en la solicitud a Cleanuri:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor proxy escuchando en el puerto ${PORT}`);
});