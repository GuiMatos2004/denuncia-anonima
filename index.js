const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Permite ler dados enviados pelo formulário
app.use(express.urlencoded({ extended: true }));

// Rota para a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para receber a denúncia
app.post('/enviar', (req, res) => {
    const { denuncia } = req.body;

    const texto = `Denúncia: ${denuncia}\nData: ${new Date().toLocaleString()}\n\n`;

    fs.appendFileSync('denuncias.txt', texto);

    res.send('Denúncia enviada com sucesso! Obrigado.');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Servidor rodando: http://localhost:${port}`);
});

