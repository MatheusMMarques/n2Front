const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors()); // Adicionando o middleware CORS

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.post('/search', async (req, res) => {
  const { artist, track } = req.body;

  try {
    const response = await axios.get(`https://api.lyrics.ovh/v1/${artist}/${track}`);
    const data = response.data;

    if (data.lyrics) {
      res.send(data.lyrics);
    } else {
      res.send('Letra não encontrada.');
    }
  } catch (error) {
    console.error('Erro ao buscar letra da música:', error);
    res.status(500).send('Erro ao buscar letra da música.');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
